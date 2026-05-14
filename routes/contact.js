const express = require('express');

const router = express.Router();

router.post('/', (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // 简单验证
    if (!name || name.length < 2 || name.length > 100) {
      return res.status(400).json({ message: 'Invalid name (2-100 characters)' });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }
    if (!subject || subject.length < 2) {
      return res.status(400).json({ message: 'Subject is required' });
    }
    if (!message || message.length < 10) {
      return res.status(400).json({ message: 'Message must be at least 10 characters' });
    }

    console.log('Contact form submitted:', { name, email, subject });
    res.json({ message: 'Message received! We will contact you soon.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to process contact form' });
  }
});

module.exports = router;