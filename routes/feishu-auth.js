const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const router = express.Router();

const FEISHU_APP_ID = process.env.FEISHU_APP_ID || 'cli_a96c36e186b85bb3';
const FEISHU_APP_SECRET = process.env.FEISHU_APP_SECRET || '8MTXoPpE34nOT9rakIaDbdasGPquBtze';
const FEISHU_REDIRECT_URI = process.env.FEISHU_REDIRECT_URI || 'http://localhost:3000/api/auth/feishu/callback';
const JWT_SECRET = process.env.JWT_SECRET || 'feishu-auth-secret-key-change-in-production';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// 生成 JWT token
function generateToken(userInfo) {
  return jwt.sign(
    {
      userId: userInfo.user_id || userInfo.open_id,
      openId: userInfo.open_id,
      unionId: userInfo.union_id,
      name: userInfo.name,
      email: userInfo.email,
      avatar: userInfo.avatar_url,
      source: 'feishu'
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Step 1: 跳转到飞书授权页
router.get('/feishu', (req, res) => {
  const state = Math.random().toString(36).substring(7);
  req.session.oauthState = state;

  const authUrl = `https://open.feishu.cn/open-apis/authen/v1/authorize?app_id=${FEISHU_APP_ID}&redirect_uri=${encodeURIComponent(FEISHU_REDIRECT_URI)}&state=${state}`;

  console.log('Redirecting to Feishu auth:', authUrl);
  res.redirect(authUrl);
});

// 飞书事件回调验证（用于配置重定向 URL 时的验证）
router.post('/feishu/callback', (req, res) => {
  const { challenge, token, type } = req.body;

  // 飞书 URL 验证：返回 challenge
  if (type === 'url_verification') {
    if (token === process.env.FEISHU_VERIFICATION_TOKEN) {
      console.log('Feishu URL verification passed');
      return res.json({ challenge });
    }
    return res.status(403).json({ error: 'Invalid verification token' });
  }

  // 其他事件回调
  res.json({ code: 0, msg: 'received' });
});

// Step 2: 飞书 OAuth 回调处理
router.get('/feishu/callback', async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Authorization code not provided' });
    }

    // 交换 access_token
    const tokenResponse = await axios.post('https://open.feishu.cn/open-apis/authen/v1/oidc/access_token', {
      grant_type: 'authorization_code',
      code: code,
      app_id: FEISHU_APP_ID,
      app_secret: FEISHU_APP_SECRET
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    const tokenData = tokenResponse.data;

    if (tokenData.code !== 0 || !tokenData.data?.access_token) {
      console.error('Feishu token error:', tokenData);
      return res.redirect(`${FRONTEND_URL}/login.html?error=auth_failed&msg=${encodeURIComponent(tokenData.msg || 'Failed to get token')}`);
    }

    const { access_token, refresh_token } = tokenData.data;

    // 获取用户信息
    const userResponse = await axios.get('https://open.feishu.cn/open-apis/authen/v1/user_info', {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    const userInfo = userResponse.data.data;

    if (!userInfo) {
      console.error('Feishu user info error:', userResponse.data);
      return res.redirect(`${FRONTEND_URL}/login.html?error=user_info_failed`);
    }

    console.log('Feishu user logged in:', userInfo.name, userInfo.email);

    // 生成 JWT token
    const token = generateToken(userInfo);

    // 重定向到前端，携带 token
    res.redirect(`${FRONTEND_URL}/admin.html?token=${token}&name=${encodeURIComponent(userInfo.name || '')}`);

  } catch (error) {
    console.error('Feishu callback error:', error.response?.data || error.message);
    res.redirect(`${FRONTEND_URL}/login.html?error=callback_error&msg=${encodeURIComponent(error.message)}`);
  }
});

// 验证 token
router.get('/verify', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ valid: false, message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ valid: false, message: 'Invalid or expired token' });
  }
});

// 获取当前用户信息
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({
      userId: decoded.userId,
      openId: decoded.openId,
      name: decoded.name,
      email: decoded.email,
      avatar: decoded.avatar,
      source: decoded.source
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

module.exports = router;