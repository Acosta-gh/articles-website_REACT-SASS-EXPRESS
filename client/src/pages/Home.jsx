import React, { useEffect, useState } from 'react';
import Post from "../components/Post";
import Pagination from "../components/Pagination";
import data from '../../../server/api/get/posts/posts.json';
import Arrow from "../components/Arrow";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(5);
  
  const [showAllDropdown, setShowAllDropdown] = useState(false);
  const [showOrderDropdown, setShowOrderDropdown] = useState(false);
  const [isRotatedAll, setIsRotatedAll] = useState(false);
  const [isRotatedOrder, setIsRotatedOrder] = useState(false);
  
  const [currentCategory, setCurrentCategory] = useState('All');
  const [currentOrder, setCurrentOrder] = useState('Newest');

  useEffect(() => {
    setPosts(data); // Simulamos la carga de posts desde un archivo JSON | Simulate loading posts from a JSON file
  }, []);

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
    setShowOrderDropdown(false); // Cerrar el otro dropdown si está abierto | Close the other dropdown if it's open
    setIsRotatedAll(prev => !prev);
    if (showAllDropdown) setIsRotatedAll(false); // Si ya estaba abierto, restablecer rotación | If it was already open, reset rotation
  };

  const toggleOrderDropdown = () => {
    setShowOrderDropdown(!showOrderDropdown);
    setShowAllDropdown(false); // Cerrar el otro dropdown si está abierto | Close the other dropdown if it's open
    setIsRotatedOrder(prev => !prev); 
    if (showOrderDropdown) setIsRotatedOrder(false); // Si ya estaba abierto, restablecer rotación | If it was already open, reset rotation
  };

  const handleCategorySelect = (category) => {
    setCurrentCategory(category);
    setShowAllDropdown(false);
    setIsRotatedAll(false); // Restablecer la rotación al seleccionar | Reset the rotation when selecting
  };

  const handleOrderSelect = (orderOption) => {
    setCurrentOrder(orderOption);
    setShowOrderDropdown(false);
    setIsRotatedOrder(false); // Restablecer la rotación al seleccionar | Reset the rotation when selecting
  };

  const allDropdownItems = ['All', 'Category 1', 'Category 2', 'Category 3']; 
  const orderDropdownItems = ['Newest', 'Oldest', 'Most Popular']; 

  const filteredAllDropdownItems = allDropdownItems.filter(item => item !== currentCategory);
  const filteredOrderDropdownItems = orderDropdownItems.filter(item => item !== currentOrder);

  return (
    <div className='home'>
      <div className='home-category'>
        <div className='dropdown'>
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
