const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  try {
    const { email } = req.body;
    console.log('Newsletter subscription:', email);
    res.json({ message: 'Successfully subscribed to newsletter!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
