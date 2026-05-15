# 修复上传文件丢失问题 - 实施计划

## 任务概述
修复 Git 自动部署导致上传文件丢失的问题。平台将代码部署到 `/nodejs` 文件夹，而 `/public_html` 与 `/nodejs` 平级且不受 Git 影响。需要将上传目录改为 `../public_html/uploads`。

## 当前状态分析

### 目录结构
```
/home/username/                    # 用户主目录
├── nodejs/                        # ← Git 自动部署到这里（会被重置）
│   ├── server.js
│   ├── routes/
│   └── ...
└── public_html/                   # ← 与 nodejs 平级，不受 Git 影响
    └── uploads/                   # ← 上传文件应该保存到这里
```

### 问题诊断
1. **当前上传路径**: `server.js` 和 `upload.js` 默认使用 `./uploads` 或 `../uploads`
2. **目标上传路径**: 需要从 `nodejs` 返回上一级，进入 `public_html/uploads`
3. **相对路径计算**: `__dirname` 在 `server.js` 中是 `/home/username/nodejs`，所以 `../public_html/uploads` 是正确的

## 实施步骤

### 步骤 1: 修改 server.js 上传目录配置
**文件**: `d:\TraeProjects\SoinpFurnitureWeb\server.js`

**修改内容**:
```javascript
// 从 nodejs 返回上一级，进入 public_html/uploads
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '../public_html/uploads');
```

**原因**: 
- `__dirname` 在 server.js 中是 `/home/username/nodejs`
- `../public_html/uploads` 解析为 `/home/username/public_html/uploads`
- 与 nodejs 平级，不受 Git 部署影响

### 步骤 2: 修改 routes/upload.js 上传目录配置
**文件**: `d:\TraeProjects\SoinpFurnitureWeb\routes\upload.js`

**修改内容**:
```javascript
// 从 nodejs/routes 返回上两级，进入 public_html/uploads
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '../../public_html/uploads');
```

**原因**:
- `__dirname` 在 upload.js 中是 `/home/username/nodejs/routes`
- `../../public_html/uploads` 解析为 `/home/username/public_html/uploads`
- 确保上传路由和静态文件路由使用相同的最终目录

### 步骤 3: 确保目录自动创建
**文件**: `d:\TraeProjects\SoinpFurnitureWeb\server.js` 和 `routes/upload.js`

添加目录检查：
```javascript
// 确保上传目录存在
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
```

### 步骤 4: 更新 .env 配置（可选）
**文件**: `d:\TraeProjects\SoinpFurnitureWeb\.env`

添加注释说明：
```env
# 上传目录配置
# 生产环境（Hostinger）: ../public_html/uploads
# 开发环境: ./uploads
UPLOAD_DIR=./uploads
```

## 路径解析验证

| 文件 | __dirname | 相对路径 | 解析结果 |
|------|-----------|----------|----------|
| server.js | `/home/username/nodejs` | `../public_html/uploads` | `/home/username/public_html/uploads` ✅ |
| upload.js | `/home/username/nodejs/routes` | `../../public_html/uploads` | `/home/username/public_html/uploads` ✅ |

## 验证步骤

1. **本地测试**:
   ```bash
   npm run dev
   # 上传图片，检查是否保存到项目根目录的 public_html/uploads
   ```

2. **生产环境测试**:
   - 部署到平台
   - 上传图片，检查 `/home/username/public_html/uploads`
   - 确认图片可通过 `https://domain.com/uploads/image.jpg` 访问
   - 执行 Git 推送，确认 uploads 目录内容不被重置

## 注意事项

- 首次部署时需要确保 `public_html/uploads` 目录有写入权限
- 如果 `public_html` 目录不存在，需要手动创建或让代码自动创建
- 本地开发和生产环境的路径不同，已通过环境变量支持配置
