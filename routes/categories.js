const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// 生产环境数据存储在 persistent/data 目录
const DATA_DIR = path.join(__dirname, '../../persistent/data');
const DATA_FILE = path.join(DATA_DIR, 'categories.json');

// 确保数据目录存在
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 初始化默认数据
function initDefaultData() {
    if (!fs.existsSync(DATA_FILE)) {
        const defaultData = {
            categories: [
                {
                    id: 'gaming-chairs',
                    name: 'GAMING CHAIRS',
                    description: 'Professional gaming chairs with ergonomic design for ultimate comfort during long gaming sessions.',
                    image: '/cate_pic/Chair.png',
                    badge: 'HOT',
                    isComingSoon: false
                },
                {
                    id: 'gaming-desks',
                    name: 'GAMING DESKS',
                    description: 'Spacious desktop space with smart cable management for the perfect gaming station.',
                    image: '/cate_pic/DESK.png',
                    badge: 'COMING SOON',
                    isComingSoon: true
                },
                {
                    id: 'accessories',
                    name: 'ACCESSORIES',
                    description: 'Mouse pads, headset stands, wrist rests and more to enhance your gaming experience.',
                    image: '/cate_pic/accessories.png',
                    badge: 'COMING SOON',
                    isComingSoon: true
                }
            ]
        };
        fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
        return defaultData;
    }
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

// Helper functions
function readCategories() {
    try {
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch (error) {
        return initDefaultData();
    }
}

function writeCategories(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET /api/categories - Get all categories with product counts
router.get('/', async (req, res) => {
    try {
        const data = readCategories();
        
        // 读取产品数据获取分类产品数量
        const productsFile = path.join(DATA_DIR, 'products.json');
        let productCounts = {};
        
        try {
            if (fs.existsSync(productsFile)) {
                const products = JSON.parse(fs.readFileSync(productsFile, 'utf8'));
                products.forEach(p => {
                    if (p.isActive !== false) {
                        productCounts[p.category] = (productCounts[p.category] || 0) + 1;
                    }
                });
            }
        } catch (e) {
            console.error('Error reading products:', e);
        }
        
        // 添加产品数量到分类
        data.categories = data.categories.map(cat => ({
            ...cat,
            productCount: productCounts[cat.id] || 0
        }));
        
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/categories/:id - Get single category
router.get('/:id', (req, res) => {
    try {
        const data = readCategories();
        const category = data.categories.find(c => c.id === req.params.id);
        
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/categories/:id - Update category
router.put('/:id', (req, res) => {
    try {
        const data = readCategories();
        const index = data.categories.findIndex(c => c.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ message: 'Category not found' });
        }
        
        data.categories[index] = {
            ...data.categories[index],
            ...req.body,
            id: req.params.id
        };
        
        writeCategories(data);
        res.json(data.categories[index]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/categories - Update all categories
router.put('/', (req, res) => {
    try {
        const data = { categories: req.body.categories || [] };
        writeCategories(data);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
