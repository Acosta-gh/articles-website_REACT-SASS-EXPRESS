import React, { useEffect, useState } from 'react';
import Post from "../components/Post";
import postsData from '../../../server/api/get/posts/posts.json'; 

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Simulamos la carga de datos desde un archivo JSON // We simulate loading data from a JSON file
    setPosts(postsData);
  }, []);

  return (
    <div>
      {posts.map(post => (
        <Post 
          key={post.id} 
          image={post.image} 
          title={post.title} 
          content={post.content} 
          author={post.author} 
        />
      ))}
    </div>
  );
}

export default Home;
