# 网站主题切换功能实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 实现后台可切换的网站主题，支持深色（当前）和浅色两套配色，并通过 `/api/theme` 接口持久化配置。

**架构：** 使用 CSS 变量集中管理颜色，通过 `data-theme` 属性切换；主题配置保存到 `persistent/data/theme.json`；后端提供 REST 接口；后台 Settings 页面提供下拉选择。

**技术栈：** Node.js + Express + 原生 JS/CSS

---

## 文件结构

| 文件 | 职责 |
|------|------|
| `persistent/data/theme.json` | 存储当前主题配置 |
| `routes/theme.js` | 提供 `GET /api/theme` 和 `PUT /api/theme` |
| `server.js` | 注册 `/api/theme` 路由 |
| `public/css/style.css` | 添加 `[data-theme="light"]` CSS 变量覆盖 |
| `public/js/main.js` | 页面加载时调用 `/api/theme` 并应用主题 |
| `public/admin.html` | Settings 页面增加主题选择下拉框 |
| `public/js/admin.js` | 加载当前主题、保存主题设置 |
| `theme-preview.html` | 临时预览文件，任务完成后删除 |

---

## 任务 1：创建默认主题配置文件

**文件：**
- 创建：`persistent/data/theme.json`

- [ ] **步骤 1：写入默认配置**

```json
{
  "theme": "dark",
  "availableThemes": ["dark", "light"],
  "lastModified": "2026-08-07T12:00:00.000Z"
}
```

- [ ] **步骤 2：Commit**

```bash
git add persistent/data/theme.json
git commit -m "chore(theme): add default theme configuration"
```

---

## 任务 2：创建 `/api/theme` 路由

**文件：**
- 创建：`routes/theme.js`

- [ ] **步骤 1：创建路由文件**

```javascript
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { requireAuth } = require('./auth');

const DATA_DIR = global.DATA_DIR || path.join(__dirname, '../persistent/data');
const THEME_FILE = path.join(DATA_DIR, 'theme.json');

function ensureThemeFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(THEME_FILE)) {
    const defaultTheme = {
      theme: 'dark',
      availableThemes: ['dark', 'light'],
      lastModified: new Date().toISOString()
    };
    fs.writeFileSync(THEME_FILE, JSON.stringify(defaultTheme, null, 2), 'utf-8');
  }
}

function readTheme() {
  ensureThemeFile();
  try {
    const data = fs.readFileSync(THEME_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading theme file:', err.message);
    return { theme: 'dark', availableThemes: ['dark', 'light'] };
  }
}

function writeTheme(themeData) {
  try {
    fs.writeFileSync(THEME_FILE, JSON.stringify(themeData, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing theme file:', err.message);
    return false;
  }
}

// GET /api/theme - 获取当前主题
router.get('/', (req, res) => {
  const themeData = readTheme();
  res.json({
    theme: themeData.theme || 'dark',
    availableThemes: themeData.availableThemes || ['dark', 'light']
  });
});

// PUT /api/theme - 更新主题（需要认证）
router.put('/', requireAuth, (req, res) => {
  const { theme } = req.body;
  const themeData = readTheme();
  const allowedThemes = themeData.availableThemes || ['dark', 'light'];

  if (!theme || !allowedThemes.includes(theme)) {
    return res.status(400).json({ success: false, message: 'Invalid theme' });
  }

  themeData.theme = theme;
  themeData.lastModified = new Date().toISOString();

  if (writeTheme(themeData)) {
    res.json({ success: true, theme: themeData.theme });
  } else {
    res.status(500).json({ success: false, message: 'Failed to save theme' });
  }
});

module.exports = router;
```

- [ ] **步骤 2：Commit**

```bash
git add routes/theme.js
git commit -m "feat(theme): add /api/theme GET and PUT endpoints"
```

---

## 任务 3：在 server.js 中注册路由

**文件：**
- 修改：`server.js`

- [ ] **步骤 1：引入并注册路由**

