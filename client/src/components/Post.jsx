import React from 'react';

const Post = ({ image, title, content, author }) => {
  return (
    <div className='post'>
      <div>
        <img src={image} alt={title} />
      </div>
      <div>
        <h3>{title}</h3>
        <p>{content}</p>
      </div>
      <div>
        <i>{author}</i>
      </div>
    </div>
  );
};

export default Post;
