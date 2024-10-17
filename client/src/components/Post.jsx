import React from 'react';

const Post = ({ index, image, title, content, author, date , category ,loading }) => {
  if (loading) {
    return (
      <h1>Loading.....</h1>
    );
  }

  return (
    <div className='post' key={index}> 
      <div>
        <img src={image} alt={title} />
      </div>
      <div>
        <h3>{category}</h3>
        <p>{title}</p>
      </div>
      <div>
        <i>{author} - {date}</i>
      </div>
    </div>
  );
};

export default Post;
