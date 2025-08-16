// URL base de la API, configurable por entorno
const API = import.meta.env.VITE_API_URL;

/**
 * Obtiene la información de un usuario específico por su ID.
 * @param {string} id - ID del usuario a buscar.
 * @param {string} token - Token JWT de autenticación.
 * @returns {Promise<Object|null>} - Datos del usuario o null si hay error.
 */
const fetchUserById = async (id, token) => {
  try {
    const res = await fetch(`${API}/user/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) {
      console.error("Error fetching user:", data?.message || res.statusText);
      return null;
    }
    return data;
  } catch (err) {
    console.error("Error fetching user:", err);
    return null;
  }
};

/**
 * Actualiza el perfil del usuario autenticado.
 * @param {FormData} formData - Datos del usuario a actualizar (puede incluir imagen).
 * @param {string} token - Token JWT de autenticación.
 * @returns {Promise<Object|null>} - Datos actualizados o null si hay error.
 */
const updateUserProfile = async (formData, token) => {
  try {
    const res = await fetch(`${API}/user`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) {
      console.error("Error updating user:", data?.message || res.statusText);
      return null;
    }
    return data;
  } catch (err) {
    console.error("Error updating user:", err);
    return null;
  }
};

export { fetchUserById, updateUserProfile };