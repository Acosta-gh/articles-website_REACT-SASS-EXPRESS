const { Post, Category , User } = require("../models");
const fs = require('fs');
const path = require('path');

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.findAll(
        {
            include: {
                model: User,
                as: 'authorUser', // Le damos un alias para evitar conflictos
                attributes: ['name'] // Solo obtenemos el nombre del autor
            }
        }
    );

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getPostById = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id,
            {
                include: {
                    model: User,
                    as: 'authorUser', // Le damos un alias para evitar conflictos
                    attributes: ['name','image'] 
                }
            }
        )
        if (!post) {
            return res.status(404).json({ error: "❌ Post no encontrado." });
        }
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const createPost = async (req, res) => {
    try {
        console.log(req.file); // <-- 
        console.log(req.body); // <-- Verifican que los datos del formulario lleguen bien

        const { categoryId } = req.body;
        const image = req.file ? req.file.filename : null; // nombre

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

         if (post.image) {
            const imagePath = path.join(__dirname, '..', 'uploads', post.image);
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Error al eliminar la imagen:', err);
                } else {
                    console.log('Imagen eliminada correctamente');
                }
            });
        }

        await post.destroy()
        res.status(200).json({ message: "✅ Post eliminado correctamente." })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const editPost = async (req, res) => {
    try {
        console.log(req.file);
        console.log(req.body);

        const post = await Post.findByPk(req.params.id);
        if (!post) {
            return res.status(404).json({ error: "❌ Post no encontrado." });
        }

        const { categoryId } = req.body;
        
        if (req.file) {
            if (post.image) { // Solo eliminamos la imagen anterior si existe y si estamos cambiando la imagen
                const oldImagePath = path.join(__dirname, '..', 'uploads', post.image);
                fs.unlink(oldImagePath, (err) => {
                    if (err) {
                        console.error('Error al eliminar la imagen anterior:', err);
                    } else {
                        console.log('Imagen anterior eliminada correctamente');
                    }
                });
            }
        }
        
        const image = req.file ? req.file.filename : post.image;// si hay un archivo, usamos el nuevo, si no, mantenemos el viejo

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

const uploadImageIntoPost = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "❌ No se recibió ninguna imagen." });
        }

        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        const markdown = `![imagen](${imageUrl})`;

        return res.status(200).json({
            message: "✅ Imagen subida correctamente.",
            url: imageUrl,
            markdown
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


module.exports = { getAllPosts, getPostById, createPost, editPost, deletePost , uploadImageIntoPost}
