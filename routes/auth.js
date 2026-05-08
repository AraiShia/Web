const express = require('express');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const validate = require('../middleware/validate');

const router = express.Router();

// 验证规则
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
  role: Joi.string().valid('admin', 'editor').optional(),
});

router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: '邮箱或密码错误' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
  } catch (error) {
    next(error);
  }
});

router.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: '该邮箱已被注册' });
    }

    const user = new User({ email, password, role: role || 'admin' });
    await user.save();

    res.status(201).json({ message: '用户创建成功' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
