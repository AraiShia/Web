const express = require('express');
const Joi = require('joi');
const validate = require('../middleware/validate');

const router = express.Router();

// 验证规则
const newsletterSchema = Joi.object({
  email: Joi.string().email().required(),
});

router.post('/', validate(newsletterSchema), (req, res, next) => {
  try {
    const { email } = req.body;
    console.log('Newsletter subscription:', email);
    res.json({ message: '订阅成功！' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
