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
