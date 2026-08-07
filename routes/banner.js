const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// 生产环境数据存储在 persistent/data 目录
const DATA_DIR = global.DATA_DIR || path.join(__dirname, '../persistent/data');
const DATA_FILE = path.join(DATA_DIR, 'banner.json');

// 确保数据目录存在
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 初始化默认数据
function initDefaultData() {
    if (!fs.existsSync(DATA_FILE)) {
        const defaultData = {
            banner: {
                enabled: true,
                badge: 'SPECIAL OFFER',
                text: 'Up to 15% Off - Limited Time Only!',
                code: 'USE: SOINP2026'
            }
        };
        fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
        return defaultData;
    }
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

// Helper functions
function readBanner() {
    try {
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch (error) {
        return initDefaultData();
    }
}

function writeBanner(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET /api/banner - Get banner content
router.get('/', (req, res) => {
    try {
        const data = readBanner();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/banner - Update banner content
router.put('/', (req, res) => {
    try {
        const data = {
            banner: {
                enabled: req.body.enabled !== undefined ? req.body.enabled : true,
                badge: req.body.badge || 'SPECIAL OFFER',
                text: req.body.text || '',
                code: req.body.code || ''
            }
        };
        writeBanner(data);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;