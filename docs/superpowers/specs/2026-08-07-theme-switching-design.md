# 网站主题切换功能设计文档

## 目标
让客户能够在后台管理界面切换网站整体配色主题，从当前的深色游戏风切换为浅色素净风，并保留后续扩展更多主题的能力。

## 方案概述
采用 **CSS Variables + 主题配置文件** 方案：
- 颜色值全部使用 CSS 变量定义，集中放在 `:root` 和 `[data-theme="light"]` 中。
- 主题配置持久化到 `persistent/data/theme.json`。
- 提供 `/api/theme` 接口供前端读取和后台保存。
- 前端页面加载时通过 JS 读取当前主题并设置到 `<html>` 的 `data-theme` 属性。
- 后台 Settings 页面增加主题选择下拉框。

## theme.json 配置结构

```json
{
  "theme": "light",
  "availableThemes": ["dark", "light"],
  "lastModified": "2026-08-07T12:00:00.000Z"
}
```

字段说明：
- `theme`: 当前激活的主题标识符，默认 `"dark"`（保持现有风格不变）。
- `availableThemes`: 可选主题列表，便于后台渲染下拉框。
- `lastModified`: 最后修改时间，便于追踪。

## /api/theme 接口定义

### GET /api/theme
返回当前主题配置。

**响应示例：**
```json
{
  "theme": "light",
  "availableThemes": ["dark", "light"]
}
```

### PUT /api/theme
更新当前主题（需要管理员认证）。

**请求体：**
```json
{
  "theme": "light"
}
```

**响应示例（成功）：**
```json
{
  "success": true,
  "theme": "light"
}
```

**响应示例（失败）：**
```json
{
  "success": false,
  "message": "Invalid theme"
}
```

## 前端 CSS 变量切换机制

当前 `style.css` 中的 `:root` 变量保持不变作为默认深色主题。新增浅色主题变量：

```css
:root {
  /* 默认深色主题变量（保持当前） */
  --primary-color: #0d0d0d;
  --secondary-color: #1a1a2e;
  --accent-color: #00ff88;
  --accent-color-hover: #00cc6a;
  --text-primary: #ffffff;
  --text-secondary: #a0a0a0;
  --text-muted: #666666;
  --border-color: rgba(0, 255, 136, 0.2);
  --gradient-start: #0f0f23;
  --gradient-end: #1a1a2e;
}

[data-theme="light"] {
  --primary-color: #ffffff;
  --secondary-color: #f5f5f5;
  --accent-color: #2c3e50;
  --accent-color-hover: #1a252f;
  --text-primary: #1a1a1a;
  --text-secondary: #555555;
  --text-muted: #888888;
  --border-color: #e8e8e8;
  --gradient-start: #ffffff;
  --gradient-end: #f8f9fa;
}
```

页面加载时执行：

```javascript
async function applyTheme() {
  try {
    const res = await fetch('/api/theme');
    const data = await res.json();
    document.documentElement.setAttribute('data-theme', data.theme || 'dark');
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
}
applyTheme();
```

## 后台管理 UI 设计

在 `admin.html` 的 Settings 页面中增加一个主题选择模块：

```html
<div class="form-section">
  <h3>Site Theme</h3>
  <div class="form-row">
    <label>Theme</label>
    <select id="theme-select" onchange="saveTheme()">
      <option value="dark">Dark Gaming</option>
      <option value="light">Light Clean</option>
    </select>
  </div>
</div>
```

`admin.js` 中增加：

```javascript
async function loadThemeSetting() {
  const res = await fetch('/api/theme');
  const data = await res.json();
  document.getElementById('theme-select').value = data.theme || 'dark';
}

async function saveTheme() {
  const theme = document.getElementById('theme-select').value;
  const token = localStorage.getItem('token');
  await fetch('/api/theme', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ theme })
  });
  alert('Theme saved');
}
```

## 影响范围

需要修改的文件：
- `server.js`：注册 `/api/theme` 路由
- `routes/theme.js`：新建主题接口路由
- `public/css/style.css`：添加 `[data-theme="light"]` 变量覆盖
- `public/js/main.js`：页面加载时应用主题
- `public/admin.html`：Settings 页面增加主题选择
- `public/js/admin.js`：加载和保存主题设置
- 删除临时文件 `theme-preview.html`

## 回退策略

- 默认主题保持为 `"dark"`，未配置时自动回退到当前深色风格。
- 接口读取失败时，前端默认使用 `dark`。
- 后台可一键切回 Dark Gaming。

## 后续扩展

- `theme.json` 中可增加 `custom` 主题，支持自定义颜色值。
- `availableThemes` 可扩展为 `["dark", "light", "blue", "warm"]` 等。
