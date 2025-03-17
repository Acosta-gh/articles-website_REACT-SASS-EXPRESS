const express = require("express");

const { getAllPosts, getPostById, createPost, editPost, deletePost} = require("../controllers/post.controller")


const router = express.Router()

//const authMiddleware = require("../middlewares/auth.middleware")
const adminMiddleware = require("../middlewares/admin.middleware")

router.post("/", adminMiddleware, createPost)
router.get("/", getAllPosts)
router.get("/:id", getPostById)
router.put("/:id", adminMiddleware, editPost)
router.delete("/:id",  adminMiddleware, deletePost)

module.exports = router