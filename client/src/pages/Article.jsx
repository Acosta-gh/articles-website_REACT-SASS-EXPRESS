import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Fade } from "react-awesome-reveal";
import { marked } from 'marked';
import { jwtDecode } from 'jwt-decode';

const Article = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [categories, setCategories] = useState([]);
  const [comments, setComments] = useState([])
  const [isSaved, setIsSaved] = useState(false);
  const [formData, setFormData] = useState({ comment: '' });
  const token = localStorage.getItem('token');

  const POSTS_PER_PAGE = 10;
  const API = "http://127.0.0.1:3000";

  useEffect(() => {
    fetch(`http://localhost:3000/post/${id}`)
      .then(response => response.json())
      .then(data => setPost(data))
      .catch(error => console.error("Error fetching post:", error));

    fetch(`http://localhost:3000/comment/${id}`)
      .then(response => response.json())
      .then(data => setComments(data))
      .catch(error => console.error("Error fetching categories:", error));

    fetch(`${API}/comment`)
      .then(response => response.json())
      .then(data => setComments(data))
      .catch(error => console.error("Error fetching comments:", error))

    if (token) {
      fetch('http://localhost:3000/bookmark', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })
        .then(response => response.json())
        .then(data => {
          const bookmarkedPostIds = data.map(post => post.id);
          if (bookmarkedPostIds.includes(Number(id))) {
            setIsSaved(true);
          }
        })
        .catch(error => console.error("Error checking bookmarks:", error));
    }
  }, [id]);


  const handleToggleBookmark = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No hay token disponible. Inicia sesión.');
        return;
      }
      const decoded = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decoded.exp && decoded.exp < currentTime) {
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        localStorage.removeItem('token');
        return;
      }

      // Realiza la solicitud solo si el token es válido
      const response = await fetch(`http://localhost:3000/bookmark/${postId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Verifica si la respuesta es exitosa
      if (!response.ok) {
        throw new Error('Error al guardar/eliminar el bookmark');
      }

      const data = await response.json();
      console.log(data.message);

      // Solo cambiar el estado si la solicitud fue exitosa
      setIsSaved((prev) => !prev);
    } catch (error) {
      console.error('Error al guardar/eliminar bookmark:', error);
      alert('Ocurrió un error al intentar guardar/eliminar el bookmark.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);

    const payload = {
      content: formData.comment,
      postId: post.id,
      userId: decoded.id
    };

    try {
      const res = await fetch(`${API}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) return alert(`Error: ${data.message}`);

      setFormData({ comment: '' });
      setComments(prev => [...prev, data]);
      alert("Comentario enviado");
    } catch (err) {
      console.error("Error creating comment:", err);
    }
  };


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
        <div className='article__buttons'>
          <button onClick={() => handleToggleBookmark(post.id)}>
            {isSaved ? '🔖 Saved' : '📑 Save'}
          </button>
        </div>
        <div className="article__content" dangerouslySetInnerHTML={{ __html: contentHTML }} />
        <p className="article__author">{`By: ${post.authorUser?.name}`}</p>
        <p className="article__date">{`Published on: ${new Date(publishedDate).toLocaleDateString()}`}</p>
        <p className="article__category">{`Category: ${categoryName}`}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label>comment:</label>
          <input type="text" name="name" value={formData.comment} onChange={e => setFormData({ comment: e.target.value })} />
        </div>
        <button className='button' type="submit">post comment</button>
      </form>
      <div className="comments-section">
        <h2>Comments</h2>
        {comments.filter(comment => comment.postId === post.id).map(comment => (
          <div key={comment.id} className="comment">
            <p><strong>{comment.user?.name || 'Anonymous'}:</strong> {comment.content}</p>
            <p className="comment__date">{new Date(comment.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </Fade>

  );
};

export default Article;
