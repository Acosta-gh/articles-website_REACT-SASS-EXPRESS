const API = import.meta.env.VITE_API_URL;

const fetchComments = async (id) => {
    try {
      const res = await fetch(`${API}/comment/${id}`);
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Error fetching comments:", err);
      return []; 
    }
  };
  
export { fetchComments };
