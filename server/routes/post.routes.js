// routes/post.routes.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller'); 

router.get('/', postController.getAllPosts); 
router.post('/', postController.submitPost); 
router.get('/:id', postController.getPostById); 

module.exports = router;
