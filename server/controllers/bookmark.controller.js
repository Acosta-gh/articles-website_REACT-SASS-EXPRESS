const { Bookmark, User, Post } = require("../models");

const createBookmark = async (req, res) => {
    try {
        const { idPost } = req.params;
        const userId = req.user.id; // Obtenido del token JWT gracias al middleware

        const user = await User.findByPk(userId);
        const post = await Post.findByPk(idPost);
        
        if (!user || !post) {
            return res.status(404).json({ message: "❌ User or Post not found" });
        }

        const alreadySaved = await user.hasSavedPost(post);
        if (alreadySaved) {
            await user.removeSavedPost(post);
            return res.status(200).json({ message: "✅ Post deleted from bookmarks" });
        }

        await user.addSavedPost(post);

        return res.status(201).json({ message: "✅ Post bookmarked" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getBookmarksByUser = async (req, res) => {
    try {
        const userId = req.user.id; // obtenido del token JWT

        const user = await User.findByPk(userId, {
            include: {
                model: Post,
                as: "savedPosts",
                include: {
                    model: User,
                    as: 'authorUser',
                    attributes: ['name'],
                },
            },
        });

        if (!user) {
            return res.status(404).json({ message: "❌ User not found" });
        }

        res.status(200).json(user.savedPosts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getBookmarkByPostId = async (req, res) => {
    try {
        const { idPost } = req.params;
        const userId = req.user.id; // obtenido del token JWT
        
        const bookmark = await Bookmark.findOne({
            where:{
                userId: userId,
                postId: idPost
            }
        })

        res.status(200).json({ bookmark });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = { createBookmark, getBookmarkByPostId, getBookmarksByUser }
