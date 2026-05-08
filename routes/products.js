const express = require('express');
const Joi = require('joi');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// 验证规则
const productCreateSchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  category: Joi.string().required().valid('gaming-chairs', 'gaming-desks', 'mouse-pads', 'accessories'),
  price: Joi.number().required().min(0),
  originalPrice: Joi.number().min(0).optional(),
  badge: Joi.string().max(20).optional(),
  description: Joi.string().required().min(10).max(2000),
  features: Joi.array().items(Joi.string().max(100)).max(20).optional(),
  images: Joi.array().items(Joi.string().uri()).max(10).optional(),
  stock: Joi.number().integer().min(0).default(0),
  isActive: Joi.boolean().default(true),
});

const productUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  category: Joi.string().valid('gaming-chairs', 'gaming-desks', 'mouse-pads', 'accessories').optional(),
  price: Joi.number().min(0).optional(),
  originalPrice: Joi.number().min(0).optional(),
  badge: Joi.string().max(20).optional(),
  description: Joi.string().min(10).max(2000).optional(),
  features: Joi.array().items(Joi.string().max(100)).max(20).optional(),
  images: Joi.array().items(Joi.string().uri()).max(10).optional(),
  stock: Joi.number().integer().min(0).optional(),
  isActive: Joi.boolean().optional(),
});

// 公开路由 - 获取产品列表
router.get('/', async (req, res, next) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 10));
    let query = { isActive: true };

    if (category && category !== 'all') {
      query.category = category;
    }

    const [products, total] = await Promise.all([
      Product.find(query)
        .select('name slug category price originalPrice badge description images stock')
        .lean()
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Product.countDocuments(query),
    ]);

    res.json({ products, total, page: pageNum, limit: limitNum });
  } catch (error) {
    next(error);
  }
});

// 公开路由 - 获取单个产品
router.get('/:slug', async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true }).lean();
    if (!product) {
      return res.status(404).json({ message: '产品未找到' });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
});

// 受保护路由 - 创建产品
router.post('/', auth, validate(productCreateSchema), async (req, res, next) => {
  try {
    const product = new Product({
      ...req.body,
      slug: req.body.name.toLowerCase().replace(/\s+/g, '-'),
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

// 受保护路由 - 更新产品
router.put('/:id', auth, validate(productUpdateSchema), async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ message: '产品未找到' });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
});

// 受保护路由 - 删除产品
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: '产品未找到' });
    }
    res.json({ message: '产品已成功删除' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
