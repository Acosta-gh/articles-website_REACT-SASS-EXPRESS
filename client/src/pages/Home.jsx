import React, { useEffect, useState } from "react";
import Post from "../components/Post";
import Pagination from "../components/Pagination";
import Arrow from "../components/Arrow";
import { Fade, Slide } from "react-awesome-reveal";
import { useSearchContext } from "../context/SearchContext";
import { fetchPosts } from "../services/postService";
import LoadingScreen from "../components/LoadingScreen";

import { useDropdown } from "../hooks/useDropdown";
import { useCategories } from "../hooks/useCategories";
import { useFilteredPosts } from "../hooks/useFilteredPosts";

const POSTS_PER_PAGE = 10;
const API = import.meta.env.VITE_API_URL;

const Home = () => {
  const { searchTerm } = useSearchContext();
  const [posts, setPosts] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("All");
  const [currentOrder, setCurrentOrder] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [categories, setCategories] = useCategories();
  const {
    dropdownRefs,
    showDropdown,
    rotation,
    toggleDropdown,
    closeAllDropdowns,
  } = useDropdown(["category", "order"]);

  // Filtrado y paginado de posts con custom hook
  const [filteredSorted, currentPosts] = useFilteredPosts(
    posts,
    categories,
    searchTerm,
    currentCategory,
    currentOrder,
    currentPage,
    POSTS_PER_PAGE
  );

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchPosts();
        setPosts(data);
      } catch (err) {
        console.error("Error loading posts:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadPosts();
  }, []);

  const handleSelect = (type, value) => {
    if (type === "category") setCurrentCategory(value);
    if (type === "order") setCurrentOrder(value);
    closeAllDropdowns();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning! 👋";
    if (hour < 17) return "Good Afternoon 🌇";
    return "Good Evening 🌆";
  };

  const dropdownItems = {
    category: ["All", ...categories.map((c) => c.name)],
    order: ["Newest", "Oldest"],
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="home page-container">
      <Fade triggerOnce duration={1500}>
        <Slide triggerOnce duration={900}>
          <div className="home__greetings">
            <p>{getGreeting()}</p>
            <h1 className="title">Posts-Worthy Reads</h1>
            <i>Stories to Inspire Your Thoughts</i>
          </div>
        </Slide>
      </Fade>

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
              className={`dropdown__menu ${
                showDropdown[type] ? "dropdown__menu-show" : ""
              }`}
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