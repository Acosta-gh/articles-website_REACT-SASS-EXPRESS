// URL base de la API, configurable por variable de entorno
const API = import.meta.env.VITE_API_URL;

/**
 * Obtiene los bookmarks del usuario autenticado o de un bookmark específico (si se pasa un id).
 * Si se provee un id, busca un bookmark de un post concreto.
 * @param {string} token - Token JWT para autenticación.
 * @param {string} [id] - (Opcional) ID del bookmark/post específico.
 * @returns {Promise<Object|false>} - Datos de bookmarks o false si hay error.
 */
const fetchBookmarks = async (token, id) => {
    try {
        const res = await fetch(id ? `${API}/bookmark/${id}` : `${API}/bookmark`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!res.ok) return false;
        const data = await res.json();
        return data;
    } catch (err) {
        console.error("Error checking if post is bookmarked:", err);
        return false;
    }
};

/**
 * Marca o desmarca un bookmark para un post concreto.
 * Realiza una petición POST al endpoint de bookmark.
 * @param {string} postId - ID del post a marcar/desmarcar como bookmark.
 * @returns {Promise<boolean>} - true si tuvo éxito, false si hubo error.
 */
const toggleBookmark = async (postId) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("You must be logged in.");

        const response = await fetch(`${API}/bookmark/${postId}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error("Error al guardar/eliminar el bookmark");
        }
        await response.json();
        return true;
    } catch (error) {
        console.error("Error al guardar/eliminar bookmark:", error);
        return false;
    }
};

export { fetchBookmarks, toggleBookmark };