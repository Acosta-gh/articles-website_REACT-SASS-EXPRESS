import { useEffect, useState } from "react";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from "../services/categoryService";

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      setIsLoading(true);
      try {
        const data = await fetchCategories();
        setCategories(data);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadCategories();
  }, []);

  const create = async (categoryData) => {
    const newCategory = await createCategory(categoryData);
    if (newCategory) setCategories(prev => [...prev, newCategory]);
    return newCategory;
  };

  const update = async (id, data) => {
    const updated = await updateCategory(id, data);
    if (updated) {
      setCategories(prev => prev.map(cat => cat.id === id ? updated : cat));
    }
    return updated;
  };

  const remove = async (id) => {
    const ok = await deleteCategory(id);
    if (ok) setCategories(prev => prev.filter(cat => cat.id !== id));
    return ok;
  };

  return {
    categories,
    setCategories,
    isLoading,
    setIsLoading,
    error,
    setError,
    create,
    update,
    remove
  };
}