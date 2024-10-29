// controllers/post.controller.js
const Post = require('../models/post.model');
const Category = require('../models/category.model');

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: [{
                model: Category,
                as: 'category'
            }]
        });
        res.json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: 'Error fetching posts' });
    }
};

const getPostById = async (req, res) => {
    try {
        const postId = req.params.id;
        console.log("Requested post ID:", postId); 

        const post = await Post.findByPk(postId, {
            include: [{
                model: Category,
                as: 'category'
            }]
        });

        if (post) {
            res.json(post);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        console.error("Error fetching post by id:", error);
        res.status(500).json({ message: 'Error fetching post by id' });
    }
};


module.exports = {
    getAllPosts,
    getPostById
};
