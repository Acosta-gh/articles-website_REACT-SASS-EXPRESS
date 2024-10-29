import React, { useEffect, useState, useRef } from 'react';
import Post from "../components/Post";
import Pagination from "../components/Pagination";
import Arrow from "../components/Arrow";
import { Fade, Slide } from "react-awesome-reveal";
import { useSearchContext } from "../context/SearchContext";
import ReactMarkdown from 'react-markdown';

const Home = () => {
  const { searchTerm } = useSearchContext();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const [showDropdown, setShowDropdown] = useState({ category: false, order: false });
  const [rotation, setRotation] = useState({ category: false, order: false });
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('All');
  const [currentOrder, setCurrentOrder] = useState('Newest');
  const dropdownRefs = useRef({});

  // Fetch posts and categories
  useEffect(() => {
    fetch('http://localhost:3000/api/post')
      .then(response => response.json())
      .then(data => setPosts(data))
      .catch(error => console.error("Error fetching posts:", error));

    fetch('http://localhost:3000/api/category')
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error("Error fetching categories:", error));

    const handleClickOutside = (event) => {
      const isOutsideClick = Object.keys(dropdownRefs.current).every(key => {
        const dropdown = dropdownRefs.current[key];
        return dropdown && !dropdown.contains(event.target);
      });
      if (isOutsideClick) {
        setShowDropdown({ category: false, order: false });
        setRotation({ category: false, order: false });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter and sort posts
  const filterAndSortPosts = () => {
    const categoryMap = categories.reduce((acc, category) => {
      acc[category.id] = category.name;
      return acc;
    }, {});

    return posts
      .filter(post => {
        const categoryName = categoryMap[post.categoryId];
        return (
          (currentCategory === 'All' || categoryName === currentCategory) &&
          [post.title, post.content, post.author].some(field =>
            field.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return currentOrder === 'Newest' ? dateB - dateA : dateA - dateB;
      });
  };

  const currentPosts = filterAndSortPosts().slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const toggleDropdown = (type) => {
    setShowDropdown(prev => ({
      category: type === 'category' ? !prev.category : false,
      order: type === 'order' ? !prev.order : false
    }));
    setRotation(prev => ({
      category: type === 'category' ? !prev.category : prev.category,
      order: type === 'order' ? !prev.order : prev.order
    }));
  };

  const handleSelect = (type, value) => {
    if (type === 'category') setCurrentCategory(value);
    else setCurrentOrder(value);
    setShowDropdown({ category: false, order: false });
    setRotation({ category: false, order: false });
  };

  const dropdownItems = {
    category: ['All', ...categories.map(cat => cat.name)],
    order: ['Newest', 'Oldest']
  };

  const getGreetings = () => {
    const currentHour = new Date().getHours();
    return currentHour < 12 ? "Good Morning!👋" :
      currentHour < 17 ? "Good Afternoon 🌇" : "Good Evening 🌆";
  };

  return (
    <div className='home'>
      <Fade triggerOnce duration={1500}>
        <Slide triggerOnce duration={900}>
          <div className='home-greetings'>
            <p>{getGreetings()}</p>
            <h1>Posts-Worthy Reads</h1>
            <i>Stories to Inspire Your Thoughts</i>
          </div>
        </Slide>
      </Fade>

      <div className='home-category'>
        {['category', 'order'].map(type => (
          <div className='dropdown' key={type} ref={el => dropdownRefs.current[type] = el}>
            <Arrow
              text={type === 'category' ? currentCategory : currentOrder}
              onClick={() => toggleDropdown(type)}
              isRotated={rotation[type]}
            />
            <div className={`dropdown-menu ${showDropdown[type] ? 'show' : ''}`}>
              {dropdownItems[type]
                .filter(item => item !== (type === 'category' ? currentCategory : currentOrder))
                .map((item, index) => (
                  <div key={index} onClick={() => handleSelect(type, item)} className="dropdown-item">
                    {item}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <div className='posts'>
        <Fade triggerOnce duration={700}>
          {currentPosts.length > 0 ? (
            currentPosts.map(data => (
              <Post
                key={data.id}
                index={data.id}
                image={data.image}
                title={data.title}
                content={data.content_thumbnail}
                author={data.author}
                date={data.createdAt || new Date().toISOString()} 
                categoryId={data.categoryId}
                loading={loading}
              />
            ))
          ) : (
            <div className='no-posts'>
              <p>No posts found matching your search criteria.</p>
            </div>
          )}
        </Fade>
      </div>

      <Pagination
        postsPerPage={postsPerPage}
        length={filterAndSortPosts().length}
        handlePagination={setCurrentPage}
        currentPage={currentPage}
      />
    </div>
  );
}

export default Home;
