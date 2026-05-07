const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    console.log('Contact form submitted:', { name, email, subject, message });
    res.json({ message: 'Message received successfully! We will contact you soon.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
