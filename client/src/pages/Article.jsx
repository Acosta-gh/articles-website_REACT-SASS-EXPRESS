// Article.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import data from '../../../server/api/get/posts/posts.json'; 

const Article = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const foundPost = data.find((item) => item.id.toString() === id);
    setPost(foundPost);
  }, [id]);

  if (!post) {
    return <p>Loading post...</p>;
  }

  return (
    <div className="article">
      <img src={post.image} alt={post.title} />
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p>By: {post.author}</p>
      <p>Published on: {new Date(post.publishedDate).toLocaleDateString()}</p>
      <p>Category: {post.category}</p>
    </div>
  );
};

export default Article;
