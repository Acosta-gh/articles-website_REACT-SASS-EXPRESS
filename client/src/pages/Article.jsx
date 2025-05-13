import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Fade } from "react-awesome-reveal";
import { marked } from 'marked';
import { jwtDecode } from 'jwt-decode';
import { fetchPosts } from '../api/postService';
import { fetchBookmarks } from '../api/bookmarkService';
import { fetchComments } from '../api/commentService';

import LoadingScreen from "../components/LoadingScreen"
import { fetchCategories } from '../api/categoryService';

const API = import.meta.env.VITE_API_URL;

const Article = () => {
  // Estados
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [categories, setCategories] = useState([]);
  const [comments, setComments] = useState([])
  const [isSaved, setIsSaved] = useState(false);
  const [commentInput, setcommentInput] = useState({ comment: '', commentId: null });
  const [replyInputs, setReplyInputs] = useState({}); // key: commentId, value: text

  // Carga inicial
  useEffect(() => {
    const token = localStorage.getItem('token');
    loadPost(id);
    loadComments(id);
    loadIfBookmarked(token, id);
  }, [id]); // este useEffect depende de 'id', se ejecuta cuando 'id' cambia

  // este useEffect se ejecutará una vez que tengamos el 'post' disponible
  useEffect(() => {
    if (post && post.categoryId) {
      loadCategory(post.categoryId);
    }
  }, [post]);  // este useEffect depende de 'post', se ejecuta cuando 'post' cambia

  // 📞 Fetch Functions
  const loadCategory = async (categoryId) => {
    const data = await fetchCategories(categoryId)
    if (data.error) {
      setCategories(null)
    } else {
      setCategories(data)
    }
  }
  const loadPost = async (id) => {
    const data = await fetchPosts(id);
    setPost(data)
  }
  const loadComments = async (id) => {
    const data = await fetchComments(id)
    setComments(data)
  }
  const loadIfBookmarked = async (token, id) => {
    if (token) {
      const data = await fetchBookmarks(token, id);
      if (data.bookmark != null) {
        setIsSaved(true);
      }
    }
  };

  // 🖐️ Hanlders
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
      if (!response.ok) {
        throw new Error('Error al guardar/eliminar el bookmark');
      }
      const data = await response.json();
      setIsSaved((prev) => !prev);
    } catch (error) {
      console.error('Error al guardar/eliminar bookmark:', error);
      alert('There was an error saving/deliting this bookmark.');
    }
  };
  const handleSubmit = async (e, commentId = null) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in');
      return;
    }
    const decoded = jwtDecode(token);
    const content = commentId ? replyInputs[commentId] : commentInput.comment;
    const payload = {
      content,
      postId: post.id,
      userId: decoded.id,
      commentId,
    };
    const res = await fetch(`${API}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) return alert(`Error: ${data.message}`);
    if (commentId) {
      setReplyInputs(prev => ({ ...prev, [commentId]: '' }));
    } else {
      setcommentInput({ comment: '', commentId: null });
    }
    await loadComments(post.id); //  TEMP: actualiza la lista de comentarios
  };

  if (!post) return <LoadingScreen></LoadingScreen>

  const publishedDate = post.createdAt.replace(/[_*]/g, '').replace('Publicado el ', '', 'Published on ');
  const categoryName = categories ? categories.name : 'Unknown Category';
  const imageUrl = post.image ? `${API}/uploads/${post.image}` : null;

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
        <p className="article__author">{`By: ${post.authorUser?.name || "Anonymous"}`}</p>
        <p className="article__date">{`Published on: ${new Date(publishedDate).toLocaleDateString()}`}</p>
        <p className="article__category">{`Category: ${categoryName}`}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label>comment:</label>
          <input type="text" name="name" value={commentInput.comment} onChange={e => setcommentInput(prev => ({ ...prev, comment: e.target.value, commentId: null }))} />
        </div>
        <button className='button' type="submit">post comment</button>
      </form>

      <div className="comments-section">
        <h2>Comments</h2>
        {comments.filter(comment => comment.postId === post.id)
          .map(comment => (
            <div key={comment.id} className="comment">
              <p><strong>{comment.author?.name || 'Anonymous'}:</strong> {comment.content}</p>
              <img src={`${API}/uploads/${comment.author.image}`} alt="User's avatar" />
              <p className="comment__date">{new Date(comment.createdAt).toLocaleString()}</p>
              {comment.commentId === null && (
                <form onSubmit={(e) => handleSubmit(e, comment.id)}>
                  <div>
                    <label>Reply:</label>
                    <input
                      value={replyInputs[comment.id] || ''}
                      onChange={e =>
                        setReplyInputs(prev => ({ ...prev, [comment.id]: e.target.value }))
                      }
                    />
                  </div>
                  <button className='button' type="submit">post reply</button>
                </form>
              )}
              {Array.isArray(comment.childrenComment) && comment.childrenComment.length > 0 && (
                <div>
                  rta:
                  {comment.childrenComment.map(comment_reply => (
                    <div key={comment_reply.id} className="comment_reply">
                      <p><strong>{comment_reply.author?.name || 'Anonymous'}:</strong> {comment_reply.content}</p>
                      <img src={`${API}/uploads/${comment_reply.author.image}`} alt="User's avatar" />
                      <p className="comment__date">{new Date(comment_reply.createdAt).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
      </div>
    </Fade>

  );
};

export default Article;
