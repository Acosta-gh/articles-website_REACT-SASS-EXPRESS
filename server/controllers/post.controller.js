const { Post, Category , User } = require("../models");

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: {
                model: User,
                as: 'authorUser', // Le damos un alias para evitar conflictos
                attributes: ['name'] // Solo obtenemos el nombre del autor
            }
        });

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

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
        const { categoryId } = req.body;
        const image = req.file ? req.file.filename : null; // nombre del archivo subido

        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(400).json({ error: "❌ La categoría especificada no existe." });
        }

        const post = await Post.create({
            ...req.body,
            image 
        });

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
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
        const post = await Post.findByPk(req.params.id);
        if (!post) {
            return res.status(404).json({ error: "❌ Post no encontrado." });
        }

        const { categoryId } = req.body;
        const image = req.file ? req.file.filename : post.image; // si hay un archivo, usamos el nuevo, si no, mantenemos el viejo

        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(400).json({ error: "❌ La categoría especificada no existe." });
        }

        await post.update({
            ...req.body,
            image // actualizamos la imagen si hay una nueva
        });

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAllPosts, getPostById, createPost, editPost, deletePost }
