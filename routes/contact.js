const express = require('express');
const Joi = require('joi');
const validate = require('../middleware/validate');

const router = express.Router();

// 验证规则
const contactSchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  email: Joi.string().email().required(),
  subject: Joi.string().required().min(2).max(200),
  message: Joi.string().required().min(10).max(5000),
});

router.post('/', validate(contactSchema), (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    console.log('Contact form submitted:', { name, email, subject, message });
    res.json({ message: '消息已收到，我们会尽快与您联系！' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
