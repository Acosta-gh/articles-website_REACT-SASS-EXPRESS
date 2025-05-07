const express = require('express');
const { createComment, getCommentsByPost, deleteComment } = require("../controllers/comment.controller");

const router = express.Router();

router.post('/', createComment);
router.get('/:postId', getCommentsByPost);
router.delete('/:id', deleteComment);

module.exports = router;
