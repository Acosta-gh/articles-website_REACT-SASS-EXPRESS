import React from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const Post = ({ key, index, image, title, content, author, date, category, loading }) => {
  if (loading) {
    return <h1>Loading.....</h1>;
  }

  // Extract the date from the string 
  const extractDate = (dateString) => {
    const match = dateString.match(/\d{4}-\d{2}-\d{2}/); // Regex to match a date in YYYY-MM-DD format
    return match ? new Date(match[0]).toLocaleDateString() : 'Unknown';
  };

  const publishedDate = extractDate(date);

  return (
    <div className='post' key={key}>
      <Link to={`/article/${index}`}>
        <div className='post-image'>
          <img src={image} alt={title} />
        </div>
        <div className='post-content'>
          <h3><ReactMarkdown>{category}</ReactMarkdown></h3>
          <h4><ReactMarkdown>{title}</ReactMarkdown></h4>
          <p><ReactMarkdown>{content}</ReactMarkdown></p>
        </div>
        <div className='post-bottom'>
          <p><ReactMarkdown>{`${author}`}</ReactMarkdown></p>
          <p><ReactMarkdown>{`—`}</ReactMarkdown></p>
          <i><ReactMarkdown>{`${publishedDate}`}</ReactMarkdown></i>
        </div>
      </Link>
    </div>
  );
};

export default Post;
