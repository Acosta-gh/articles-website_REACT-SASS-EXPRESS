const API = import.meta.env.VITE_API_URL;

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
 * Marca o desmarca un bookmark para un post específico.
 * Devuelve true si tuvo éxito, false si no.
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