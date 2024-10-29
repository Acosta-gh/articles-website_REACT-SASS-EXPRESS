import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const Post = ({ key, index, image, title, content, author, date, categoryId, loading }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/category')
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error("Error fetching categories:", error));
  }, []);

  if (loading) {
    return <h1>Loading.....</h1>;
  }

  // Format date with a fallback
  const formattedDate = date ? new Date(date).toLocaleDateString() : 'Date not available';

  // Find category name based on categoryId
  const categoryName = categories.find(cat => cat.id === categoryId)?.name || 'Unknown Category';

  return (
    <div className='post' key={key} data-category-id={categoryId}>
      <Link to={`/article/${index}`}>
        <div>
          <div className='post-image'>
            <img src={image} alt={title} />
          </div>
          <div className='post-content'>
            <h3>{categoryName}</h3>
            <h4><ReactMarkdown>{title}</ReactMarkdown></h4>
            <p><ReactMarkdown>{content}</ReactMarkdown></p>
          </div>
        </div>
        <div className='post-bottom'>
          <p>By: </p>
          <p><ReactMarkdown>{author}</ReactMarkdown></p>
          <p>—</p>
          <i><ReactMarkdown>{formattedDate}</ReactMarkdown></i>
        </div>
      </Link>
    </div>
  );
};

export default Post;