在 `server.js` 中 bannerRoutes 附近添加：

```javascript
const themeRoutes = require('./routes/theme');
```

在 `app.use('/api/banner', bannerRoutes);` 下方添加：

```javascript
app.use('/api/theme', themeRoutes);
```

- [ ] **步骤 2：启动服务器并测试 GET 接口**

```bash
node server.js
```

另开终端：

```bash
curl http://localhost:3000/api/theme
```

预期输出：

```json
{"theme":"dark","availableThemes":["dark","light"]}
```

- [ ] **步骤 3：Commit**

```bash
git add server.js
git commit -m "feat(theme): register /api/theme route in server.js"
```

---

## 任务 4：添加浅色主题 CSS 变量

**文件：**
- 修改：`public/css/style.css`

- [ ] **步骤 1：在 `:root` 后添加浅色主题覆盖**

在 `:root` 变量定义结束后（第 14 行之后）添加：

```css
[data-theme="light"] {
    --primary-color: #ffffff;
    --secondary-color: #f5f5f5;
    --accent-color: #2c3e50;
    --accent-color-hover: #1a252f;
    --neon-blue: #3498db;
    --neon-purple: #9b59b6;
    --text-primary: #1a1a1a;
    --text-secondary: #555555;
    --text-muted: #888888;
    --border-color: #e8e8e8;
    --gradient-start: #ffffff;
    --gradient-end: #f8f9fa;
}
```

- [ ] **步骤 2：检查所有硬编码颜色是否已改用变量**

搜索 `public/css/style.css` 中未使用变量的硬编码颜色值（如 `#fff`、`#000`、`#00ff88` 等）。如果存在且属于应随主题变化的颜色，改为对应 CSS 变量。

重点关注：
-  body 背景
-  文字颜色
-  按钮背景
-  卡片背景
-  banner 渐变

- [ ] **步骤 3：浏览器验证**

在浏览器中打开 `http://localhost:3000/`，手动在 DevTools 中给 `<html>` 添加 `data-theme="light"`，观察页面是否切换为浅色。

- [ ] **步骤 4：Commit**

```bash
git add public/css/style.css
git commit -m "feat(theme): add light theme CSS variables"
```

---

## 任务 5：前端自动应用主题

**文件：**
- 修改：`public/js/main.js`

- [ ] **步骤 1：在 main.js 顶部添加主题应用函数**

```javascript
// 从服务器获取并应用当前主题
async function applyTheme() {
    try {
        const response = await fetch('/api/theme');
        const data = await response.json();
        document.documentElement.setAttribute('data-theme', data.theme || 'dark');
    } catch (error) {
        console.error('Error applying theme:', error);
        document.documentElement.setAttribute('data-theme', 'dark');
    }
}

applyTheme();
```

- [ ] **步骤 2：验证加载顺序**

确认 `applyTheme()` 在 DOMContentLoaded 之前或之中调用，确保页面渲染前已设置主题，避免闪烁。

如果 `main.js` 已经监听 `DOMContentLoaded`，则将调用放在事件回调中；否则直接放在脚本顶部即可（CSS 变量会立即生效）。

- [ ] **步骤 3：浏览器验证**

刷新首页，确认：
1. Network 面板中有 `/api/theme` 请求
2. `<html>` 标签有 `data-theme="dark"`
3. 将 `theme.json` 中的 `theme` 改为 `"light"` 后刷新，页面变为浅色

- [ ] **步骤 4：Commit**

```bash
git add public/js/main.js
git commit -m "feat(theme): apply theme from /api/theme on page load"
```

---

## 任务 6：后台 Settings 页面增加主题选择

**文件：**
- 修改：`public/admin.html`

- [ ] **步骤 1：在 Settings 表单中添加主题选择模块**

在 Settings 页面的 `General Settings` 模块后（`</div>` 之后，Discount Banner 模块之前）添加：

