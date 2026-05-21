const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// 询盘数据文件路径
const INQUIRIES_FILE = path.join(__dirname, '../../persistent/data/inquiries.json');

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
    return [];
  }
}

// 保存询盘
function saveInquiries(inquiries) {
  try {
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving inquiry:', err);
    return false;
  }
}

// 生成唯一 ID
function generateId() {
  return 'inq-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8);
}

// 提交询盘（公开，无需认证）
router.post('/', (req, res) => {
  try {
    const { name, email, phone, company, product, message, privacyConsent } = req.body;

    // 验证必填字段
    if (!name || name.length < 2 || name.length > 100) {
      return res.status(400).json({ success: false, message: 'Invalid name (2-100 characters)' });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address' });
    }
    if (!message || message.length < 10) {
      return res.status(400).json({ success: false, message: 'Message must be at least 10 characters' });
    }
    if (!privacyConsent) {
      return res.status(400).json({ success: false, message: 'Privacy consent is required' });
    }

    // 创建询盘对象
    const inquiry = {
      id: generateId(),
      name,
      email,
      phone: phone || '',
      company: company || '',
      product: product || '',
      message,
      isRead: false,
      createdAt: new Date().toISOString(),
      readAt: null
    };

    // 保存到文件
    const inquiries = readInquiries();
    inquiries.push(inquiry);
    
    if (saveInquiries(inquiries)) {
      console.log('New inquiry saved:', inquiry.id, inquiry.email);
      res.json({ success: true, message: 'Your inquiry has been submitted! We will contact you within 24 hours.', inquiryId: inquiry.id });
    } else {
      res.status(500).json({ success: false, message: 'Failed to save your inquiry. Please try again.' });
    }
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ success: false, message: 'Failed to process your inquiry. Please try again.' });
  }
});

module.exports = router;
