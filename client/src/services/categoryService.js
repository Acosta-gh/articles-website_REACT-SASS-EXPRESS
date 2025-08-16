// URL base de la API (configurable por entorno)
const API = import.meta.env.VITE_API_URL;

/**
 * Obtiene todas las categorías o una específica por id.
 * @param {string|null} id - (Opcional) ID de la categoría a buscar.
 * @returns {Promise<Array|Object>} - Lista de categorías o categoría específica. Devuelve [] en caso de error.
 */
const fetchCategories = async (id = null) => {
    try {
        const endpoint = id ? `${API}/category/${id}` : `${API}/category`;
        const res = await fetch(endpoint);
        const text = await res.text();
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${text}`);
        }
        try {
            return JSON.parse(text);
        } catch (e) {
            console.error("Respuesta no es JSON válido:", text);
            throw e;
        }
    } catch (err) {
        console.error("Error fetching categories:", err);
        return [];
    }
};

/**
 * Crea una nueva categoría.
 * @param {Object} categoryData - Datos de la categoría ({ name: string }).
 * @param {string} token - Token de autenticación JWT.
 * @returns {Promise<Object|null>} - Categoría creada o null si falla.
 */
const createCategory = async (categoryData,token) => {
    try {
        const res = await fetch(`${API}/category`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(categoryData),
        });

        const text = await res.text();
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${text}`);
        }
        try {
            return JSON.parse(text);
        } catch (e) {
            console.error("Respuesta no es JSON válido:", text);
            throw e;
        }
    } catch (err) {
        console.error("Error creating category:", err);
        return null;
    }
};

/**
 * Actualiza una categoría existente.
 * @param {string} id - ID de la categoría a actualizar.
 * @param {Object} categoryData - Nuevos datos de la categoría.
 * @returns {Promise<Object|null>} - Categoría actualizada o null si falla.
 */
const updateCategory = async (id, categoryData) => {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/category/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(categoryData),
        });

        const text = await res.text();
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${text}`);
        }
        try {
            return JSON.parse(text);
        } catch (e) {
            console.error("Respuesta no es JSON válido:", text);
            throw e;
        }
    } catch (err) {
        console.error("Error updating category:", err);
        return null;
    }
};

/**
 * Elimina una categoría por su ID.
 * @param {string} id - ID de la categoría a eliminar.
 * @returns {Promise<boolean>} - true si fue eliminada, false si hubo error.
 */
const deleteCategory = async (id) => {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/category/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (res.ok) {
            return true;
        } else {
            const text = await res.text();
            console.error("Error deleting category:", text);
            return false;
        }
    } catch (err) {
        console.error("Error deleting category:", err);
        return false;
    }
};

export { fetchCategories, createCategory, updateCategory, deleteCategory };