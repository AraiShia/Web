const express = require('express');
const router = express.Router();
const https = require('https');

// MiniMax API配置
const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY || '';

// 缓存机制
let usageCache = {
  data: null,
  timestamp: 0,
  ttl: 60000
};

// 获取认证头
function getAuthHeaders() {
  return {
    'Authorization': `Bearer ${MINIMAX_API_KEY}`,
    'Content-Type': 'application/json'
  };
}

// 代理请求到MiniMax API
function proxyRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.minimaxi.com',
      port: 443,
      path: path,
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
    const now = Date.now();
    if (usageCache.data && (now - usageCache.timestamp) < usageCache.ttl) {
      return res.json({
        success: true,
        cached: true,
        timestamp: usageCache.timestamp,
        data: usageCache.data
      });
    }

    try {
      // 获取剩余Token
      const balanceData = await proxyRequest('/v1/token_plan/remains');
      
      const usageData = {
        balance: balanceData.data?.remain || balanceData.remain || 0,
        totalTokens: balanceData.data?.used || balanceData.used || 0,
        todayTokens: balanceData.data?.today_used || balanceData.today_used || 0,
        totalRequests: balanceData.data?.request_count || balanceData.request_count || 0
      };
      
      usageCache.data = usageData;
      usageCache.timestamp = now;

      res.json({
        success: true,
        cached: false,
        timestamp: now,
        data: usageData
      });
    } catch (apiError) {
      // API失败时返回演示数据
      const demoData = {
        balance: 85.50,
        totalTokens: 1250000,
        todayTokens: 45000,
        totalRequests: 892
      };
      
      res.json({
        success: true,
        cached: false,
        demo: true,
        timestamp: now,
        data: demoData
      });
    }
  } catch (error) {
    console.error('Usage API Error:', error.message);
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
    try {
      const historyData = await proxyRequest('/v1/token_plan/daily_usage');
      res.json({
        success: true,
        data: historyData.data || historyData
      });
    } catch (apiError) {
      // 生成7天演示数据
      const days = [];
      const now = new Date();
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        days.push({
          date: date.toISOString().split('T')[0],
          tokens: Math.floor(Math.random() * 50000) + 20000,
          requests: Math.floor(Math.random() * 100) + 50
        });
      }
      res.json({
        success: true,
        data: { days },
        demo: true
      });
    }
  } catch (error) {
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
    try {
      const modelsData = await proxyRequest('/v1/token_plan/model_usage');
      res.json({
        success: true,
        data: modelsData.data || modelsData
      });
    } catch (apiError) {
      res.json({
        success: true,
        demo: true,
        data: {
          models: [
            { name: 'MiniMax-01', calls: 456, usage: 680000 },
            { name: 'abab6.5s', calls: 234, usage: 320000 },
            { name: 'abab6.5', calls: 156, usage: 180000 },
            { name: 'Speech-01', calls: 46, usage: 70000 }
          ]
        }
      });
    }
  } catch (error) {
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
    try {
      const balanceData = await proxyRequest('/v1/token_plan/remains');
      
      res.json({
        success: true,
        data: {
          balance: balanceData.data?.remain || balanceData.remain || 0,
          total: balanceData.data?.total || balanceData.total || 100,
          remaining: balanceData.data?.remain || balanceData.remain || 0,
          limit: balanceData.data?.total || balanceData.total || 100
        }
      });
    } catch (apiError) {
      res.json({
        success: true,
        data: {
          balance: 85.50,
          total: 100,
          remaining: 85.50,
          limit: 100
        },
        demo: true
      });
    }
  } catch (error) {
    console.error('Balance API Error:', error.message);
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
    apiConfigured: !!MINIMAX_API_KEY,
    cacheStatus: {
      cached: !!usageCache.data,
      age: usageCache.data ? Date.now() - usageCache.timestamp : null
    }
  });
});

module.exports = router;