require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS 配置
const corsOptions = {
  origin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(s => s.trim())
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Hostinger 配置：数据和上传目录在 persistent 文件夹，避免 Git 更新丢失
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '../persistent/uploads');
const DATA_DIR = path.join(__dirname, '../persistent/data');

// 确保目录存在
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// 如果 persistent 中没有 products.json，从项目默认数据初始化
const PERSISTENT_PRODUCTS = path.join(DATA_DIR, 'products.json');
const DEFAULT_PRODUCTS = path.join(__dirname, 'data/products.json');
if (!fs.existsSync(PERSISTENT_PRODUCTS) && fs.existsSync(DEFAULT_PRODUCTS)) {
  fs.copyFileSync(DEFAULT_PRODUCTS, PERSISTENT_PRODUCTS);
  console.log('Initialized products.json from default data');
}

// 静态文件
app.use('/uploads', express.static(UPLOAD_DIR));
app.use(express.static(path.join(__dirname, 'public')));

// 路由
const authRoutes = require('./routes/auth');
const { requireAuth } = require('./routes/auth');
const productRoutes = require('./routes/products');
const contactRoutes = require('./routes/contact');
const newsletterRoutes = require('./routes/newsletter');
const uploadRoutes = require('./routes/upload');
const articlesRoutes = require('./routes/articles');
const galleryRoutes = require('./routes/gallery');
const categoriesRoutes = require('./routes/categories');
app.use('/api/auth', authRoutes);
app.use('/api/inquiries', requireAuth, require('./routes/inquiries'));
app.use('/api/products', productRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/contact', require('./routes/contact'));
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/upload', requireAuth, uploadRoutes);

// Sitemap.xml - 自动生成
app.get('/sitemap.xml', (req, res) => {
  const products = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'products.json'), 'utf-8'));
  const baseUrl = process.env.SITE_URL || 'https://soinp.com';

  const productUrls = products
    .filter(p => p.isActive !== false)
    .map(p => `
  <url>
    <loc>${baseUrl}/products.html?product=${p.slug}</loc>
    <lastmod>${p.updatedAt || new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/products.html</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>${productUrls}
</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(sitemap);
});

// robots.txt
app.get('/robots.txt', (req, res) => {
  const baseUrl = process.env.SITE_URL || 'https://soinp.com';
  res.type('text/plain').send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /login
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml
`);
});

// 页面路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/privacy-policy', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'privacy-policy.html'));
});

app.get('/cookie-policy', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cookie-policy.html'));
});

app.get('/terms-of-service', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'terms-of-service.html'));
});

// 404 处理
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});