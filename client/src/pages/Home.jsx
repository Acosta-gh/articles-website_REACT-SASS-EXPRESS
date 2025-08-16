import React, { useState } from "react";

// Componentes UI principales
import Post from "../components/Post";
import Pagination from "../components/Pagination";
import Arrow from "../components/Arrow";
import { Fade, Slide } from "react-awesome-reveal";
import { useSearchContext } from "../context/SearchContext";
import LoadingScreen from "../components/LoadingScreen";

// Hooks 
import { useDropdown } from "../hooks/useDropdown";
import { useCategories } from "../hooks/useCategories";
import { useFilteredPosts } from "../hooks/useFilteredPosts";
import { usePosts } from "../hooks/usePosts";

const POSTS_PER_PAGE = 10;
const API = import.meta.env.VITE_API_URL;

/**
 * Página principal Home: muestra posts filtrables y paginados.
 * Permite filtrar por categoría/orden y buscar por término.
 */
const Home = () => {
  // Estados de filtros y paginación
  const { searchTerm } = useSearchContext();
  const [currentCategory, setCurrentCategory] = useState("All");
  const [currentOrder, setCurrentOrder] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);

  // Categorías y posts (hooks, datos vienen del backend)
  const {
    categories,
    setCategories,
    isLoading: categoriesLoading,
    error: categoriesError,
    create, update, remove
  } = useCategories();

  const { posts, setPosts, isLoading, setIsLoading, error, setError } = usePosts();

  // Dropdowns para filtros
  const {
    dropdownRefs,
    showDropdown,
    rotation,
    toggleDropdown,
    closeAllDropdowns,
  } = useDropdown(["category", "order"]);

  // Custom hook: filtra y pagina los posts para mostrar
  const [filteredSorted, currentPosts] = useFilteredPosts(
    posts,
    categories,
    searchTerm,
    currentCategory,
    currentOrder,
    currentPage,
    POSTS_PER_PAGE
  );

  // Selección de filtros
  const handleSelect = (type, value) => {
    if (type === "category") setCurrentCategory(value);
    if (type === "order") setCurrentOrder(value);
    closeAllDropdowns();
  };

  // Mensaje de saludo dinámico
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning! 👋";
    if (hour < 17) return "Good Afternoon 🌇";
    return "Good Evening 🌆";
  };

  // Opciones de dropdown para filtros
  const dropdownItems = {
    category: ["All", ...categories.map((c) => c.name)],
    order: ["Newest", "Oldest"],
  };

  // Pantalla de carga mientras llegan los datos
  if (isLoading) return <LoadingScreen />;

  return (
    <div className="home page-container">
      {/* Encabezado animado */}
      <Fade triggerOnce duration={1500}>
        <Slide triggerOnce duration={900}>
          <div className="home__greetings">
            <p>{getGreeting()}</p>
            <h1 className="title">Posts-Worthy Reads</h1>
            <i>Stories to Inspire Your Thoughts</i>
          </div>
        </Slide>
      </Fade>

      {/* Filtros por categoría y orden */}
      <div className="home__filters">
        {["category", "order"].map((type) => (
          <div
            key={type}
            className="dropdown"
            ref={(el) => (dropdownRefs.current[type] = el)}
          >
            <Arrow
              text={type === "category" ? currentCategory : currentOrder}
              onClick={() => toggleDropdown(type)}
              isRotated={rotation[type]}
            />
            <div
              className={`dropdown__menu ${showDropdown[type] ? "dropdown__menu-show" : ""}`}
            >
              {dropdownItems[type]
                .filter(
                  (item) =>
                    item !==
                    (type === "category" ? currentCategory : currentOrder)
                )
                .map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelect(type, item)}
                    className="dropdown__item"
                  >
                    {item}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Listado de posts filtrados y paginados */}
      <div className="home__posts">
        <Fade triggerOnce duration={700}>
          {currentPosts.length > 0 ? (
            currentPosts.map((post) => (
              <Post
                key={post.id}
                id={post.id}
                index={post.id}
                image={post.image ? `${API}/uploads/posts/${post.image}` : null}
                title={post.title}
                content={post.content}
                content_highlight={post.content_highligth}
                author={post.authorUser?.name || "Unknown"}
                date={post.createdAt || new Date().toISOString()}
                categoryId={post.categoryId}
                isBookmarked={post.isBookmarked}
              />
            ))
          ) : (
            <div className="home__no-posts">
              <p className="paragraph">
                No posts found matching your search criteria.
              </p>
            </div>
          )}
        </Fade>
      </div>

      {/* Paginador */}
      <Pagination
        postsPerPage={POSTS_PER_PAGE}
        length={filteredSorted.length}
        handlePagination={setCurrentPage}
        currentPage={currentPage}
      />
    </div>
  );
};

export default Home;