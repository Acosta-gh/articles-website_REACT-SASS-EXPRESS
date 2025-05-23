const { Post, Category , User } = require("../models");
const fs = require('fs');
const path = require('path');

const getAllPosts = async (req, res) => {
    try {
      const userId = req.user?.id; // si no hay user, será undefined
  
      const posts = await Post.findAll({ // Busco todos los posts
        include: {
          model: User,
          as: 'authorUser',
          attributes: ['name'],
        },
      });
  
      if (!userId) { // Si no hay usuario, devuelvo los posts sin bookmark info
        return res.status(200).json(posts);
      }
  
      const user = await User.findByPk(userId, { // Busco el usuario para ver si tiene posts guardados
        include: {
          model: Post,
          as: 'savedPosts', // alias definido en  modelo
          attributes: ['id'],
        },
      });
  
      if (!user) { // Si no hay usuario, devuelvo los posts sin bookmark info
        return res.status(200).json(posts);
      }
  
      const bookmarkedPostIds = new Set(user.savedPosts.map(post => post.id)); // Mapeo los posts guardados por el usuario a un Set para facilitar la búsqueda
  
      const postsWithBookmarkInfo = posts.map(post => { // Mapeo los posts para agregar la info de bookmark
        const postJSON = post.toJSON();
        postJSON.isBookmarked = bookmarkedPostIds.has(post.id);
        return postJSON;
      });
  
      res.status(200).json(postsWithBookmarkInfo); // Devuelvo los posts con la info de bookmark
  
    } catch (error) {
      res.status(500).json({ error: error.message }); // En caso de error, devuelvo el error
    }
  };
  

const getPostById = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id,
            {
                include: {
                    model: User,
                    as: 'authorUser', 
                    attributes: ['name','image'] 
                }
            }
        )
        if (!post) {
            return res.status(404).json({ error: "❌ Post not found." });
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
            return res.status(400).json({ error: "❌ The specified category does not exist." });
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
            return res.status(404).json({ error: "❌ Post not found." })
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
        res.status(200).json({ message: "✅ Post successfully deleted." })
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
            return res.status(404).json({ error: "❌ Post not found." });
        }

        const { categoryId } = req.body;
        
        if (req.file) {
            if (post.image) { // Solo eliminamos la imagen anterior si existe y si estamos cambiando la imagen
                const oldImagePath = path.join(__dirname, '..', 'uploads', post.image);
                fs.unlink(oldImagePath, (err) => {
                    if (err) {
                        console.error('❌ Error deleting the previous image:', err);
                    } else {
                        console.log('✅ Previous image successfully deleted');
                    }
                });
            }
        }
        
        const image = req.file ? req.file.filename : post.image;// si hay un archivo, usamos el nuevo, si no, mantenemos el viejo

        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(400).json({ error: "❌ The specified category does not exist." });
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
        console.log(req.file); // Aquí debe aparecer el archivo
        console.log(req.body.folder); // Aquí debe decir "posts"
        if (!req.file) {
            return res.status(400).json({ error: "❌ No image was received." });
        }

        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.body.folder}/${req.file.filename}`;
        const markdown = `![imagen](${imageUrl})`;

        return res.status(200).json({
            mensaje: "✅ Imagen subida correctamente.",
            url: imageUrl,
            markdown
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


module.exports = { getAllPosts, getPostById, createPost, editPost, deletePost , uploadImageIntoPost}
