const express = require("express");
const router = express.Router();

const postRoutes = require("./post.routes"); 
const categoryRoutes = require("./category.routes"); 
const userRoutes = require("./user.routes"); 

router.use("/post", postRoutes);
router.use("/category", categoryRoutes);
router.use("/user", userRoutes);

module.exports = router;
