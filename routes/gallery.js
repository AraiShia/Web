const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// 生产环境数据存储在 persistent/data 目录
const DATA_DIR = path.join(__dirname, '../persistent/data');
const DATA_FILE = path.join(DATA_DIR, 'gallery.json');

// 确保数据目录存在
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 初始化默认数据
function initDefaultData() {
    if (!fs.existsSync(DATA_FILE)) {
        const defaultData = {
            gallery: [
                { id: '1', image: '', alt: 'Gaming Setup 1' },
                { id: '2', image: '', alt: 'Gaming Setup 2' },
                { id: '3', image: '', alt: 'Gaming Setup 3' },
                { id: '4', image: '', alt: 'Gaming Setup 4' },
                { id: '5', image: '', alt: 'Gaming Setup 5' },
                { id: '6', image: '', alt: 'Gaming Setup 6' }
            ]
        };
        fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
        return defaultData;
    }
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

// Helper functions
function readGallery() {
    try {
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch (error) {
        return initDefaultData();
    }
}

function writeGallery(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET /api/gallery - Get all gallery items
router.get('/', (req, res) => {
    try {
        const data = readGallery();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/gallery - Update gallery item
router.put('/:id', (req, res) => {
    try {
        const data = readGallery();
        const index = data.gallery.findIndex(g => g.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ message: 'Gallery item not found' });
        }
        
        data.gallery[index] = {
            ...data.gallery[index],
            ...req.body,
            id: req.params.id
        };
        
        writeGallery(data);
        res.json(data.gallery[index]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/gallery - Update all gallery items
router.put('/', (req, res) => {
    try {
        const data = { gallery: req.body.gallery || [] };
        writeGallery(data);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
