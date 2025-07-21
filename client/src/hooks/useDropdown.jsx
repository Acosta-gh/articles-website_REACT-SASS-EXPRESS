import { useState, useRef, useEffect } from "react";

export function useDropdown(types = ["category", "order"]) {
  const [showDropdown, setShowDropdown] = useState(
    Object.fromEntries(types.map((t) => [t, false]))
  );
  const [rotation, setRotation] = useState(
    Object.fromEntries(types.map((t) => [t, false]))
  );
  const dropdownRefs = useRef({});

  const toggleDropdown = (type) => {
    const currentlyOpen = showDropdown[type];
    const reset = Object.fromEntries(types.map((t) => [t, false]));
    setShowDropdown({ ...reset, [type]: !currentlyOpen });
    setRotation({ ...reset, [type]: !currentlyOpen });
  };

  const closeAllDropdowns = () => {
    const reset = Object.fromEntries(types.map((t) => [t, false]));
    setShowDropdown(reset);
    setRotation(reset);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutside = Object.values(dropdownRefs.current).every(
        (ref) => ref && !ref.contains(event.target)
      );
      if (isOutside) closeAllDropdowns();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return { dropdownRefs, showDropdown, rotation, toggleDropdown, closeAllDropdowns };
}