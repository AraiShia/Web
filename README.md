# TokenPlan Monitor

MiniMax TokenPlan 实时用量监控仪表板

## 功能特性

- 📊 实时Token用量监控
- 📈 7天用量趋势图表
- 🥧 模型使用分布饼图
- 💰 账户余额显示
- 🔄 自动刷新（60秒间隔）
- 📱 响应式设计

## 快速开始

### 安装依赖

```bash
npm install
```

### 配置环境变量

复制 `.env.example` 为 `.env` 并配置：

```env
MINIMAX_API_KEY=your_api_key_here
PORT=3000
```

### 启动服务

```bash
# 生产模式
npm start

# 开发模式（热重载）
npm run dev
```

访问 http://localhost:3000

## API 端点

| 端点 | 描述 |
|------|------|
| GET /api/tokenplan/usage | 获取当前用量 |
| GET /api/tokenplan/usage/history | 获取历史用量 |
| GET /api/tokenplan/usage/models | 获取模型使用统计 |
| GET /api/tokenplan/balance | 获取账户余额 |
| GET /api/tokenplan/health | 健康检查 |

## 技术栈

- Node.js + Express
- Chart.js 图表
- 原生 JavaScript
- CSS3

## 许可证

MIT