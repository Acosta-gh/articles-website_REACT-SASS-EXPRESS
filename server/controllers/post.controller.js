const { Post, Category } = require("../models");


const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.findAll()
        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getPostById = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id)
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const createPost = async (req, res) => {
    try {
        const { categoryId } = req.body

        const category = await Category.findByPk(categoryId)
        if (!category) {
            return res.status(400).json({ error: "❌ La categoría especificada no existe." })
        }

        const post = await Post.create(req.body)
        res.status(201).json(post)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};

const deletePost = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id)
        if (!post) {
            return res.status(404).json({ error: "❌ Post no encontrado." })
        }

        await post.destroy()
        res.status(200).json({ message: "✅ Post eliminado correctamente." })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const editPost = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id)

        if (!post) {
            return res.status(404).json({ error: "❌ Post no encontrado." })
        }
        
        const { categoryId } = req.body

        const category = await Category.findByPk(categoryId)
        if (!category) {
            return res.status(400).json({ error: "❌ La categoría especificada no existe." })
        }

        const { id: id, ...restBody } = req.body;

        const updatedPost = { ...post.toJSON(), ...restBody };

        await post.update(updatedPost)

        res.status(201).json(post)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
module.exports = { getAllPosts, getPostById, createPost, editPost, deletePost }
