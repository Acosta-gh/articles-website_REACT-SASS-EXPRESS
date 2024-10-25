import React from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import jsonCategories from '../../../server/api/get/categories/categories.json';


const Post = ({ key, index, image, title, content, author, date, categoryId, loading }) => {
  if (loading) {
    return <h1>Loading.....</h1>;
  }

  console.log('categoryId:', categoryId);
console.log('jsonCategories:', jsonCategories);


  // Extract the date from the string 
  const extractDate = (dateString) => {
    const match = dateString.match(/\d{4}-\d{2}-\d{2}/); // Regex to match a date in YYYY-MM-DD format
    return match ? new Date(match[0]).toLocaleDateString() : 'Unknown';
  };

  const publishedDate = extractDate(date);

  // Find the category name based on the categoryId
  const categoryName = jsonCategories.find(cat => cat.id === categoryId)?.name || 'Unknown Category';

  return (
    <div className='post' key={key} data-category-id={categoryId}>
      <Link to={`/article/${index}`}>
        <div className='post-image'>
          <img src={image} alt={title} />
        </div>
        <div className='post-content'>
          <h3>{categoryName}</h3>
          <h4><ReactMarkdown>{title}</ReactMarkdown></h4>
          <p><ReactMarkdown>{content}</ReactMarkdown></p>
        </div>
        <div className='post-bottom'>
          <p><ReactMarkdown>{author}</ReactMarkdown></p>
          <p>—</p>
          <i><ReactMarkdown>{publishedDate}</ReactMarkdown></i>
        </div>
      </Link>
    </div>
  );
};

export default Post;
