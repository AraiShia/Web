const express = require('express');
const crypto = require('crypto');
const router = express.Router();

// 生成随机 token
function generateToken() {
  return crypto.randomBytes(48).toString('hex');
}

// 内存中的活跃 token 存储（重启后失效，需重新登录）
const activeTokens = new Set();

// 管理员凭证（从环境变量读取）
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@soinp.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// 登录
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = generateToken();
    activeTokens.add(token);

    res.json({
      success: true,
      token: token,
      message: 'Login successful'
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }
});

// 验证 token
router.get('/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ valid: false, message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  if (activeTokens.has(token)) {
    res.json({ valid: true });
  } else {
    res.status(401).json({ valid: false, message: 'Invalid or expired token' });
  }
});

// 登出
router.post('/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    activeTokens.delete(token);
  }
  res.json({ success: true, message: 'Logged out' });
});

// 中间件：验证 token
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  // 本地开发模式跳过
  if (process.env.NODE_ENV === 'development' && authHeader === 'Bearer dev-token-local') {
    req.user = { role: 'admin' };
    return next();
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];

  if (activeTokens.has(token)) {
    req.user = { role: 'admin' };
    next();
  } else {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = router;
module.exports.requireAuth = requireAuth;
