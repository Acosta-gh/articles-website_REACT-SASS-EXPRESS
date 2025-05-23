const API = import.meta.env.VITE_API_URL;
const fetchPosts = async (id = null) => {
  try {
    const endpoint = id ? `${API}/post/${id}` : `${API}/post`;
    const token = localStorage.getItem("token");
    const res = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching posts:", err);
    return id ? null : [];
  }
};

export { fetchPosts };
