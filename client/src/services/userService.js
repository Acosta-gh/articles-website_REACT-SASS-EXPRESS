const API = import.meta.env.VITE_API_URL;

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