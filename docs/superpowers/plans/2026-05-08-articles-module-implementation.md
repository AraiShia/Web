# 文章模块实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 为 Soinp Gaming 网站添加完整的文章/博客模块，支持行业资讯、使用指南、博客文章和客户案例四种内容类型。

**架构：** 使用 JSON 文件存储文章数据（与现有 products.json 架构一致），前端页面直接读取，后台管理使用 RESTful API。

**技术栈：** Node.js/Express、MongoDB（如用于管理）、原生 JavaScript、HTML/CSS

---

## 文件结构

```
/data
  articles.json              # 文章数据存储

/routes
  articles.js               # 文章管理 API

/public
  js/articles.js            # 文章页面逻辑
  articles.html             # 文章列表页面
  article.html              # 文章详情页面

/admin
  (扩展现有 admin.html)
```

---

## 任务清单

### 任务 1：创建文章数据文件和 API 路由

**文件：**
- 创建：`data/articles.json`
- 创建：`routes/articles.js`
- 修改：`server.js`

- [ ] **步骤 1：创建示例文章数据文件**

```json
{
  "articles": [
    {
      "id": "1",
      "title": "The Future of Gaming Furniture: Ergonomics Meets Innovation",
      "slug": "future-of-gaming-furniture",
      "category": "news",
      "tags": ["gaming", "ergonomics", "innovation"],
      "author": "Soinp Team",
      "authorAvatar": "",
      "coverImage": "",
      "excerpt": "Discover how gaming furniture is evolving to meet the demands of professional gamers and casual players alike.",
      "content": "<p>Gaming furniture has come a long way...</p>",
      "views": 1250,
      "isFeatured": true,
      "isPublished": true,
      "publishedAt": "2026-05-01",
      "updatedAt": "2026-05-01",
      "seo": {
        "metaTitle": "The Future of Gaming Furniture",
        "metaDescription": "Discover how gaming furniture is evolving to meet the demands of professional gamers.",
        "keywords": "gaming furniture, ergonomic gaming chair, gaming desk trends"
      }
    },
    {
      "id": "2",
      "title": "How to Choose the Perfect Gaming Chair for Your Setup",
      "slug": "how-to-choose-gaming-chair",
      "category": "guide",
      "tags": ["guide", "gaming chair", "buying guide"],
      "author": "Soinp Team",
      "authorAvatar": "",
      "coverImage": "",
      "excerpt": "A comprehensive guide to selecting the right gaming chair for your body type, gaming style, and budget.",
      "content": "<p>Choosing the right gaming chair...</p>",
      "views": 890,
      "isFeatured": true,
      "isPublished": true,
      "publishedAt": "2026-04-28",
      "updatedAt": "2026-04-28",
      "seo": {
        "metaTitle": "How to Choose the Perfect Gaming Chair",
        "metaDescription": "A comprehensive guide to selecting the right gaming chair.",
        "keywords": "how to choose gaming chair, best gaming chair guide"
      }
    },
    {
      "id": "3",
      "title": "5 Tips to Maintain Your Gaming Chair",
      "slug": "gaming-chair-maintenance-tips",
      "category": "guide",
      "tags": ["guide", "maintenance", "gaming chair care"],
      "author": "Soinp Team",
      "authorAvatar": "",
      "coverImage": "",
      "excerpt": "Keep your gaming chair in top condition with these 5 essential maintenance tips.",
      "content": "<p>Regular maintenance...</p>",
      "views": 567,
      "isFeatured": false,
      "isPublished": true,
      "publishedAt": "2026-04-25",
      "updatedAt": "2026-04-25",
      "seo": {
        "metaTitle": "5 Tips to Maintain Your Gaming Chair",
        "metaDescription": "Keep your gaming chair in top condition with these essential maintenance tips.",
        "keywords": "gaming chair maintenance, chair care tips"
      }
    },
    {
      "id": "4",
      "title": "Why Soinp Chairs Are the Choice of Pro Gamers",
      "slug": "soinp-pro-gamers-choice",
      "category": "blog",
      "tags": ["blog", "esports", "pro gamers"],
      "author": "Soinp Team",
      "authorAvatar": "",
      "coverImage": "",
      "excerpt": "Professional esports teams around the world trust Soinp for their gaming setups.",
      "content": "<p>In the competitive world...</p>",
      "views": 2100,
      "isFeatured": true,
      "isPublished": true,
      "publishedAt": "2026-04-20",
      "updatedAt": "2026-04-20",
      "seo": {
        "metaTitle": "Why Pro Gamers Choose Soinp Chairs",
        "metaDescription": "Discover why professional esports teams trust Soinp for their gaming setups.",
        "keywords": "pro gamer gaming chair, esports furniture"
      }
    },
    {
      "id": "5",
      "title": "The Ultimate Gaming Room Setup Guide",
      "slug": "ultimate-gaming-room-setup",
      "category": "blog",
      "tags": ["blog", "gaming setup", "room design"],
      "author": "Soinp Team",
      "authorAvatar": "",
      "coverImage": "",
      "excerpt": "Transform your space into the perfect gaming sanctuary with our comprehensive room setup guide.",
      "content": "<p>Creating the perfect gaming room...</p>",
      "views": 1580,
      "isFeatured": false,
      "isPublished": true,
      "publishedAt": "2026-04-15",
      "updatedAt": "2026-04-15",
      "seo": {
        "metaTitle": "The Ultimate Gaming Room Setup Guide",
        "metaDescription": "Transform your space into the perfect gaming sanctuary.",
        "keywords": "gaming room setup, gaming space design"
      }
    },
    {
      "id": "6",
      "title": "TechCorp's Gaming Lounge Transformation",
      "slug": "techcorp-gaming-lounge-case",
      "category": "case",
      "tags": ["case study", "corporate", "gaming lounge"],
      "author": "Soinp Team",
      "authorAvatar": "",
      "coverImage": "",
      "excerpt": "See how TechCorp transformed their employee break room into an amazing gaming lounge.",
      "content": "<p>TechCorp wanted to create...</p>",
      "views": 445,
      "isFeatured": false,
      "isPublished": true,
      "publishedAt": "2026-04-10",
      "updatedAt": "2026-04-10",
      "seo": {
        "metaTitle": "TechCorp Gaming Lounge Case Study",
        "metaDescription": "See how TechCorp transformed their break room into an amazing gaming lounge.",
        "keywords": "corporate gaming lounge, office gaming room"
      }
    }
  ]
}
```

