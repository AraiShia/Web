const express = require('express');
const fs = require('fs');
const path = require('path');
const { requireAuth } = require('./auth');

const router = express.Router();

const DATA_FILE = path.join(__dirname, '../persistent/data/products.json');
console.log('DATA_FILE =', DATA_FILE);

// 读取产品数据
function readProducts() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading products file:', err.message);
    return [];
  }
}

// 写入产品数据
function writeProducts(products) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing products file:', err.message);
    return false;
  }
}

// 生成唯一 ID
function generateId() {
  return 'prod-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8);
}

// 获取产品列表
router.get('/', (req, res) => {
  const { category } = req.query;
  let products = readProducts();

  if (category && category !== 'all') {
    products = products.filter(p => p.category === category);
  }

  // 只返回活跃产品
  products = products.filter(p => p.isActive !== false);

  res.json({ products, total: products.length });
});

// 获取单个产品 (支持 ID 或 slug)
router.get('/:idOrSlug', (req, res) => {
  const products = readProducts();
  const param = req.params.idOrSlug;

  // 先尝试按 ID 查找，再按 slug 查找
  let product = products.find(p => p.id === param && p.isActive !== false);
  if (!product) {
    product = products.find(p => p.slug === param && p.isActive !== false);
  }

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.json(product);
});

// 创建产品（需要认证）
router.post('/', requireAuth, (req, res) => {
  const products = readProducts();

  const newProduct = {
    id: generateId(),
    slug: req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    name: req.body.name,
    category: req.body.category,
    price: Number(req.body.price),
    originalPrice: req.body.originalPrice ? Number(req.body.originalPrice) : null,
    badge: req.body.badge || '',
    description: req.body.description,
    features: req.body.features || [],
    images: req.body.images || [],
    stock: Number(req.body.stock) || 0,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  products.push(newProduct);

  if (writeProducts(products)) {
    res.status(201).json(newProduct);
  } else {
    res.status(500).json({ message: 'Failed to save product' });
  }
});

// 更新产品（需要认证）
router.put('/:id', requireAuth, (req, res) => {
  const products = readProducts();
  const index = products.findIndex(p => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const updated = {
    ...products[index],
    name: req.body.name !== undefined ? req.body.name : products[index].name,
    category: req.body.category !== undefined ? req.body.category : products[index].category,
    price: req.body.price !== undefined ? Number(req.body.price) : products[index].price,
    originalPrice: req.body.originalPrice !== undefined ? (req.body.originalPrice ? Number(req.body.originalPrice) : null) : products[index].originalPrice,
    badge: req.body.badge !== undefined ? req.body.badge : products[index].badge,
    description: req.body.description !== undefined ? req.body.description : products[index].description,
    features: req.body.features !== undefined ? req.body.features : products[index].features,
    images: req.body.images !== undefined ? req.body.images : products[index].images,
    stock: req.body.stock !== undefined ? Number(req.body.stock) : products[index].stock,
    isActive: req.body.isActive !== undefined ? req.body.isActive : products[index].isActive,
    updatedAt: new Date().toISOString(),
  };

  // 如果名称变了，更新 slug
  if (req.body.name && req.body.name !== products[index].name) {
    updated.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  products[index] = updated;

  if (writeProducts(products)) {
    res.json(updated);
  } else {
    res.status(500).json({ message: 'Failed to update product' });
  }
});

// 删除产品（需要认证）
router.delete('/:id', requireAuth, (req, res) => {
  let products = readProducts();
  const index = products.findIndex(p => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  products.splice(index, 1);

  if (writeProducts(products)) {
    res.json({ message: 'Product deleted successfully' });
  } else {
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

module.exports = router;