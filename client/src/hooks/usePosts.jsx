import { fetchPosts } from "../services/postService";
import { useEffect, useState } from "react";

export function usePosts(id = null) {
  const [posts, setPosts] = useState(id ? null : []);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchPosts(id); 
        setPosts(data);
        console.log("Posts loaded:", data);
      } catch (err) {
        console.error("Error loading posts:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadPosts();
  }, [id]);

  return { posts, setPosts, isLoading, setIsLoading, error, setError };
}