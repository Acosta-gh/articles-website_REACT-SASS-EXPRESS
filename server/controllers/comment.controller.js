const { Comment, Post, User } = require("../models");


const createComment = async (req, res) => {
    try {
        const { postId, commentId, content, userId } = req.body;

        if (!postId || !content || !userId) {
            return res.status(400).json({ message: "Required fields are missing" });
        }

        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: "The postId was not found." });
        }

        else if (commentId) {
            const comment = await Comment.findByPk(commentId);
            if (!comment) {
                return res.status(404).json({ message: "The commentId was not found." });
            }
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "The userId was not found." });
        }

        const newComment = await Comment.create({ userId, postId, content, commentId });

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

        // Busca el comentario (solo no borrados por paranoid)
        const comment = await Comment.findByPk(id);

        if (!comment) {
            return res.status(404).json({ message: "Comment not found." });
        }

        // Verifica autoría
        if (comment.userId !== req.user.id) {
            return res.status(403).json({ message: "You are not allowed to delete this comment." });
        }

        // Borrado lógico (paranoid)
        await comment.destroy();
        res.status(200).json({ message: "Comment deleted (logical/paranoid)." });

    } catch (error) {
        res.status(500).json({ message: "Error deleting comment.", error });
    }
}

module.exports = {
    createComment,
    getCommentsByPost,
    deleteComment
};
