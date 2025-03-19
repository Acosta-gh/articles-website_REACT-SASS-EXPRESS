// Card

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Post = ({ key, index, image, title, content, content_highlight, author, date, categoryId, loading }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/category/')
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error("Error fetching categories:", error));
  }, []);

  if (loading) {
    return <h1>Loading.....</h1>;
  }

  const formattedDate = date ? new Date(date).toLocaleDateString() : 'Date not available';

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
            <h4>{title}</h4>
            <p>{content_highlight}</p>
          </div>
        </div>
        <div className='post-bottom'>
          <p>By: </p>
          <p>{author}</p>
          <p>—</p>
          <i>{formattedDate}</i>
        </div>
      </Link>
    </div>
  );
};

export default Post;
