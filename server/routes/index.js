const express = require("express");
const router = express.Router();

const postRoutes = require("./post.routes"); 
const categoryRoutes = require("./category.routes"); 
const userRoutes = require("./user.routes"); 
const bookmarkRoutes = require("./bookmark.routes"); 
const commentRoutes = require("./comment.routes")

router.use("/post", postRoutes);
router.use("/category", categoryRoutes);
router.use("/user", userRoutes);
router.use("/bookmark", bookmarkRoutes);
router.use("/comment", commentRoutes); 

module.exports = router;