```html
<div class="form-section">
    <h3 data-i18n="siteTheme">Site Theme</h3>
    <div class="form-row">
        <label data-i18n="theme">Theme</label>
        <select id="theme-select" onchange="saveTheme()">
            <option value="dark" data-i18n="darkTheme">Dark Gaming</option>
            <option value="light" data-i18n="lightTheme">Light Clean</option>
        </select>
    </div>
</div>
```

- [ ] **步骤 2：浏览器检查 UI**

打开 `http://localhost:3000/admin`，进入 Settings，确认出现 "Site Theme" 下拉框。

- [ ] **步骤 3：Commit**

```bash
git add public/admin.html
git commit -m "feat(theme): add theme selector in admin settings"
```

---

## 任务 7：后台主题加载和保存逻辑

**文件：**
- 修改：`public/js/admin.js`

- [ ] **步骤 1：在 showSection 中加载主题设置**

在 `showSection` 函数的 `if (sectionId === 'settings')` 分支中调用 `loadThemeSetting()`（已有该分支，只需确保调用）。

```javascript
if (sectionId === 'settings') {
    loadSettingsBanner();
    loadThemeSetting();
}
```

- [ ] **步骤 2：添加 loadThemeSetting 和 saveTheme 函数**

在 `saveSettingsBanner()` 函数后添加：

```javascript
async function loadThemeSetting() {
    try {
        const response = await fetch('/api/theme');
        const data = await response.json();
        const select = document.getElementById('theme-select');
        if (select) {
            select.value = data.theme || 'dark';
        }
    } catch (error) {
        console.error('Error loading theme setting:', error);
    }
}

async function saveTheme() {
    const select = document.getElementById('theme-select');
    if (!select) return;

    const theme = select.value;
    const token = localStorage.getItem('token');

    try {
        const response = await fetch('/api/theme', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ theme })
        });

        if (response.ok) {
            alert(t('savedSuccessfully') || 'Theme saved successfully');
        } else {
            alert('Failed to save theme');
        }
    } catch (error) {
        console.error('Error saving theme:', error);
        alert('Failed to save theme');
    }
}
```

- [ ] **步骤 3：验证保存和加载**

1. 打开 admin Settings
2. 选择 "Light Clean"
3. 查看是否弹出保存成功提示
4. 检查 `persistent/data/theme.json` 是否变为 `"theme": "light"`
5. 刷新 admin 页面，确认下拉框保持 "Light Clean"
6. 打开前台首页，确认页面变为浅色

- [ ] **步骤 4：Commit**

```bash
git add public/js/admin.js
git commit -m "feat(theme): load and save theme setting in admin"
```

---

## 任务 8：删除临时预览文件

**文件：**
- 删除：`theme-preview.html`

- [ ] **步骤 1：删除文件**

```bash
git rm theme-preview.html
```

- [ ] **步骤 2：Commit**

```bash
git commit -m "chore(theme): remove temporary theme preview file"
```

---

## 任务 9：完整验证和最终推送

- [ ] **步骤 1：运行完整验证**

```bash
node server.js
```

验证清单：
1. `GET /api/theme` 返回 `{"theme":"light","availableThemes":["dark","light"]}`（或当前设置值）
2. admin Settings 可以切换主题并保存
3. 前台首页随主题切换变色
4. 删除 `theme-preview.html` 后无残留

- [ ] **步骤 2：推送到远程**

```bash
git push
```

---

## 自检

- **规格覆盖度：** 所有设计文档中的需求都有对应任务：theme.json、/api/theme、CSS 变量、前端应用、后台 UI、后台逻辑、删除预览文件。
- **占位符扫描：** 无 TODO、无模糊描述，每个步骤包含实际代码和命令。
- **类型一致性：** `theme.json` 字段、`/api/theme` 响应结构、前端 `data-theme` 属性、admin 下拉框 value 均为 `"dark"` / `"light"`。
- **边界情况：** PUT 接口验证 theme 是否在 allowedThemes 中；读取失败默认回退 dark；文件不存在时自动初始化。