- [ ] **步骤 2：创建文章 API 路由文件**

```javascript
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/articles.json');

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
```

- [ ] **步骤 3：更新 server.js 引入文章路由**

在 server.js 中添加：
```javascript
const articlesRoutes = require('./routes/articles');
// ...
app.use('/api/articles', articlesRoutes);
```

- [ ] **步骤 4：Commit**

```bash
git add data/articles.json routes/articles.js server.js
git commit -m "feat: add articles API routes and sample data"
```

---

### 任务 2：创建文章列表页面

**文件：**
- 创建：`public/articles.html`
- 创建：`public/js/articles.js`
- 创建：`public/css/article.css`

- [ ] **步骤 1：创建文章列表页面 HTML**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Articles - Soinp Gaming</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/article.css">
</head>
<body>
    <!-- Discount Banner -->
    <div id="discountBanner" class="discount-banner">
        <div class="container" style="display:flex; align-items:center; justify-content:center; gap:20px;">
            <span>🔥 MEMORIAL DAY SALE: Up to 50% OFF Gaming Chairs + Desks!</span>
            <a href="/products.html?category=gaming-chairs" class="banner-btn">SHOP NOW</a>
            <button onclick="document.getElementById('discountBanner').style.display='none'" style="background:none; border:none; color:#fff; cursor:pointer; font-size:20px;">×</button>
        </div>
    </div>

    <!-- Header -->
    <header class="site-header">
        <nav class="navbar">
            <a href="/" class="logo">
                <span class="logo-icon">🎮</span>
                <span class="logo-text">SOINP</span>
            </a>
            <ul class="nav-menu">
                <li><a href="/">HOME</a></li>
                <li class="dropdown">
                    <a href="/products.html">PRODUCTS</a>
                    <div class="dropdown-content">
                        <a href="/products.html?category=gaming-chairs">Gaming Chairs</a>
                        <a href="/products.html?category=gaming-desks">Gaming Desks</a>
                        <a href="/products.html?category=mouse-pads">Mouse Pads</a>
                        <a href="/products.html?category=accessories">Accessories</a>
                    </div>
                </li>
                <li><a href="/articles.html" class="active">ARTICLES</a></li>
                <li><a href="/#contact">CONTACT</a></li>
            </ul>
        </nav>
    </header>

    <!-- Page Hero -->
    <section class="page-hero">
        <div class="container">
            <h1 id="page-title">ARTICLES</h1>
            <p id="page-description">News, guides, and stories from the gaming world</p>
        </div>
    </section>

    <!-- Articles Section -->
    <section class="articles-section">
        <div class="container">
            <!-- Category Tabs -->
            <div class="category-tabs">
                <button class="category-tab active" data-category="all">ALL</button>
                <button class="category-tab" data-category="news">NEWS</button>
                <button class="category-tab" data-category="guide">GUIDES</button>
                <button class="category-tab" data-category="blog">BLOG</button>
                <button class="category-tab" data-category="case">CASE STUDIES</button>
            </div>

            <!-- Search Bar -->
            <div class="search-bar">
                <input type="text" id="search-input" placeholder="Search articles...">
                <button id="search-btn" class="search-btn">🔍</button>
            </div>

            <!-- Articles Grid -->
            <div id="articles-grid" class="articles-grid">
                <div class="loading">Loading articles...</div>
            </div>

            <!-- Pagination -->
            <div id="pagination" class="pagination"></div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="site-footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-col">
                    <h3>SOINP</h3>
                    <p>Premium gaming furniture for pro gamers worldwide.</p>
                </div>
                <div class="footer-col">
                    <h4>Products</h4>
                    <ul>
                        <li><a href="/products.html?category=gaming-chairs">Gaming Chairs</a></li>
                        <li><a href="/products.html?category=gaming-desks">Gaming Desks</a></li>
                        <li><a href="/products.html?category=mouse-pads">Mouse Pads</a></li>
                        <li><a href="/products.html?category=accessories">Accessories</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Company</h4>
                    <ul>
                        <li><a href="/articles.html">Articles</a></li>
                        <li><a href="/#contact">Contact</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Legal</h4>
                    <ul>
                        <li><a href="/privacy-policy.html">Privacy Policy</a></li>
                        <li><a href="/terms-of-service.html">Terms of Service</a></li>
                        <li><a href="/cookie-policy.html">Cookie Policy</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 Soinp Gaming. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script src="js/articles.js"></script>
