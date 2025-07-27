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
    
    const text = await res.text();
    console.log("Response text:", text);
    try{
      const data = JSON.parse(text);
      console.log("Parsed data:", data);
      return data;
    } catch (err) {
      console.error("Error parsing JSON:", err);
    }
  } catch (err) {
    console.error("Error fetching posts:", err);
    return id ? null : [];
  }
};

export { fetchPosts };
