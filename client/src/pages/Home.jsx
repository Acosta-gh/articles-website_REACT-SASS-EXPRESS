import React, { useEffect, useState, useRef } from 'react';
import Post from "../components/Post";
import Pagination from "../components/Pagination";
import data from '../../../server/api/get/posts/posts.json';
import Arrow from "../components/Arrow";
import { Fade, Slide } from "react-awesome-reveal";
import { useSearchContext } from "../context/SearchContext";
import jsonCategories  from  '../../../server/api/get/categories/categories.json';
import ReactMarkdown from 'react-markdown';

const Home = () => {
  // Context and state management
  const { searchTerm } = useSearchContext();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const [showDropdown, setShowDropdown] = useState({ category: false, order: false });
  const [rotation, setRotation] = useState({ category: false, order: false });
  const [currentCategory, setCurrentCategory] = useState('All');
  const [currentOrder, setCurrentOrder] = useState('Newest');
  const dropdownRefs = useRef({});
  
  // Effect to load posts and handle outside click
  useEffect(() => {
    setPosts(data);

    const handleClickOutside = (event) => {
      const dropdownKeys = Object.keys(dropdownRefs.current);
      const isOutsideClick = dropdownKeys.every(key => {
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

  // Filtering and sorting posts
  const filterAndSortPosts = () => {
    // Create an object that maps category IDs to their names
    const categoryMap = jsonCategories.reduce((acc, category) => {
        acc[category.id] = category.name;
        return acc;
    }, {});

    return posts  
      .filter(post => {
        // Get the name of the category corresponding to the categoryId
        const categoryName = categoryMap[post.categoryId];

        // Filter by category and search term
        return (
          (currentCategory === 'All' || categoryName === currentCategory) &&
          [post.title, post.content, post.author].some(field =>
            field.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      })
      .sort((a, b) => {
        const dateA = new Date(a.publishedDate);
        const dateB = new Date(b.publishedDate);
        console.log('Sorting dates:', dateA, dateB); // Debugging log
        return currentOrder === 'Newest'
          ? dateB - dateA
          : dateA - dateB;
      });
};


  // Current posts for pagination
  const currentPosts = filterAndSortPosts().slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  // Dropdown toggle logic
  const toggleDropdown = (type) => {
    setShowDropdown(prev => {
      const isOpen = prev[type];
      return {
        category: type === 'category' ? !isOpen : false,
        order: type === 'order' ? !isOpen : false
      };
    });

    setRotation(prev => ({
      category: type === 'category' ? !prev.category : prev.category,
      order: type === 'order' ? !prev.order : prev.order
    }));
  };

  // Handle dropdown selection
  const handleSelect = (type, value) => {
    if (type === 'category') {
      setCurrentCategory(value);
    } else {
      setCurrentOrder(value);
    }
    setShowDropdown({ category: false, order: false });
    setRotation({ category: false, order: false });
  };


  const dropdownItems = {
    category: ['All', ...jsonCategories.map(cat => cat.name)],
    //order: ['Newest', 'Oldest', 'Most Popular']
    order: ['Newest', 'Oldest']
  };

  // Greeting message based on the time of day
  const getGreetings = () => {
    const currentHour = new Date().getHours();
    return currentHour < 12 ? "Good Morning!👋" :
      currentHour < 17 ? "Good Afternoon 🌇" : "Good Evening 🌆";
  };

  // Render component
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
                content={data.content}
                author={data.author}
                date={data.publishedDate}
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
