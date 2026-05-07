const express = require('express');
const PageContent = require('../models/PageContent');

const router = express.Router();

router.get('/:page', async (req, res) => {
  try {
    const content = await PageContent.findOne({ page: req.params.page });
    res.json(content || { page: req.params.page, content: {} });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:page', async (req, res) => {
  try {
    let content = await PageContent.findOne({ page: req.params.page });
    
    if (content) {
      content.content = req.body.content;
      content.updatedAt = Date.now;
    } else {
      content = new PageContent({ page: req.params.page, content: req.body.content });
    }

    await content.save();
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
