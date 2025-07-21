const express = require("express");

const {
  getAllPosts,
  getPostById,
  createPost,
  editPost,
  deletePost,
  uploadImageIntoPost,
} = require("../controllers/post.controller");

const router = express.Router();

//const authMiddleware = require("../middlewares/auth.middleware")
const adminMiddleware = require("../middlewares/admin.middleware");
const optionalAuth = require("../middlewares/optionalAuth.middleware");

const { uploadPosts } = require("../middlewares/multer.middleware");

// Cambia uploadPosts.single("image") por ...uploadPosts
router.post("/", adminMiddleware, ...uploadPosts, createPost);
router.post(
  "/imageIntoPost",
  adminMiddleware,
  ...uploadPosts,
  uploadImageIntoPost
); //Para agregar imagenes dentro del contenido del blog, no solo del banner
router.get("/", optionalAuth, getAllPosts);
router.get("/:id", getPostById);
router.put("/:id", adminMiddleware, ...uploadPosts, editPost);
router.delete("/:id", adminMiddleware, deletePost);

module.exports = router;