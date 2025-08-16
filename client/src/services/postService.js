/**
 * postService.js
 *
 * Funciones para acceder a la API de Posts.
 * 
 * Estas funciones se encargan únicamente de la comunicación con el backend.
 * Son independientes de React y pueden ser usadas tanto en hooks como en otros scripts.
 */

const API = import.meta.env.VITE_API_URL;

/**
 * Obtiene todos los posts o uno específico por ID.
 * @param {string|number|null} id - Si se pasa, obtiene un solo post; si no, todos.
 * @returns {Promise<object|array>} - Post o lista de posts.
 */
const fetchPosts = async (id = null) => {
  try {
    const endpoint = id ? `${API}/post/${id}` : `${API}/post`;
    const token = localStorage.getItem("token");
    const res = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // Resuelve problemas con respuestas vacías/no JSON
    const text = await res.text();
    try {
      const data = JSON.parse(text);
      return data;
    } catch (err) {
      console.error("Error parsing JSON:", err);
    }
  } catch (err) {
    console.error("Error fetching posts:", err);
    return id ? null : [];
  }
};

/**
 * Sube una imagen para usar en el contenido del post (markdown).
 * @param {File} file - Archivo de imagen
 * @param {string} folder - Carpeta destino (por defecto 'posts')
 * @returns {Promise<object|null>} - Markdown info o null si falla
 */
const uploadPostImage = async (file, folder = 'posts') => {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);

    const res = await fetch(`${API}/post/imageIntoPost`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Error ${res.status}: ${text}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error uploading post image:", error);
    return null;
  }
};

/**
 * Crea un nuevo post (con o sin imagen/banner).
 * @param {object} postData - Datos del post
 * @param {File|null} bannerFile - imagen opcional
 * @returns {Promise<object|null>} - Post creado o null si falla
 */
const createPost = async (postData, bannerFile = null) => {
  try {
    const token = localStorage.getItem("token");
    let body, headers;
    if (bannerFile) {
      body = new FormData();
      Object.entries(postData).forEach(([key, value]) => body.append(key, value));
      body.append("image", bannerFile); // "image" debe coincidir con multer
      headers = { Authorization: `Bearer ${token}` };
    } else {
      body = JSON.stringify(postData);
      headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
    }
    const res = await fetch(`${API}/post`, {
      method: "POST",
      headers,
      body,
    });
    const text = await res.text();
    try {
      const data = JSON.parse(text);
      return data;
    } catch (err) {
      console.error("Error parsing JSON:", err);
    }
  } catch (err) {
    console.error("Error creating post:", err);
    return null;
  }
};

/**
 * Actualiza un post existente (con o sin imagen/banner).
 * @param {string|number} id - ID del post
 * @param {object} postData - Datos actualizados
 * @param {File|null} bannerFile - Imagen nueva o null
 * @returns {Promise<object|null>} - Post actualizado o null si falla
 */
const updatePost = async (id, postData, bannerFile = null) => {
  try {
    const token = localStorage.getItem("token");
    let body, headers;
    if (bannerFile) {
      body = new FormData();
      Object.entries(postData).forEach(([key, value]) => body.append(key, value));
      body.append("image", bannerFile); // "image" debe coincidir con multer
      headers = { Authorization: `Bearer ${token}` };
    } else {
      body = JSON.stringify(postData);
      headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
    }
    const res = await fetch(`${API}/post/${id}`, {
      method: "PUT",
      headers,
      body,
    });
    const text = await res.text();
    try {
      const data = JSON.parse(text);
      return data;
    } catch (err) {
      console.error("Error parsing JSON:", err);
    }
  } catch (err) {
    console.error("Error updating post:", err);
    return null;
  }
};

/**
 * Elimina un post por su ID.
 * @param {string|number} id - ID del post a eliminar
 * @returns {Promise<boolean>} - true si se eliminó, false si falló
 */
const deletePost = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/post/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      return true;
    } else {
      const text = await res.text();
      console.error("Error deleting post:", text);
      return false;
    }
  } catch (err) {
    console.error("Error deleting post:", err);
    return false;
  }
};

export { fetchPosts, uploadPostImage, createPost, updatePost, deletePost };