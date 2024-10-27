// Article.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import data from '../../../server/api/get/posts/posts.json';
import jsonCategories from '../../../server/api/get/categories/categories.json';
import ReactMarkdown from 'react-markdown';
import { Fade, Slide } from "react-awesome-reveal";

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

  const publishedDate = post.publishedDate.replace(/[_*]/g, '').replace('Publicado el ', '', 'Published on ');
  const categoryName = jsonCategories.find(cat => cat.id === post.categoryId)?.name || 'Unknown Category';

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
