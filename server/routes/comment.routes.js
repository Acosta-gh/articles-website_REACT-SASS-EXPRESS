const express = require('express');
const { createComment, getCommentsByPost, deleteComment } = require("../controllers/comment.controller");

const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware")

router.post('/', authMiddleware,createComment);
router.get('/:postId/', getCommentsByPost);
router.delete('/:id', authMiddleware,deleteComment);

module.exports = router;
