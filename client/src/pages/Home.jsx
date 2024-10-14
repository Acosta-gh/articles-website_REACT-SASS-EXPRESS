import React, { useEffect, useState } from 'react';
import Post from "../components/Post";
import Pagination from "../components/Pagination"; 
import data from '../../../server/api/get/posts/posts.json'; 

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);  
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(5);

  useEffect(() => {
    setPosts(data); // Simulamos la carga de datos desde un archivo JSON
  }, []);


  const indexOfLastPost = currentPage * postsPerPage; 
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  }
  
  return (
    <div className='home'>
      {currentPosts.map((data, index) => ( 
        <Post 
          key={index} 
          image={data.image} 
          title={data.title} 
          content={data.content} 
          author={data.author}
          date = {data.editedDate === null ? data.publishedDate : data.editedDate} 
          loading={loading}
        />
      ))}
      <Pagination 
        postsPerPage={postsPerPage} 
        length={posts.length} 
        handlePagination={handlePagination} 
        currentPage={currentPage} 
      />
    </div>
  );
}

export default Home;
