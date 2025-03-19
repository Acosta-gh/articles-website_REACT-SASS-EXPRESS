import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Fade } from "react-awesome-reveal";
import { marked } from 'marked'; 

const Article = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [categories, setCategories] = useState([]); 

  useEffect(() => {
    fetch(`http://localhost:3000/post/${id}`)
      .then(response => response.json())
      .then(data => setPost(data))
      .catch(error => console.error("Error fetching post:", error));

    fetch('http://localhost:3000/category/') 
      .then(response => response.json())
      .then(data => setCategories(data)) 
      .catch(error => console.error("Error fetching categories:", error));
  }, [id]);

  if (!post) return <p>Loading...</p>;

  const publishedDate = post.createdAt.replace(/[_*]/g, '').replace('Publicado el ', '', 'Published on ');
  const categoryName = categories.find(cat => cat.id === post.categoryId)?.name || 'Unknown Category';

  const imageUrl = post.image ? `http://localhost:3000/uploads/${post.image}` : null;

  //  Markdown a HTML usando marked
  const contentHTML = post.content ? marked(post.content) : '';

  return (
    <Fade triggerOnce duration={500}>
      <div className="article">
        {imageUrl && <img src={imageUrl} alt={post.title} className='article__banner' />}
        <h1 className="article__title">{post.title}</h1>
        <div className="article__content" dangerouslySetInnerHTML={{ __html: contentHTML }} />
        <p className="article__author">{`By: ${post.authorUser?.name}`}</p>
        <p className="article__date">{`Published on: ${new Date(publishedDate).toLocaleDateString()}`}</p>
        <p className="article__category">{`Category: ${categoryName}`}</p>
      </div>
    </Fade>
  );
};

export default Article;
