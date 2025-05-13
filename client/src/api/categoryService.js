const API = import.meta.env.VITE_API_URL;

const fetchCategories = async (id) => {
    try {
        const endpoint = id ? `${API}/category/${id}` : `${API}/category`;
        const res = await fetch(endpoint);
        const data = await res.json();
        return data;
    } catch (err) {
        console.error("Error fetching categories:", err);
        return [];
    }
};

export { fetchCategories };
