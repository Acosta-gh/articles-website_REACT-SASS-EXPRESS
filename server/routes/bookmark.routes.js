const express = require("express");

const { createBookmark, getBookmarkByPostId , getBookmarksByUser} = require("../controllers/bookmark.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/:idPost", authMiddleware, createBookmark);
router.get("/:idPost", authMiddleware, getBookmarkByPostId);
router.get("/", authMiddleware, getBookmarksByUser);

module.exports = router;