</body>
</html>
```

- [ ] **步骤 2：创建文章页面 JavaScript**

```javascript
document.addEventListener('DOMContentLoaded', function() {
    init();
});

function getParam(name) {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function getCurrentCategory() {
    var category = getParam('category');
    return category || 'all';
}

function getSearchQuery() {
    return getParam('search') || '';
}

function getCurrentPage() {
    return parseInt(getParam('page')) || 1;
}

// Fetch articles from API
async function fetchArticles(category, search, page) {
    var params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (search) params.append('search', search);
    params.append('page', page);
    params.append('limit', 9);

    var response = await fetch('/api/articles?' + params.toString());
    return response.json();
}

// Create article card HTML
function createArticleCard(article) {
    var badgeHtml = '';
    var categoryLabels = {
        'news': 'NEWS',
        'guide': 'GUIDE',
        'blog': 'BLOG',
        'case': 'CASE STUDY'
    };
    
    if (article.isFeatured) {
        badgeHtml = '<span class="article-badge">FEATURED</span>';
    }

    return '<article class="article-card" onclick="navigateToArticle(\'' + article.slug + '\')">' +
        '<div class="article-image">' +
        (article.coverImage ? '<img src="' + article.coverImage + '" alt="' + article.title + '">' : '<span class="article-emoji">📰</span>') +
        badgeHtml +
        '</div>' +
        '<div class="article-content">' +
        '<span class="article-category">' + (categoryLabels[article.category] || article.category) + '</span>' +
        '<h3 class="article-title">' + article.title + '</h3>' +
        '<p class="article-excerpt">' + article.excerpt + '</p>' +
        '<div class="article-meta">' +
        '<span class="article-author">' + article.author + '</span>' +
        '<span class="article-date">' + article.publishedAt + '</span>' +
        '<span class="article-views">👁 ' + article.views + '</span>' +
        '</div>' +
        '</div>' +
        '</article>';
}

// Render articles grid
function renderArticles(articles) {
    var grid = document.getElementById('articles-grid');
    
    if (articles.length === 0) {
        grid.innerHTML = '<div class="no-results">No articles found</div>';
        return;
    }

    grid.innerHTML = articles.map(createArticleCard).join('');
}

// Render pagination
function renderPagination(currentPage, totalPages) {
    var pagination = document.getElementById('pagination');
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    var html = '';
    
    // Previous button
    if (currentPage > 1) {
        html += '<button class="page-btn" onclick="goToPage(' + (currentPage - 1) + ')">←</button>';
    }

    // Page numbers
    for (var i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += '<button class="page-btn ' + (i === currentPage ? 'active' : '') + '" onclick="goToPage(' + i + ')">' + i + '</button>';
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += '<span class="page-ellipsis">...</span>';
        }
    }

    // Next button
    if (currentPage < totalPages) {
        html += '<button class="page-btn" onclick="goToPage(' + (currentPage + 1) + ')">→</button>';
    }

    pagination.innerHTML = html;
}

// Navigate to article
function navigateToArticle(slug) {
    window.location.href = '/article.html?slug=' + slug;
}

// Go to specific page
function goToPage(page) {
    var url = new URL(window.location);
    url.searchParams.set('page', page);
    window.location.href = url.toString();
}

// Update page info
function updatePageInfo(category, search) {
    var titleEl = document.getElementById('page-title');
    var descEl = document.getElementById('page-description');
    
    var titles = {
        'all': 'ARTICLES',
        'news': 'NEWS',
        'guide': 'GUIDES',
        'blog': 'BLOG',
        'case': 'CASE STUDIES'
    };

    var descriptions = {
        'all': 'News, guides, and stories from the gaming world',
        'news': 'Latest news and updates from Soinp Gaming',
        'guide': 'Expert guides and tutorials',
        'blog': 'Insights and stories from the gaming community',
        'case': 'Success stories from our customers'
    };

    titleEl.textContent = search ? 'Search Results' : (titles[category] || 'ARTICLES');
    descEl.textContent = search ? 'Showing results for: ' + search : (descriptions[category] || descriptions.all);
}

