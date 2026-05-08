const express = require('express');
const router = express.Router();
const https = require('https');

// TokenPlan API配置
const TOKENPLAN_API_URL = process.env.TOKENPLAN_API_URL || 'https://api.tokenplan.io';
const TOKENPLAN_API_KEY = process.env.TOKENPLAN_API_KEY || '';

// 缓存机制
let usageCache = {
  data: null,
  timestamp: 0,
  ttl: 60000 // 60秒缓存
};

// 获取认证头
function getAuthHeaders() {
  return {
    'Authorization': `Bearer ${TOKENPLAN_API_KEY}`,
    'Content-Type': 'application/json'
  };
}

// 代理请求到TokenPlan API
function proxyRequest(endpoint, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, TOKENPLAN_API_URL);
    
    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname + url.search,
      method: method,
      headers: getAuthHeaders()
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (e) {
          reject(new Error(`Failed to parse response: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    
    req.end();
  });
}

// 获取当前用量数据
router.get('/usage', async (req, res) => {
  try {
    // 检查缓存
    const now = Date.now();
    if (usageCache.data && (now - usageCache.timestamp) < usageCache.ttl) {
      return res.json({
        success: true,
        cached: true,
        timestamp: usageCache.timestamp,
        data: usageCache.data
      });
    }

    // 获取用量数据
    const usageData = await proxyRequest('/api/usage');
    
    // 更新缓存
    usageCache.data = usageData;
    usageCache.timestamp = now;

    res.json({
      success: true,
      cached: false,
      timestamp: now,
      data: usageData
    });
  } catch (error) {
    console.error('TokenPlan API Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch usage data',
      message: error.message
    });
  }
});

// 获取历史用量数据
router.get('/usage/history', async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const historyData = await proxyRequest(`/api/usage/history?days=${days}`);
    
    res.json({
      success: true,
      data: historyData
    });
  } catch (error) {
    console.error('TokenPlan History API Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch history data',
      message: error.message
    });
  }
});

// 获取模型使用统计
router.get('/usage/models', async (req, res) => {
  try {
    const modelData = await proxyRequest('/api/usage/models');
    
    res.json({
      success: true,
      data: modelData
    });
  } catch (error) {
    console.error('TokenPlan Models API Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch model usage data',
      message: error.message
    });
  }
});

// 获取余额信息
router.get('/balance', async (req, res) => {
  try {
    const balanceData = await proxyRequest('/api/balance');
    
    res.json({
      success: true,
      data: balanceData
    });
  } catch (error) {
    console.error('TokenPlan Balance API Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch balance data',
      message: error.message
    });
  }
});

// 健康检查
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    apiConfigured: !!TOKENPLAN_API_KEY,
    cacheStatus: {
      cached: !!usageCache.data,
      age: usageCache.data ? Date.now() - usageCache.timestamp : null
    }
  });
});

module.exports = router;