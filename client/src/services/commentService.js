const API = import.meta.env.VITE_API_URL;

const fetchComments = async (id) => {
    try {
      const res = await fetch(`${API}/comment/${id}`);
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error("Error fetching comments:", err);
      return []; 
    }
};

const createComment = async ({ content, postId, userId, commentId = null }) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("You must be logged in");
        const payload = {
            content,
            postId,
            userId,
            commentId,
        };
        const res = await fetch(`${API}/comment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || "Failed to create comment");
        }
        return data;
    } catch (err) {
        console.error("Error creating comment:", err);
        throw err;
    }
};

const deleteComment = async (id) => {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/comment/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
        if (!res.ok) {
            throw new Error('Failed to delete comment');
        }
        return await res.json();
    } catch (err) {
        console.error("Error deleting comment:", err);
        return null;
    }
};

export { fetchComments, createComment, deleteComment };