// Update category tabs
function updateCategoryTabs(category) {
    document.querySelectorAll('.category-tab').forEach(function(tab) {
        tab.classList.remove('active');
        if (tab.dataset.category === category) {
            tab.classList.add('active');
        }
    });
}

// Update search input
function updateSearchInput(search) {
    var searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = search || '';
    }
}

// Initialize
async function init() {
    var category = getCurrentCategory();
    var search = getSearchQuery();
    var page = getCurrentPage();

    updatePageInfo(category, search);
    updateCategoryTabs(category);
    updateSearchInput(search);

    try {
        var data = await fetchArticles(category, search, page);
        renderArticles(data.articles);
        renderPagination(page, data.totalPages);
    } catch (error) {
        console.error('Error loading articles:', error);
        document.getElementById('articles-grid').innerHTML = '<div class="error">Failed to load articles</div>';
    }

    // Category tab click handlers
    document.querySelectorAll('.category-tab').forEach(function(tab) {
        tab.addEventListener('click', function() {
            var cat = this.dataset.category;
            var url = new URL(window.location);
            url.searchParams.set('category', cat);
            url.searchParams.delete('search');
            url.searchParams.set('page', 1);
            window.location.href = url.toString();
        });
    });

    // Search handlers
    var searchInput = document.getElementById('search-input');
    var searchBtn = document.getElementById('search-btn');

    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', function() {
            var query = searchInput.value.trim();
            var url = new URL(window.location);
            if (query) {
                url.searchParams.set('search', query);
            } else {
                url.searchParams.delete('search');
            }
            url.searchParams.set('page', 1);
            window.location.href = url.toString();
        });

        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });
    }
}
```

- [ ] **步骤 3：创建文章页面样式**

```css
/* Articles Page Styles */
.articles-section {
    padding: 60px 0;
    min-height: 60vh;
}

.category-tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 30px;
    flex-wrap: wrap;
    justify-content: center;
}

.category-tab {
    padding: 12px 24px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: var(--text-secondary);
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
}

.category-tab:hover,
.category-tab.active {
    background: var(--primary-gradient);
    color: #fff;
    border-color: transparent;
}

.search-bar {
    display: flex;
    max-width: 500px;
    margin: 0 auto 40px;
    gap: 10px;
}

.search-bar input {
    flex: 1;
    padding: 12px 20px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: #fff;
    font-size: 16px;
}

.search-bar input:focus {
    outline: none;
    border-color: var(--primary-color);
}

.search-btn {
    padding: 12px 20px;
    background: var(--primary-gradient);
    border: none;
    border-radius: 8px;
    color: #fff;
    cursor: pointer;
    font-size: 18px;
}

.articles-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
    margin-bottom: 40px;
}

@media (max-width: 992px) {
    .articles-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .articles-grid {
        grid-template-columns: 1fr;
    }
}

.article-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
}

.article-card:hover {
    transform: translateY(-5px);
    border-color: var(--primary-color);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.article-image {
    position: relative;
    height: 200px;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2));
    display: flex;
    align-items: center;
    justify-content: center;
}

.article-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.article-emoji {
    font-size: 60px;
}

.article-badge {
    position: absolute;
    top: 15px;
    left: 15px;
    padding: 6px 12px;
    background: var(--accent-gradient);
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
    color: #fff;
}

.article-content {
    padding: 24px;
}

.article-category {
    display: inline-block;
    padding: 4px 12px;
    background: rgba(99, 102, 241, 0.2);
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    color: var(--primary-color);
    margin-bottom: 12px;
}

.article-title {
    font-size: 20px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 12px;
    line-height: 1.4;
}

