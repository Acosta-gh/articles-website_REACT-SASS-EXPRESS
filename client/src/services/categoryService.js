const API = import.meta.env.VITE_API_URL; 

const fetchCategories = async (id) => {
    try {
        const endpoint = id ? `${API}/category/${id}` : `${API}/category`;
        const res = await fetch(endpoint);

        
        const text = await res.text();
        console.log("Response text:", text);

        
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

export { fetchCategories };