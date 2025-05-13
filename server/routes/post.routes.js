const express = require("express");

const { getAllPosts, getPostById, createPost, editPost, deletePost, uploadImageIntoPost} = require("../controllers/post.controller")


const router = express.Router()

//const authMiddleware = require("../middlewares/auth.middleware")
const adminMiddleware = require("../middlewares/admin.middleware")
const upload = require("../middlewares/multer.middleware")

router.post("/", adminMiddleware, upload.single("image") ,createPost)
router.post("/imageIntoPost", adminMiddleware, upload.single("image") , uploadImageIntoPost) //Para agregar imagenes dentro del contenido del blog, no solo del banner
router.get("/", getAllPosts)
router.get("/:id", getPostById)
router.put("/:id", adminMiddleware, upload.single("image")  ,editPost)
router.delete("/:id",  adminMiddleware, deletePost)

module.exports = router