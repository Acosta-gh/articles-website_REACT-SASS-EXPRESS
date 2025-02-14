const express = require("express")

const { createUser, deleteUser, loginUser , updateUser} = require("../controllers/user.controller")

const authMiddleware = require("../middlewares/auth.middleware")
const adminMiddleware = require("../middlewares/admin.middleware")

const router = express.Router()

router.post("/register", createUser)
router.post("/login", loginUser)
router.delete("/:id", adminMiddleware, deleteUser)
//router.put("/", authMiddleware, updateUser)

module.exports = router