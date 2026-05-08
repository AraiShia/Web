const express = require('express');
const Joi = require('joi');
const PageContent = require('../models/PageContent');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// 验证规则
const contentUpdateSchema = Joi.object({
  content: Joi.object().required().min(1),
});

// 公开路由 - 获取页面内容
router.get('/:page', async (req, res, next) => {
  try {
    const allowedPages = ['home', 'about', 'contact', 'products'];
    const page = req.params.page;
    if (!allowedPages.includes(page)) {
      return res.status(400).json({ message: '无效的页面标识' });
    }

    const content = await PageContent.findOne({ page });
    res.json(content || { page, content: {} });
  } catch (error) {
    next(error);
  }
});

// 受保护路由 - 更新页面内容
router.put('/:page', auth, validate(contentUpdateSchema), async (req, res, next) => {
  try {
    const allowedPages = ['home', 'about', 'contact', 'products'];
    const page = req.params.page;
    if (!allowedPages.includes(page)) {
      return res.status(400).json({ message: '无效的页面标识' });
    }

    let content = await PageContent.findOne({ page });

    if (content) {
      content.content = req.body.content;
      content.updatedAt = Date.now();
    } else {
      content = new PageContent({ page, content: req.body.content });
    }

    await content.save();
    res.json(content);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
