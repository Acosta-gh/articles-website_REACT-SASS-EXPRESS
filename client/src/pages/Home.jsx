import React, { useEffect, useState, useRef } from 'react';
import Post from "../components/Post";
import Pagination from "../components/Pagination";
import data from '../../../server/api/get/posts/posts.json';
import Arrow from "../components/Arrow";
import { Fade } from "react-awesome-reveal"; // https://www.npmjs.com/package/react-awesome-reveal
import { Slide } from "react-awesome-reveal";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [showAllDropdown, setShowAllDropdown] = useState(false);
  const [showOrderDropdown, setShowOrderDropdown] = useState(false);
  const [isRotatedAll, setIsRotatedAll] = useState(false);
  const [isRotatedOrder, setIsRotatedOrder] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('All');
  const [currentOrder, setCurrentOrder] = useState('Newest');

  const dropdownRef = useRef(null); // Crear referencia para el dropdown

  useEffect(() => {
    setPosts(data); // Simulamos la carga de posts desde un archivo JSON

    const handleClickOutside = (event) => { // https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target)
      ) {
        setShowAllDropdown(false);
        setShowOrderDropdown(false);
      }
    };

    // Añadir el event listener al documento
    document.addEventListener('mousedown', handleClickOutside);

    // Limpiar el event listener al desmontar el componente
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const filteredPosts = posts.filter(post =>
    currentCategory === 'All' || post.category === currentCategory
  );

  const sortedPosts = filteredPosts.sort((a, b) => {
    const dateA = new Date(a.publishedDate);
    const dateB = new Date(b.publishedDate);
    return currentOrder === 'Newest' ? dateB - dateA : dateA - dateB;
  });

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);

  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const toggleAllDropdown = () => {
    setShowAllDropdown(!showAllDropdown);
    setShowOrderDropdown(false); // Cerrar el otro dropdown si está abierto
    setIsRotatedAll(prev => !prev);
    if (showAllDropdown) setIsRotatedAll(false);
  };

  const toggleOrderDropdown = () => {
    setShowOrderDropdown(!showOrderDropdown);
    setShowAllDropdown(false); // Cerrar el otro dropdown si está abierto
    setIsRotatedOrder(prev => !prev);
    if (showOrderDropdown) setIsRotatedOrder(false);
  };

  const handleCategorySelect = (category) => {
    setCurrentCategory(category);
    setShowAllDropdown(false);
    setIsRotatedAll(false); // Restablecer la rotación al seleccionar
  };

  const handleOrderSelect = (orderOption) => {
    setCurrentOrder(orderOption);
    setShowOrderDropdown(false);
    setIsRotatedOrder(false); // Restablecer la rotación al seleccionar
  };

  const allDropdownItems = ['All', 'Category 1', 'Category 2', 'Category 3'];
  const orderDropdownItems = ['Newest', 'Oldest', 'Most Popular'];

  const filteredAllDropdownItems = allDropdownItems.filter(item => item !== currentCategory);
  const filteredOrderDropdownItems = orderDropdownItems.filter(item => item !== currentOrder);

  const getGreetings = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return "Good Morning!👋";
    if (currentHour < 17) return "Good Afternoon 🌇";
    return "Good Evening 🌆";
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
        <div className='dropdown' ref={dropdownRef}>
          <Arrow text={currentCategory} onClick={toggleAllDropdown} isRotated={isRotatedAll} />
          <div className={`dropdown-menu ${showAllDropdown ? 'show' : ''}`}>
            {filteredAllDropdownItems.map((item, index) => (
              <div key={index} onClick={() => handleCategorySelect(item)} className="dropdown-item">{item}</div>
            ))}
          </div>
        </div>

        <div className='dropdown'>
          <Arrow text={currentOrder} onClick={toggleOrderDropdown} isRotated={isRotatedOrder} />
          <div className={`dropdown-menu ${showOrderDropdown ? 'show' : ''}`}>
            {filteredOrderDropdownItems.map((item, index) => (
              <div key={index} onClick={() => handleOrderSelect(item)} className="dropdown-item">{item}</div>
            ))}
          </div>
        </div>
      </div>
      <div className='posts'>
        <Fade triggerOnce duration={700}>
          {currentPosts.map((data) => (
            <Post
              key={data.id}
              image={data.image}
              title={data.title}
              content={data.content}
              author={data.author}
              date={data.editedDate === null ? data.publishedDate : data.editedDate}
              category={data.category}
              loading={loading}
            />
          ))}
        </Fade>
      </div>
      <Pagination
        postsPerPage={postsPerPage}
        length={filteredPosts.length}
        handlePagination={handlePagination}
        currentPage={currentPage}
      />
    </div>
  );
}

export default Home;
