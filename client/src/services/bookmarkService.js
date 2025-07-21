const API = import.meta.env.VITE_API_URL;

const fetchBookmarks = async (token,id) => {
    try {
        const res = await fetch(id ? `${API}/bookmark/${id}` : `${API}/bookmark`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(res.status);
        if (!res.ok) return false;
        const data = await res.json();
        return data
    } catch (err) {
        console.error("Error checking if post is bookmarked:", err);
        return false;
    }
};

export { fetchBookmarks };
