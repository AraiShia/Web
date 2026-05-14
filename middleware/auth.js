const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  // 本地开发模式：允许 dev-token-local 跳过验证
  if (authHeader && authHeader.startsWith('Bearer dev-token-local')) {
    req.user = { userId: 'local-dev', role: 'admin' };
    return next();
  }
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: '未提供认证令牌' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: '令牌已过期，请重新登录' });
    }
    return res.status(401).json({ message: '无效的认证令牌' });
  }
};

module.exports = auth;
