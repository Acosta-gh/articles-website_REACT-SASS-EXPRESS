// Card

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
const API = 'http://localhost:3000';

const Post = ({ id, index, image, title, content, content_highlight, author, date, categoryId, loading, isBookmarked }) => {
  const [categories, setCategories] = useState([]);
  const [isSaved, setIsSaved] = useState(isBookmarked);

  useEffect(() => {
    fetch(`${API}/category/`)
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error("Error fetching categories:", error));
  }, []);

  if (loading) {
    return <h1>Loading.....</h1>;
  }

  const handleToggleBookmark = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in.');
        return;
      }
      const decoded = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < currentTime) {
        alert('Your session expired.');
        localStorage.removeItem('token');
        return;
      }
      const response = await fetch(`${API}/bookmark/${postId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Bookmark toggle failed');
      setIsSaved(prev => !prev);
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error saving/deleting the bookmark.');
    }
  };

  const bookmarkIcon = isSaved ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bookmark-check-fill" viewBox="0 0 16 16">
      <path fillRule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5m8.854-9.646a.5.5 0 0 0-.708-.708L7.5 7.793 6.354 6.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bookmark" viewBox="0 0 16 16">
      <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
    </svg>
  );

  const formattedDate = date ? new Date(date).toLocaleDateString() : 'Date not available';

  const categoryName = categories.find(cat => cat.id === categoryId)?.name || 'Unknown Category';

  return (
    <div className='post' key={id} data-category-id={categoryId}>
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
          <p>By: {author}</p>
          <p>—</p>
          <i>{formattedDate}</i>
        </div>
      </Link>
      
      {typeof isBookmarked !== 'undefined' && (
      <button
        className='article__buttons--save btn btn-outline'
        onClick={() => handleToggleBookmark(id)}
      >
        {isSaved ? 'Saved' : 'Save'} {bookmarkIcon}
      </button>
    )}

    </div>
  );
};

export default Post;
