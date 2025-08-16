// URL base de la API, configurable por entorno
const API = import.meta.env.VITE_API_URL;

/**
 * Obtiene todos los comentarios asociados a un post (o entidad) por ID.
 * @param {string} id - ID del post/comentario principal.
 * @returns {Promise<Array>} - Array de comentarios, vacío si error.
 */
const fetchComments = async (id) => {
    try {
      const res = await fetch(`${API}/comment/${id}`);
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error("Error fetching comments:", err);
      return []; 
    }
};

/**
 * Crea un comentario nuevo o una respuesta a un comentario.
 * @param {Object} params - Parámetros del comentario.
 * @param {string} params.content - Texto del comentario.
 * @param {string} params.postId - ID del post asociado.
 * @param {string} params.userId - ID del usuario que comenta.
 * @param {string|null} [params.commentId=null] - (Opcional) ID del comentario padre (si es reply).
 * @returns {Promise<Object>} - Comentario creado.
 * @throws {Error} - Si no hay token o la API falla.
 */
const createComment = async ({ content, postId, userId, commentId = null }) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("You must be logged in");
        const payload = {
            content,
            postId,
            userId,
            commentId,
        };
        const res = await fetch(`${API}/comment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || "Failed to create comment");
        }
        return data;
    } catch (err) {
        console.error("Error creating comment:", err);
        throw err;
    }
};

/**
 * Elimina un comentario por su ID.
 * @param {string} id - ID del comentario a eliminar.
 * @returns {Promise<Object|null>} - Respuesta de la API o null si falla.
 */
const deleteComment = async (id) => {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/comment/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
        if (!res.ok) {
            throw new Error('Failed to delete comment');
        }
        return await res.json();
    } catch (err) {
        console.error("Error deleting comment:", err);
        return null;
    }
};

export { fetchComments, createComment, deleteComment };