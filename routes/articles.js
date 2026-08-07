const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// 数据目录（由 server.js 自动检测并设置到 global.DATA_DIR）
const DATA_DIR = global.DATA_DIR || path.join(__dirname, '../persistent/data');
const DATA_FILE = path.join(DATA_DIR, 'articles.json');

// 确保数据目录存在
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper functions
function readArticles() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { articles: [] };
    }
}

function writeArticles(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET /api/articles - Get all articles with filtering and pagination
router.get('/', (req, res) => {
    try {
        const { category, tag, search, page = 1, limit = 9, featured } = req.query;
        const data = readArticles();
        let articles = data.articles.filter(a => a.isPublished);

        // Filter by category
        if (category && category !== 'all') {
            articles = articles.filter(a => a.category === category);
        }

        // Filter by tag
        if (tag) {
            articles = articles.filter(a => a.tags.includes(tag));
        }

        // Search
        if (search) {
            const searchLower = search.toLowerCase();
            articles = articles.filter(a => 
                a.title.toLowerCase().includes(searchLower) ||
                a.excerpt.toLowerCase().includes(searchLower) ||
                a.content.toLowerCase().includes(searchLower)
            );
        }

        // Filter featured only
        if (featured === 'true') {
            articles = articles.filter(a => a.isFeatured);
        }

        // Sort by date (newest first)
        articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

        // Pagination
        const total = articles.length;
        const startIndex = (page - 1) * limit;
        const paginatedArticles = articles.slice(startIndex, startIndex + parseInt(limit));

        res.json({
            articles: paginatedArticles,
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/articles/popular - Get popular articles
router.get('/popular', (req, res) => {
    try {
        const { limit = 5 } = req.query;
        const data = readArticles();
        const articles = data.articles
            .filter(a => a.isPublished)
            .sort((a, b) => b.views - a.views)
            .slice(0, parseInt(limit));
        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/articles/:slug - Get single article by slug
router.get('/:slug', (req, res) => {
    try {
        const data = readArticles();
        const article = data.articles.find(a => a.slug === req.params.slug);
        
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        // Increment views
        article.views += 1;
        writeArticles(data);

        res.json(article);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/articles - Create new article
router.post('/', (req, res) => {
    try {
        const data = readArticles();
        const article = {
            id: Date.now().toString(),
            ...req.body,
            slug: req.body.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
            views: 0,
            isPublished: req.body.isPublished || false,
            publishedAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0]
        };
        data.articles.push(article);
        writeArticles(data);
        res.status(201).json(article);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/articles/:id - Update article
router.put('/:id', (req, res) => {
    try {
        const data = readArticles();
        const index = data.articles.findIndex(a => a.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ message: 'Article not found' });
        }

        data.articles[index] = {
            ...data.articles[index],
            ...req.body,
            updatedAt: new Date().toISOString().split('T')[0]
        };
        writeArticles(data);
        res.json(data.articles[index]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /api/articles/:id - Delete article
router.delete('/:id', (req, res) => {
    try {
        const data = readArticles();
        const index = data.articles.findIndex(a => a.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ message: 'Article not found' });
        }

        data.articles.splice(index, 1);
        writeArticles(data);
        res.json({ message: 'Article deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
