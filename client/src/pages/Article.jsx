// Article.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import data from '../../../server/api/get/posts/posts.json';
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

  const publishedDate = post.publishedDate.replace(/[_*]/g, '').replace('Publicado el ', '');

  return (
    <Fade triggerOnce duration={500}>
      <div className="article">
        <img src={post.image} alt={post.title} />
        <ReactMarkdown>{post.title}</ReactMarkdown>
        <ReactMarkdown>{post.content_full}</ReactMarkdown>
        <ReactMarkdown>{`By: ${post.author}`}</ReactMarkdown>
        <ReactMarkdown>{`Published on: ${new Date(publishedDate).toLocaleDateString()}`}</ReactMarkdown>
        <ReactMarkdown>{`Category: ${post.category}`}</ReactMarkdown>
      </div>
    </Fade>
  );
};

export default Article;
