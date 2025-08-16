import { useEffect, useState } from "react";
import {
  fetchPosts,
  createPost,
  updatePost,
  deletePost,
  uploadPostImage
} from "../services/postService";

/**
 * usePosts - Hook personalizado para gestionar posts y exponer las acciones CRUD.
 *
 * @param {string|number|null} id - Si se provee, carga un solo post por ID. Si es null, carga todos.
 * @returns {object} - Estado y funciones CRUD para posts
 */
export function usePosts(id = null) {
  const [posts, setPosts] = useState(id ? null : []);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carga inicial de posts (o post único)
  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      try {
        const data = await fetchPosts(id); 
        setPosts(data);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadPosts();
  }, [id]);

  // Crear un nuevo post y actualizar el estado local
  const create = async (postData, bannerFile = null) => {
    const newPost = await createPost(postData, bannerFile);
    if (newPost && !id) {
      setPosts(prev => [...prev, newPost]);
    }
    return newPost;
  };

  // Actualizar un post y sincronizar el estado local
  const update = async (postId, postData, bannerFile = null) => {
    const updated = await updatePost(postId, postData, bannerFile);
    if (updated && !id) {
      setPosts(prev =>
        prev.map(post => post.id === postId ? updated : post)
      );
    }
    return updated;
  };

  // Eliminar un post y sincronizar el estado local
  const remove = async (postId) => {
    const ok = await deletePost(postId);
    if (ok && !id) {
      setPosts(prev => prev.filter(post => post.id !== postId));
    }
    return ok;
  };

  // Subir una imagen (para markdown)
  const uploadImage = async (file, folder = 'posts') => {
    return await uploadPostImage(file, folder);
  };

  return {
    posts,
    setPosts,
    isLoading,
    setIsLoading,
    error,
    setError,
    create,
    update,
    remove,
    uploadImage,
  };
}