.article-excerpt {
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 16px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.article-meta {
    display: flex;
    gap: 16px;
    font-size: 13px;
    color: var(--text-tertiary);
}

.article-author {
    font-weight: 600;
}

.pagination {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 40px;
}

.page-btn {
    min-width: 40px;
    height: 40px;
    padding: 0 12px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: #fff;
    cursor: pointer;
    transition: all 0.3s ease;
}

.page-btn:hover,
.page-btn.active {
    background: var(--primary-gradient);
    border-color: transparent;
}

.page-ellipsis {
    color: var(--text-tertiary);
    padding: 0 8px;
    display: flex;
    align-items: center;
}

.no-results,
.error,
.loading {
    grid-column: 1 / -1;
    text-align: center;
    padding: 60px 0;
    color: var(--text-secondary);
    font-size: 18px;
}

.error {
    color: #ef4444;
}
```

- [ ] **步骤 4：Commit**

```bash
git add public/articles.html public/js/articles.js public/css/article.css
git commit -m "feat: add articles listing page with filtering and pagination"
```

---

### 任务 3：创建文章详情页面

**文件：**
- 创建：`public/article.html`

- [ ] **步骤 1：创建文章详情页面 HTML**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Article - Soinp Gaming</title>
    <meta id="meta-description" name="description" content="">
    <meta id="meta-keywords" name="keywords" content="">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/article.css">
    <style>
        .article-detail {
            max-width: 900px;
            margin: 0 auto;
            padding: 60px 20px;
        }
        .article-cover {
            width: 100%;
            height: 400px;
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(168, 85, 247, 0.3));
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 40px;
        }
        .article-cover img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 20px;
        }
        .article-cover-emoji {
            font-size: 120px;
        }
        .article-header {
            margin-bottom: 40px;
        }
        .breadcrumb {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            font-size: 14px;
            color: var(--text-secondary);
        }
        .breadcrumb a {
            color: var(--primary-color);
            text-decoration: none;
        }
        .article-header h1 {
            font-size: 42px;
            font-weight: 800;
            color: #fff;
            margin-bottom: 20px;
            line-height: 1.2;
        }
        .article-info {
            display: flex;
            gap: 20px;
            font-size: 14px;
            color: var(--text-secondary);
        }
        .article-info span {
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .article-body {
            font-size: 18px;
            line-height: 1.8;
            color: var(--text-secondary);
        }
        .article-body p {
            margin-bottom: 24px;
        }
        .article-body h2,
        .article-body h3 {
            color: #fff;
            margin: 40px 0 20px;
        }
        .article-tags {
            display: flex;
            gap: 10px;
            margin: 40px 0;
            flex-wrap: wrap;
        }
        .article-tag {
            padding: 8px 16px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            font-size: 14px;
            color: var(--text-secondary);
        }
        .share-section {
            padding: 40px 0;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .share-section h3 {
            font-size: 18px;
            color: #fff;
            margin-bottom: 20px;
        }
        .share-buttons {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
        }
        .share-btn {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .share-btn:hover {
            transform: translateY(-2px);
        }
        .share-wechat { background: #07c160; color: #fff; }
        .share-weibo { background: #e6162d; color: #fff; }
        .share-linkedin { background: #0077b5; color: #fff; }
        .share-facebook { background: #1877f2; color: #fff; }
        .share-twitter { background: #1da1f2; color: #fff; }
        .share-copy { background: rgba(255, 255, 255, 0.1); color: #fff; }
        .related-articles {
            padding: 60px 0;
        }
        .related-articles h2 {
            font-size: 28px;
            color: #fff;
            margin-bottom: 30px;
        }
        .related-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
        }
        @media (max-width: 768px) {
            .related-grid {
                grid-template-columns: 1fr;
            }
            .article-header h1 {
                font-size: 28px;
            }
        }
    </style>
</head>
<body>
    <!-- Discount Banner -->
    <div id="discountBanner" class="discount-banner">
        <div class="container" style="display:flex; align-items:center; justify-content:center; gap:20px;">
            <span>🔥 MEMORIAL DAY SALE: Up to 50% OFF Gaming Chairs + Desks!</span>
            <a href="/products.html?category=gaming-chairs" class="banner-btn">SHOP NOW</a>
            <button onclick="document.getElementById('discountBanner').style.display='none'" style="background:none; border:none; color:#fff; cursor:pointer; font-size:20px;">×</button>
        </div>
    </div>

    <!-- Header -->
    <header class="site-header">
        <nav class="navbar">
            <a href="/" class="logo">
                <span class="logo-icon">🎮</span>
                <span class="logo-text">SOINP</span>
            </a>
            <ul class="nav-menu">
                <li><a href="/">HOME</a></li>
                <li class="dropdown">
                    <a href="/products.html">PRODUCTS</a>
                    <div class="dropdown-content">
                        <a href="/products.html?category=gaming-chairs">Gaming Chairs</a>
                        <a href="/products.html?category=gaming-desks">Gaming Desks</a>
                        <a href="/products.html?category=mouse-pads">Mouse Pads</a>
                        <a href="/products.html?category=accessories">Accessories</a>
                    </div>
                </li>
                <li><a href="/articles.html" class="active">ARTICLES</a></li>
                <li><a href="/#contact">CONTACT</a></li>
            </ul>
        </nav>
    </header>

    <!-- Article Detail -->
    <main class="article-detail">
        <div id="article-content">
            <div class="loading" style="text-align:center; padding:100px 0;">Loading article...</div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="site-footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-col">
                    <h3>SOINP</h3>
                    <p>Premium gaming furniture for pro gamers worldwide.</p>
                </div>
                <div class="footer-col">
                    <h4>Products</h4>
                    <ul>
                        <li><a href="/products.html?category=gaming-chairs">Gaming Chairs</a></li>
                        <li><a href="/products.html?category=gaming-desks">Gaming Desks</a></li>
                        <li><a href="/products.html?category=mouse-pads">Mouse Pads</a></li>
                        <li><a href="/products.html?category=accessories">Accessories</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Company</h4>
                    <ul>
                        <li><a href="/articles.html">Articles</a></li>
                        <li><a href="/#contact">Contact</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Legal</h4>
                    <ul>
                        <li><a href="/privacy-policy.html">Privacy Policy</a></li>
                        <li><a href="/terms-of-service.html">Terms of Service</a></li>
                        <li><a href="/cookie-policy.html">Cookie Policy</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 Soinp Gaming. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script>
        function getParam(name) {
            var urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(name);
        }

        function getCategoryLabel(category) {
            var labels = {
                'news': 'NEWS',
                'guide': 'GUIDE',
                'blog': 'BLOG',
                'case': 'CASE STUDY'
            };
            return labels[category] || category.toUpperCase();
        }

        async function loadArticle() {
            var slug = getParam('slug');
            if (!slug) {
                document.getElementById('article-content').innerHTML = '<div class="error" style="text-align:center; padding:100px 0;">Article not found</div>';
                return;
            }

            try {
                var response = await fetch('/api/articles/' + slug);
                if (!response.ok) {
                    throw new Error('Article not found');
                }
                var article = await response.json();

                // Update page title and meta
                document.title = article.seo?.metaTitle || article.title + ' - Soinp Gaming';
                var metaDesc = document.getElementById('meta-description');
                if (metaDesc && article.seo?.metaDescription) {
                    metaDesc.setAttribute('content', article.seo.metaDescription);
                }
                var metaKeywords = document.getElementById('meta-keywords');
                if (metaKeywords && article.seo?.keywords) {
                    metaKeywords.setAttribute('content', article.seo.keywords);
                }

                // Render article
                var tagsHtml = article.tags.map(function(tag) {
                    return '<span class="article-tag">#' + tag + '</span>';
                }).join('');

                var coverHtml = article.coverImage 
                    ? '<img src="' + article.coverImage + '" alt="' + article.title + '">'
                    : '<span class="article-cover-emoji">📰</span>';

                document.getElementById('article-content').innerHTML = 
                    '<div class="article-cover">' + coverHtml + '</div>' +
                    '<div class="article-header">' +
                        '<div class="breadcrumb">' +
                            '<a href="/">Home</a> / ' +
                            '<a href="/articles.html">Articles</a> / ' +
                            '<a href="/articles.html?category=' + article.category + '">' + getCategoryLabel(article.category) + '</a>' +
                        '</div>' +
                        '<h1>' + article.title + '</h1>' +
                        '<div class="article-info">' +
                            '<span>👤 ' + article.author + '</span>' +
                            '<span>📅 ' + article.publishedAt + '</span>' +
                            '<span>👁 ' + article.views + ' views</span>' +
                        '</div>' +
                    '</div>' +
                    '<div class="article-tags">' + tagsHtml + '</div>' +
                    '<div class="article-body">' + article.content + '</div>' +
                    '<div class="share-section">' +
                        '<h3>Share this article</h3>' +
                        '<div class="share-buttons">' +
                            '<button class="share-btn share-wechat" onclick="shareWechat()">💬 WeChat</button>' +
                            '<button class="share-btn share-weibo" onclick="shareWeibo()">🔴 Weibo</button>' +
                            '<button class="share-btn share-linkedin" onclick="shareLinkedIn()">💼 LinkedIn</button>' +
                            '<button class="share-btn share-facebook" onclick="shareFacebook()">📘 Facebook</button>' +
                            '<button class="share-btn share-twitter" onclick="shareTwitter()">🐦 Twitter</button>' +
                            '<button class="share-btn share-copy" onclick="copyLink()">🔗 Copy Link</button>' +
                        '</div>' +
                    '</div>' +
                    '<div class="related-articles">' +
                        '<h2>Related Articles</h2>' +
                        '<div id="related-articles" class="related-grid"></div>' +
                    '</div>';

                // Load related articles
                loadRelatedArticles(article.category, article.slug);

            } catch (error) {
                console.error('Error loading article:', error);
                document.getElementById('article-content').innerHTML = '<div class="error" style="text-align:center; padding:100px 0;">Failed to load article</div>';
            }
        }

        async function loadRelatedArticles(category, currentSlug) {
            try {
                var response = await fetch('/api/articles?category=' + category + '&limit=3');
                var data = await response.json();
                var related = data.articles.filter(function(a) { return a.slug !== currentSlug; }).slice(0, 3);

                if (related.length === 0) {
                    document.getElementById('related-articles').innerHTML = '<p style="color:var(--text-secondary);">No related articles found</p>';
                    return;
                }

                document.getElementById('related-articles').innerHTML = related.map(function(article) {
                    return '<article class="article-card" onclick="window.location.href=\'/article.html?slug=' + article.slug + '\'">' +
                        '<div class="article-image">' +
                        (article.coverImage ? '<img src="' + article.coverImage + '" alt="' + article.title + '">' : '<span class="article-emoji">📰</span>') +
                        '</div>' +
                        '<div class="article-content">' +
                        '<h3 class="article-title">' + article.title + '</h3>' +
                        '<div class="article-meta">' +
                        '<span class="article-views">👁 ' + article.views + '</span>' +
                        '</div>' +
                        '</div>' +
                        '</article>';
                }).join('');
            } catch (error) {
                console.error('Error loading related articles:', error);
            }
        }

        function getCurrentUrl() {
            return window.location.href;
        }

        function shareWechat() {
            alert('Share this page on WeChat:\n\n' + getCurrentUrl() + '\n\n(Use WeChat scan to open)');
        }

        function shareWeibo() {
            var url = 'https://service.weibo.com/share/share.php?url=' + encodeURIComponent(getCurrentUrl());
            window.open(url, '_blank');
        }

        function shareLinkedIn() {
            var url = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(getCurrentUrl());
            window.open(url, '_blank');
        }

        function shareFacebook() {
            var url = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(getCurrentUrl());
            window.open(url, '_blank');
        }

        function shareTwitter() {
            var url = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(getCurrentUrl());
            window.open(url, '_blank');
        }

        function copyLink() {
            navigator.clipboard.writeText(getCurrentUrl()).then(function() {
                alert('Link copied to clipboard!');
            }).catch(function() {
                alert('Failed to copy link');
            });
        }

        document.addEventListener('DOMContentLoaded', loadArticle);
    </script>
</body>
</html>
```

- [ ] **步骤 2：Commit**

```bash
git add public/article.html
git commit -m "feat: add article detail page with share functionality"
```

---

### 任务 4：扩展管理后台

**文件：**
- 修改：`public/admin.html`

- [ ] **步骤 1：在管理后台添加文章管理功能**

在 admin.html 中添加文章管理 section（在现有产品管理后面）：

```html
<!-- Articles Section -->
<section id="articles" class="content-section">
    <div class="section-header">
        <h2>Articles Management</h2>
        <button class="btn btn-primary" onclick="showArticleModal()">Add New Article</button>
    </div>
    <div class="filter-bar">
        <select id="article-category-filter" onchange="filterArticles()">
            <option value="all">All Categories</option>
            <option value="news">News</option>
            <option value="guide">Guides</option>
            <option value="blog">Blog</option>
            <option value="case">Case Studies</option>
        </select>
        <input type="text" id="article-search" placeholder="Search articles..." onkeyup="filterArticles()">
    </div>
    <div class="table-container">
        <table class="data-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Author</th>
                    <th>Views</th>
                    <th>Featured</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="articles-table-body">
                <!-- Populated by JavaScript -->
            </tbody>
        </table>
    </div>
</section>
```

- [ ] **步骤 2：添加文章管理的 JavaScript 函数**

在 admin.html 的 `<script>` 标签中添加：

```javascript
// Articles Management
let allArticles = [];

async function loadArticles() {
    try {
        const response = await fetch('/api/articles?limit=100');
        const data = await response.json();
        allArticles = data.articles;
        renderArticlesTable(allArticles);
    } catch (error) {
        console.error('Error loading articles:', error);
    }
}

function renderArticlesTable(articles) {
    const tbody = document.getElementById('articles-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = articles.map(article => `
        <tr>
            <td>${article.id}</td>
            <td>${article.title}</td>
            <td><span class="badge badge-${article.category}">${article.category}</span></td>
            <td>${article.author}</td>
            <td>${article.views}</td>
            <td>${article.isFeatured ? '✓' : '—'}</td>
            <td><span class="badge ${article.isPublished ? 'badge-success' : 'badge-draft'}">${article.isPublished ? 'Published' : 'Draft'}</span></td>
            <td>
                <button class="btn-icon" onclick="editArticle('${article.id}')">✏️</button>
                <button class="btn-icon" onclick="deleteArticle('${article.id}')">🗑️</button>
            </td>
        </tr>
    `).join('');
}

function filterArticles() {
    const category = document.getElementById('article-category-filter').value;
    const search = document.getElementById('article-search').value.toLowerCase();
    
    let filtered = allArticles;
    if (category !== 'all') {
        filtered = filtered.filter(a => a.category === category);
    }
    if (search) {
        filtered = filtered.filter(a => 
            a.title.toLowerCase().includes(search) ||
            a.author.toLowerCase().includes(search)
        );
    }
    renderArticlesTable(filtered);
}

function showArticleModal(article = null) {
    // Implementation for article editor modal
    alert('Article editor: ' + (article ? 'Edit' : 'Create'));
}

function editArticle(id) {
    const article = allArticles.find(a => a.id === id);
    showArticleModal(article);
}

async function deleteArticle(id) {
    if (!confirm('Are you sure you want to delete this article?')) return;
    
    try {
        await fetch('/api/articles/' + id, { method: 'DELETE' });
        loadArticles();
    } catch (error) {
        console.error('Error deleting article:', error);
        alert('Failed to delete article');
    }
}

// Add to navigation
document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === '#articles') {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showSection('articles');
            loadArticles();
        });
    }
});
```

- [ ] **步骤 3：Commit**

```bash
git add public/admin.html
git commit -m "feat: add articles management to admin panel"
```

---

### 任务 5：集成到主页

**文件：**
- 修改：`public/index.html`
- 修改：`public/js/main.js`
- 修改：`public/css/style.css`

- [ ] **步骤 1：在主页导航添加 Articles 链接**

在 index.html 的导航菜单中添加：

```html
<li><a href="/articles.html">ARTICLES</a></li>
```

- [ ] **步骤 2：在主页底部添加最新文章区域**

在 index.html 的 footer 前面添加：

```html
<!-- Latest Articles Section -->
<section class="latest-articles">
    <div class="container">
        <div class="section-header">
            <span class="section-badge">BLOG</span>
            <h2 class="section-title">LATEST ARTICLES</h2>
            <p class="section-description">News, guides, and stories from the gaming world</p>
        </div>
        <div id="latest-articles-grid" class="articles-preview-grid">
            <!-- Populated by JavaScript -->
        </div>
        <div style="text-align:center; margin-top:40px;">
            <a href="/articles.html" class="btn btn-secondary">VIEW ALL ARTICLES</a>
        </div>
    </div>
</section>
```

- [ ] **步骤 3：添加主页文章加载逻辑**

在 main.js 中添加：

```javascript
async function loadLatestArticles() {
    const container = document.getElementById('latest-articles-grid');
    if (!container) return;

    try {
        const response = await fetch('/api/articles?limit=3');
        const data = await response.json();
        
        container.innerHTML = data.articles.map(article => `
            <a href="/article.html?slug=${article.slug}" class="article-preview-card">
                <div class="article-preview-image">
                    ${article.coverImage ? '<img src="' + article.coverImage + '" alt="' + article.title + '">' : '<span>📰</span>'}
                </div>
                <div class="article-preview-content">
                    <span class="article-preview-category">${article.category.toUpperCase()}</span>
                    <h3 class="article-preview-title">${article.title}</h3>
                    <p class="article-preview-excerpt">${article.excerpt}</p>
                    <span class="article-preview-date">${article.publishedAt}</span>
                </div>
            </a>
        `).join('');
    } catch (error) {
        console.error('Error loading latest articles:', error);
    }
}

// Call in init()
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code
    loadLatestArticles();
});
```

- [ ] **步骤 4：添加文章预览样式**

在 style.css 中添加：

```css
/* Latest Articles Section */
.latest-articles {
    padding: 80px 0;
    background: rgba(0, 0, 0, 0.3);
}

.articles-preview-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
}

.article-preview-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    overflow: hidden;
    text-decoration: none;
    transition: all 0.3s ease;
}

.article-preview-card:hover {
    transform: translateY(-5px);
    border-color: var(--primary-color);
}

.article-preview-image {
    height: 180px;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 50px;
}

.article-preview-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.article-preview-content {
    padding: 24px;
}

.article-preview-category {
    display: inline-block;
    padding: 4px 12px;
    background: rgba(99, 102, 241, 0.2);
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    color: var(--primary-color);
    margin-bottom: 12px;
}

.article-preview-title {
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 12px;
    line-height: 1.4;
}

.article-preview-excerpt {
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 16px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.article-preview-date {
    font-size: 13px;
    color: var(--text-tertiary);
}

@media (max-width: 992px) {
    .articles-preview-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .articles-preview-grid {
        grid-template-columns: 1fr;
    }
}
```

- [ ] **步骤 5：Commit**

```bash
git add public/index.html public/js/main.js public/css/style.css
git commit -m "feat: integrate articles section into homepage"
```

---

### 任务 6：推送到仓库

- [ ] **步骤 1：推送到远程仓库**

```bash
git push origin standalone-site
git push hostinger standalone-site
```

---

## 验收标准

1. ✅ 文章列表页面正常显示，支持分类筛选和搜索
2. ✅ 文章详情页面完整展示，包含分享功能
3. ✅ 分类和标签筛选正常工作
4. ✅ 搜索功能可用
5. ✅ 阅读量统计准确
6. ✅ 管理后台可进行文章 CRUD 操作
7. ✅ 首页正确集成最新文章区域
8. ✅ 响应式设计正常
9. ✅ 与产品页面的视觉风格一致
