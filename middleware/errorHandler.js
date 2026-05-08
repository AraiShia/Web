const logger = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ${err.stack || err.message}`);

  // Mongoose 验证错误
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ message: '数据验证失败', details: messages });
  }

  // Mongoose 重复键错误
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ message: `${field} 已存在` });
  }

  // JWT 错误
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: '无效的令牌' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: '令牌已过期' });
  }

  // 默认服务器错误
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    message: err.message || '服务器内部错误',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = logger;
