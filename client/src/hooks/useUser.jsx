import { useState, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { fetchUserById, updateUserProfile } from "../services/userService";

export function useUser() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("No token found");
      const decoded = jwtDecode(token);
      const data = await fetchUserById(decoded.id, token);
      if (data && data.user) {
        setUserInfo({
          email: data.user.email,
          name: data.user.name,
          image: data.user.image
        });
      } else {
        setUserInfo(null);
      }
    } catch (err) {
      setError(err);
      setUserInfo(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("No token found");
      const data = await updateUserProfile(formData, token);
      if (data && data.user) {
        setUserInfo({
          email: data.user.email,
          name: data.user.name,
          image: data.user.image
        });
      }
      return data;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { userInfo, setUserInfo, loading, error, fetchUser, updateUser };
}