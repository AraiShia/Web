# Soinp Gaming Furniture Website - 部署文档

## 项目概述

这是一个独立的游戏家具电商网站，包含完整的前端展示和后台管理系统。

**技术栈：**
- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **后端**: Node.js, Express.js
- **数据库**: MongoDB
- **认证**: JWT (JSON Web Token)

## 环境要求

| 依赖 | 版本要求 |
|------|----------|
| Node.js | >= 14.0.0 |
| MongoDB | >= 4.0.0 |
| npm | >= 6.0.0 |

## 部署步骤

### 1. 克隆仓库

```bash
git clone https://github.com/AraiShia/Web.git
cd Web
git checkout standalone-site
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

修改 `.env` 文件，根据实际环境配置：

```env
# 服务器端口
PORT=3000

# MongoDB连接地址
# 本地开发: mongodb://localhost:27017/soinp-gaming
# 远程数据库: mongodb+srv://<username>:<password>@cluster.mongodb.net/soinp-gaming
MONGODB_URI=mongodb://localhost:27017/soinp-gaming

# JWT密钥（用于认证加密）
JWT_SECRET=your-secret-key-here-change-in-production

# 默认管理员账号（首次部署时使用）
ADMIN_EMAIL=admin@soinpgaming.com
ADMIN_PASSWORD=admin123
```

### 4. 启动MongoDB

**本地开发环境：**
```bash
# 确保MongoDB服务已启动
# Windows: net start MongoDB
# macOS/Linux: sudo systemctl start mongod
```

**Docker方式：**
```bash
docker run -d -p 27017:27017 --name soinp-mongodb mongo:latest
```

### 5. 启动应用

**开发模式：**
```bash
npm run dev
```

**生产模式：**
```bash
npm start
```

### 6. 初始化管理员账号（首次部署）

首次启动后，需要创建管理员账号。可以通过以下方式：

**方法一：通过API注册**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@soinpgaming.com", "password": "admin123", "role": "admin"}'
```

**方法二：通过MongoDB Shell**

```bash
mongo
use soinp-gaming
db.users.insert({
  email: "admin@soinpgaming.com",
  password: "$2a$10$N9qo8uLOickgx2ZMRZoMye...",  # bcrypt加密后的密码
  role: "admin",
  createdAt: new Date()
})
```

## 访问地址

| 页面 | URL |
|------|-----|
| 主网站 | http://localhost:3000 |
| 后台管理 | http://localhost:3000/admin |
| 管理员登录 | http://localhost:3000/login |

## 默认管理员账号

| 字段 | 值 |
|------|-----|
| 邮箱 | admin@soinpgaming.com |
| 密码 | admin123 |

## 项目结构

```
Web/
├── server.js                 # Express服务器入口
├── package.json              # 项目依赖配置
├── .env                      # 环境变量配置
├── models/                   # 数据模型
│   ├── User.js              # 用户认证模型
│   ├── Product.js           # 产品数据模型
│   └── PageContent.js       # 页面内容模型
├── routes/                   # API路由
│   ├── auth.js              # 登录/注册API
│   ├── products.js          # 产品CRUD API
│   ├── content.js           # 页面内容管理API
│   ├── contact.js           # 联系表单API
│   └── newsletter.js        # 订阅API
└── public/                   # 静态资源
    ├── index.html           # 主网站页面
    ├── admin.html           # 后台管理面板
    ├── login.html           # 管理员登录页面
    ├── css/
    │   ├── style.css        # 网站样式
    │   └── admin.css        # 管理面板样式
    └── js/
        ├── main.js          # 网站交互逻辑
        └── admin.js         # 管理面板交互逻辑
```

## API接口说明

### 认证接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/auth/login` | POST | 用户登录 |
| `/api/auth/register` | POST | 用户注册 |

### 产品接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/products` | GET | 获取产品列表 |
| `/api/products/:slug` | GET | 获取单个产品 |
| `/api/products` | POST | 创建产品 |
| `/api/products/:id` | PUT | 更新产品 |
| `/api/products/:id` | DELETE | 删除产品 |

### 内容接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/content/:page` | GET | 获取页面内容 |
| `/api/content/:page` | PUT | 更新页面内容 |

### 其他接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/contact` | POST | 提交联系表单 |
| `/api/newsletter` | POST | 订阅新闻邮件 |

## 生产环境部署建议

### 1. 使用进程管理器

```bash
# 安装PM2
npm install -g pm2

# 启动应用
pm2 start server.js --name soinp-gaming

# 设置开机自启
pm2 startup
pm2 save
```

### 2. 使用Nginx反向代理

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. 配置HTTPS（推荐）

使用Let's Encrypt配置SSL证书：

```bash
certbot --nginx -d your-domain.com
```

### 4. 环境变量安全

在生产环境中，确保：
- JWT_SECRET 使用强随机字符串
- 数据库密码不硬编码
- 使用环境变量管理敏感信息

## 数据库备份

```bash
# 备份数据库
mongodump --db soinp-gaming --out /backup/

# 恢复数据库
mongorestore --db soinp-gaming /backup/soinp-gaming/
```

## 常见问题

### Q: 启动时连接MongoDB失败？

**A:** 检查以下几点：
1. MongoDB服务是否已启动
2. `.env` 中的 `MONGODB_URI` 是否正确
3. 防火墙是否允许访问27017端口

### Q: 管理员登录失败？

**A:** 确保已创建管理员账号，并且密码正确。可以重新注册：

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@soinpgaming.com", "password": "new-password", "role": "admin"}'
```

### Q: 产品图片无法显示？

**A:** 确保 `uploads` 目录存在且有写入权限：

```bash
mkdir -p uploads
chmod 755 uploads
```

## 技术支持

如有问题，请联系：support@soinpgaming.com

---

**版本**: 1.0.0  
**日期**: 2024  
**作者**: Soinp Gaming Team
