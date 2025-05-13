// Imports y constantes
import React, { useEffect, useState, useRef } from 'react';
import Post from "../components/Post";
import Pagination from "../components/Pagination";
import Arrow from "../components/Arrow";
import { Fade, Slide } from "react-awesome-reveal";
import { useSearchContext } from "../context/SearchContext";
import { fetchPosts } from '../api/postService';
import { fetchCategories } from '../api/categoryService';
import LoadingScreen from "../components/LoadingScreen"

const POSTS_PER_PAGE = 10;

//Componente Home
const Home = () => {
  const { searchTerm } = useSearchContext();

  // Estados
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDropdown, setShowDropdown] = useState({ category: false, order: false });
  const [rotation, setRotation] = useState({ category: false, order: false });
  const [currentCategory, setCurrentCategory] = useState('All');
  const [currentOrder, setCurrentOrder] = useState('Newest');
  const [isLoading, setIsLoading] = useState(true)
  const dropdownRefs = useRef({});

  // Carga inicial
  useEffect(() => {
    loadPosts();
    loadCategories();
    setIsLoading(false)
    const cleanup = setupOutsideClick(dropdownRefs, closeAllDropdowns);
    return cleanup;
  }, []);
  const setupOutsideClick = (refs, callback) => {  
    const handleClickOutside = (event) => {
      const isOutside = Object.values(refs.current).every(
        ref => ref && !ref.contains(event.target)
      );
      if (isOutside) callback();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  };

  // 📞 Fetch Functions
  const loadPosts = async () => {
    try {
      const data = await fetchPosts();
      setPosts(data);
    } catch (err) {
      console.error("Error loading posts:", err);
    }
  };
  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  // 🖐️ Hanlders
  const closeAllDropdowns = () => {
    setShowDropdown({ category: false, order: false });
    setRotation({ category: false, order: false });
  };

  const toggleDropdown = (type) => {
    const newVisibility = !showDropdown[type];
    setShowDropdown({ category: false, order: false, [type]: newVisibility });
    setRotation({ category: false, order: false, [type]: newVisibility });
  };

  const handleSelect = (type, value) => {
    if (type === 'category') setCurrentCategory(value);
    if (type === 'order') setCurrentOrder(value);
    closeAllDropdowns();
  };

  // 👷 Auxiliares
  const getFilteredSortedPosts = () => {
    const categoryMap = categories.reduce((acc, c) => ({ ...acc, [c.id]: c.name }), {});
    const filtered = posts.filter(post => {
      const categoryName = categoryMap[post.categoryId] || '';
      const matchesCategory = currentCategory === 'All' || categoryName === currentCategory;
      const matchesSearch = [post.title, post.content, post.author].some(field =>
        typeof field === 'string' && field.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return matchesCategory && matchesSearch;
    });

    return filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return currentOrder === 'Newest' ? dateB - dateA : dateA - dateB;
    });
  };
  const getCurrentPosts = () => {
    const sorted = getFilteredSortedPosts();
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return sorted.slice(start, start + POSTS_PER_PAGE);
  };
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning! 👋";
    if (hour < 17) return "Good Afternoon 🌇";
    return "Good Evening 🌆";
  };
  const dropdownItems = {
    category: ['All', ...categories.map(c => c.name)],
    order: ['Newest', 'Oldest']
  };


  if (isLoading) return <LoadingScreen></LoadingScreen>
  
  return (
    <div className='home'>
      <Fade triggerOnce duration={1500}>
        <Slide triggerOnce duration={900}>
          <div className='home__greetings'>
            <p>{getGreeting()}</p>
            <h1>Posts-Worthy Reads</h1>
            <i>Stories to Inspire Your Thoughts</i>
          </div>
        </Slide>
      </Fade>

      <div className='home__filters'>
        {['category', 'order'].map(type => (
          <div
            key={type}
            className='dropdown'
            ref={el => dropdownRefs.current[type] = el}
          >
            <Arrow
              text={type === 'category' ? currentCategory : currentOrder}
              onClick={() => toggleDropdown(type)}
              isRotated={rotation[type]}
            />
            <div className={`dropdown__menu ${showDropdown[type] ? 'dropdown__menu-show' : ''}`}>
              {dropdownItems[type]
                .filter(item => item !== (type === 'category' ? currentCategory : currentOrder))
                .map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelect(type, item)}
                    className='dropdown__item'
                  >
                    {item}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <div className='home__posts'>
        <Fade triggerOnce duration={700}>
          {getCurrentPosts().length > 0 ? (
            getCurrentPosts().map(post => (
              <Post
                key={post.id}
                index={post.id}
                image={post.image ? `http://localhost:3000/uploads/${post.image}` : null}
                title={post.title}
                content={post.content}
                content_highlight={post.content_highligth}
                author={post.authorUser?.name || "Unknown"}
                date={post.createdAt || new Date().toISOString()}
                categoryId={post.categoryId}
                loading={loading}
              />
            ))
          ) : (
            <div className='home__no-posts'>
              <p>No posts found matching your search criteria.</p>
            </div>
          )}
        </Fade>
      </div>

      <Pagination
        postsPerPage={POSTS_PER_PAGE}
        length={getFilteredSortedPosts().length}
        handlePagination={setCurrentPage}
        currentPage={currentPage}
      />
    </div>
  );
};

export default Home;
