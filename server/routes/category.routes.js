const express = require("express");
const { createCategory, deleteCategory, getCatoryById, getAllCategories, editCategory } = require("../controllers/category.controller")

const router = express.Router()

//const authMiddleware = require("../middlewares/auth.middleware")
const adminMiddleware = require("../middlewares/admin.middleware")

router.post("/", adminMiddleware, createCategory)
router.delete("/:id", adminMiddleware, deleteCategory)
router.get("/", getAllCategories)
router.get("/:id", getCatoryById)
router.put("/:id",editCategory)
module.exports = router