import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Fade } from "react-awesome-reveal";

const Article = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [categories, setCategories] = useState([]); 

  useEffect(() => {
    fetch(`http://localhost:3000/api/post/${id}`)
      .then(response => response.json())
      .then(data => setPost(data))
      .catch(error => console.error("Error fetching post:", error));

    fetch('http://localhost:3000/api/category')
      .then(response => response.json())
      .then(data => setCategories(data)) 
      .catch(error => console.error("Error fetching categories:", error));
  }, [id]);

  if (!post) return <p>Loading...</p>;

  const publishedDate = post.createdAt.replace(/[_*]/g, '').replace('Publicado el ', '', 'Published on ');
  const categoryName = categories.find(cat => cat.id === post.categoryId)?.name || 'Unknown Category';

  return (
    <Fade triggerOnce duration={500}>
      <div className="article">
        <img src={post.image} alt={post.title} className='article-banner' />
        <ReactMarkdown className="article-title">{post.title}</ReactMarkdown>
        <ReactMarkdown className="article-content">{post.content_full}</ReactMarkdown>
        <ReactMarkdown className="article-author">{`By: ${post.author}`}</ReactMarkdown>
        <ReactMarkdown className="article-date">{`Published on: ${new Date(publishedDate).toLocaleDateString()}`}</ReactMarkdown>
        <ReactMarkdown className="article-category">{`Category: ${categoryName}`}</ReactMarkdown>
      </div>
    </Fade>
  );
};

export default Article;
