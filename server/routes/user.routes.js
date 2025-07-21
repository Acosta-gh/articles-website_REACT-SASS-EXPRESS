const express = require("express");

const {
  getUserById,
  createUser,
  deleteUser,
  loginUser,
  updateUser,
} = require("../controllers/user.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");
const { uploadUsers } = require("../middlewares/multer.middleware");

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/:id", authMiddleware, getUserById);
router.delete("/:id", adminMiddleware, deleteUser);
router.put("/", authMiddleware, ...uploadUsers, updateUser);

module.exports = router;