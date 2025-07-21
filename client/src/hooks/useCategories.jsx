import { useEffect, useState } from "react";
import { fetchCategories } from "../services/categoryService";

export function useCategories() {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    fetchCategories().then(setCategories).catch(console.error);
  }, []);
  return [categories, setCategories];
}