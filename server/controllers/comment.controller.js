const { Comment, Post, User } = require("../models");


const createComment = async (req, res) => {
    try {
        const { postId, commentId, content, userId } = req.body;

        if (!postId || !content || !userId) {
            return res.status(400).json({ message: "Campos obligatorios inexistentes" });
        }

        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: "El postId no se encontró." });
        }

        else if (commentId) {
            const comment = await Comment.findByPk(commentId);
            if (!comment) {
                return res.status(404).json({ message: "El commentId no se encontró." });
            }
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "El userId no se encontró" });
        }

        const newComment = await Comment.create({ userId, postId, content, commentId});

        res.status(201).json(newComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating comment.", error });
    }
};

const getCommentsByPost = async (req, res) => {
    try {
        const { postId } = req.params;
        if (!postId) {
            return res.status(400).json({ message: "Post ID is required." });
        }
        const comments = await Comment.findAll({
            where: { postId, commentId: null },
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['id', 'name', 'email', 'image']
                },
                {
                    model: Comment,
                    as: 'childrenComment',
                    include: [
                        {
                            model: User,
                            as: 'author',
                            attributes: ['id', 'name', 'email', 'image']
                        },
                        /*
                        {
                            model: Comment,
                            as: 'childrenComment',
                            include: [
                                {
                                    model: User,
                                    as: 'author',
                                    attributes: ['id', 'name', 'email', 'image']
                                }
                            ]
                        }
                        */
                    ]
                }
            ]
        });
        

        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching comments.", error });
    }
}

const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Comment ID is required." });
        }
        const deleted = await Comment.destroy({ where: { id } });
        if (!deleted) {
            return res.status(404).json({ message: "Comment not found." });
        }
        res.status(200).json({ message: "Comment deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error deleting comment.", error });
    }
}

module.exports = {
    createComment,
    getCommentsByPost,
    deleteComment
};
