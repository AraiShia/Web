# 文章模块设计方案

## 概述

为 Soinp Gaming 网站添加完整的文章/博客模块，支持行业资讯、使用指南、博客文章和客户案例四种内容类型。

## 技术架构

### 数据存储
- 使用 `data/articles.json` 文件存储文章数据
- 与现有 `products.json` 架构保持一致
- 数据结构支持分类、标签、阅读量统计等功能

### 文件结构
```
/data
  articles.json          # 文章数据存储
  
/routes
  articles.js           # 文章管理 API（后台管理）

/public
  js/articles.js        # 文章页面逻辑
  articles.html         # 文章列表页面
  article.html          # 文章详情页面
  
/admin
  (扩展现有 admin.html)
```

## 数据模型

### 文章数据结构 (articles.json)
```json
{
  "articles": [
    {
      "id": "string",
      "title": "string",
      "slug": "string",
      "category": "news|guide|blog|case",  // 资讯/指南/博客/案例
      "tags": ["string"],
      "author": "string",
      "authorAvatar": "string",
      "coverImage": "string",
      "excerpt": "string",                // 摘要
      "content": "string",                // HTML 内容
      "views": "number",                  // 阅读量
      "isFeatured": "boolean",            // 精选文章
      "isPublished": "boolean",           // 发布状态
      "publishedAt": "string",            // 发布时间
      "updatedAt": "string",              // 更新时间
      "seo": {
        "metaTitle": "string",
        "metaDescription": "string",
        "keywords": "string"
      }
    }
  ]
}
```

## 功能模块

### 1. 前端展示

#### 1.1 文章列表页面 (articles.html)
- 顶部横幅区域（与产品页面风格一致）
- 分类标签切换（全部/资讯/指南/博客/案例）
- 搜索功能
- 文章网格展示
- 分页功能（每页 9 篇文章）
- 精选文章标记
- 阅读量显示
- 响应式布局

#### 1.2 文章详情页面 (article.html)
- 文章封面大图
- 面包屑导航
- 文章元信息（作者、发布时间、阅读量）
- 文章内容（支持富文本 HTML）
- 标签展示
- 分享功能（微信、微博、LinkedIn、Facebook、Twitter）
- 相关文章推荐（同分类）
- 热门文章侧边栏
- 返回列表按钮

#### 1.3 首页集成
- 在首页导航栏添加"Articles"链接
- 首页底部添加最新文章区域（显示 3 篇最新文章）

### 2. 管理后台 (admin.html)

#### 2.1 文章管理界面
- 文章列表（表格形式）
- 筛选功能（按分类、状态）
- 搜索功能
- 添加新文章
- 编辑文章
- 删除文章（软删除）
- 批量操作

#### 2.2 文章编辑器
- 标题输入
- 分类选择
- 标签管理
- 封面图片上传
- 摘要编辑
- 富文本编辑器（支持 HTML）
- SEO 设置
- 发布/保存草稿
- 阅读量重置

### 3. API 接口 (routes/articles.js)

#### GET /api/articles
- 功能：获取文章列表
- 参数：
  - `category`: 分类筛选
  - `tag`: 标签筛选
  - `search`: 搜索关键词
  - `page`: 页码
  - `limit`: 每页数量
  - `featured`: 仅精选
- 返回：文章列表 + 分页信息

#### GET /api/articles/:slug
- 功能：获取单篇文章
- 返回：文章详情 + 增加阅读量

#### GET /api/articles/popular
- 功能：获取热门文章
- 参数：`limit`: 数量
- 返回：热门文章列表

#### POST /api/articles
- 功能：创建文章
- 权限：仅管理员

#### PUT /api/articles/:id
- 功能：更新文章
- 权限：仅管理员

#### DELETE /api/articles/:id
- 功能：删除文章
- 权限：仅管理员

## 用户体验

### 浏览体验
- 流畅的页面切换动画
- 加载状态显示
- 空状态提示
- 错误处理和提示

### 分享功能
- 微信分享（生成二维码）
- 微博分享
- LinkedIn 分享
- Facebook 分享
- Twitter 分享
- 复制链接

### SEO 优化
- 语义化 HTML 结构
- Meta 标签支持
- Open Graph 标签
- Twitter Card 标签
- 结构化数据（JSON-LD）
- 友好的 URL 结构

## 视觉设计

### 风格一致性
- 与现有产品页面保持一致的视觉风格
- 深色主题背景
- 霓虹渐变强调色
- 圆角卡片设计
- 悬停动画效果

### 响应式断点
- 桌面端：3 列网格
- 平板端：2 列网格
- 移动端：1 列网格

## 实现计划

### 阶段一：数据层
1. 创建 `data/articles.json` 示例数据
2. 创建 `routes/articles.js` API 路由
3. 更新 `server.js` 引入文章路由

### 阶段二：前端页面
1. 创建 `public/articles.html` 文章列表页
2. 创建 `public/article.html` 文章详情页
3. 创建 `public/js/articles.js` 文章逻辑
4. 创建 `public/css/article.css` 文章样式

### 阶段三：管理后台
1. 扩展 `admin.html` 添加文章管理功能
2. 添加富文本编辑器

### 阶段四：集成与优化
1. 首页导航添加 Articles 链接
2. 首页底部添加最新文章区域
3. SEO 标签优化
4. 分享功能实现

## 技术要点

### 性能优化
- 图片懒加载
- 分页加载
- 缓存策略

### 安全考虑
- XSS 防护（富文本内容转义）
- 管理员权限验证
- 输入验证

### 浏览器兼容
- 现代浏览器（Chrome、Firefox、Safari、Edge）
- 移动端浏览器

## 成功标准

1. ✅ 文章列表页面正常显示和交互
2. ✅ 文章详情页面完整展示
3. ✅ 分类和标签筛选正常工作
4. ✅ 搜索功能可用
5. ✅ 分享功能正常
6. ✅ 阅读量统计准确
7. ✅ 管理后台完整 CRUD
8. ✅ 首页正确集成
9. ✅ SEO 标签正确输出
10. ✅ 响应式设计正常
