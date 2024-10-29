// routes/index.js
const express = require('express');
const router = express.Router();

router.use('/post', require('./post.routes'));
router.use('/category', require('./category.routes'));

module.exports = router;