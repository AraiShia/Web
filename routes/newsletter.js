const express = require('express');

const router = express.Router();

router.post('/', (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    console.log('Newsletter subscription:', email);
    res.json({ message: 'Subscribed successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to process subscription' });
  }
});

module.exports = router;