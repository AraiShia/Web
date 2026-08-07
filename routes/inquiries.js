const express = require('express');
const fs = require('fs');
const path = require('path');
const { requireAuth } = require('./auth');

const router = express.Router();

// 询盘数据文件路径
const INQUIRIES_FILE = path.join(__dirname, '../persistent/data/inquiries.json');

// 确保目录和文件存在
function ensureInquiriesFile() {
  const dir = path.dirname(INQUIRIES_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(INQUIRIES_FILE)) {
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

// 读取所有询盘
function readInquiries() {
  ensureInquiriesFile();
  try {
    const data = fs.readFileSync(INQUIRIES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading inquiries:', err);
    return [];
  }
}

// 保存询盘
function saveInquiries(inquiries) {
  try {
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving inquiries:', err);
    return false;
  }
}

// 生成唯一 ID
function generateId() {
  return 'inq-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8);
}

// 获取所有询盘（需要认证）
router.get('/', requireAuth, (req, res) => {
  const inquiries = readInquiries();
  // 按时间倒序排列
  inquiries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ success: true, inquiries, total: inquiries.length });
});

// 获取单个询盘（需要认证）
router.get('/:id', requireAuth, (req, res) => {
  const inquiries = readInquiries();
  const inquiry = inquiries.find(i => i.id === req.params.id);
  
  if (!inquiry) {
    return res.status(404).json({ success: false, message: 'Inquiry not found' });
  }
  
  res.json({ success: true, inquiry });
});

// 获取未读询盘数量（需要认证）
router.get('/count/unread', requireAuth, (req, res) => {
  const inquiries = readInquiries();
  const unreadCount = inquiries.filter(i => !i.isRead).length;
  res.json({ success: true, unreadCount });
});

// 标记询盘为已读（需要认证）
router.put('/:id/read', requireAuth, (req, res) => {
  const inquiries = readInquiries();
  const index = inquiries.findIndex(i => i.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Inquiry not found' });
  }
  
  inquiries[index].isRead = true;
  inquiries[index].readAt = new Date().toISOString();
  
  if (saveInquiries(inquiries)) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false, message: 'Failed to update' });
  }
});

// 标记所有询盘为已读（需要认证）
router.put('/read-all', requireAuth, (req, res) => {
  const inquiries = readInquiries();
  inquiries.forEach(inquiry => {
    inquiry.isRead = true;
    inquiry.readAt = new Date().toISOString();
  });
  
  if (saveInquiries(inquiries)) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false, message: 'Failed to update' });
  }
});

// 删除询盘（需要认证）
router.delete('/:id', requireAuth, (req, res) => {
  let inquiries = readInquiries();
  const index = inquiries.findIndex(i => i.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Inquiry not found' });
  }
  
  inquiries.splice(index, 1);
  
  if (saveInquiries(inquiries)) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false, message: 'Failed to delete' });
  }
});

// 导出询盘为 CSV（需要认证）
router.get('/export/csv', requireAuth, (req, res) => {
  const inquiries = readInquiries();
  
  // CSV 表头
  const headers = ['ID', 'Name', 'Email', 'Phone', 'Company', 'Product', 'Message', 'Status', 'Created At', 'Read At'];
  
  // CSV 行
  const rows = inquiries.map(inq => [
    inq.id,
    `"${(inq.name || '').replace(/"/g, '""')}"`,
    inq.email || '',
    inq.phone || '',
    `"${(inq.company || '').replace(/"/g, '""')}"`,
    `"${(inq.product || '').replace(/"/g, '""')}"`,
    `"${(inq.message || '').replace(/"/g, '""')}"`,
    inq.isRead ? 'Read' : 'Unread',
    inq.createdAt,
    inq.readAt || ''
  ]);
  
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename=inquiries-${new Date().toISOString().split('T')[0]}.csv`);
  res.send(csv);
});

module.exports = router;
