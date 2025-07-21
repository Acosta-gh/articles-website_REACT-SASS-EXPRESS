import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Fade } from "react-awesome-reveal";
import { marked } from 'marked';
import { jwtDecode } from 'jwt-decode';
import { fetchPosts } from '../services/postService';
import { fetchBookmarks } from '../services/bookmarkService';
import { fetchComments } from '../services/commentService';

import LoadingScreen from "../components/LoadingScreen"
import { fetchCategories } from '../services/categoryService';

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
  const [openReplyId, setOpenReplyId] = useState(null);

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
    console.log(data);
  }
  const loadIfBookmarked = async (token, id) => {
    if (token) {
      const data = await fetchBookmarks(token, id);
      if (data.bookmark != null) {
        setIsSaved(true);
      }
    }
  };

  if (!post) return <LoadingScreen></LoadingScreen> //  Si no hay post, muestra la pantalla de carga
  
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

  const toggleReplyId = (commentId) => {
    if (openReplyId === commentId) {
      setOpenReplyId(null);
    } else {
      setOpenReplyId(commentId);
    }
  };

  
  // 👷 Auxiliares
  const bookmarkIcon = isSaved ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bookmark-check-fill" viewBox="0 0 16 16">
      <path fillRule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5m8.854-9.646a.5.5 0 0 0-.708-.708L7.5 7.793 6.354 6.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bookmark" viewBox="0 0 16 16">
      <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
    </svg>
  );
  const publishedDate = post.createdAt.replace(/[_*]/g, '').replace('Publicado el ', '', 'Published on ');
  const categoryName = categories ? categories.name : 'Unknown Category';
  const imageUrl = post.image ? `${API}/uploads/posts/${post.image}` : null;
  //  Markdown a HTML usando marked
  const contentHTML = post.content ? marked(post.content) : '';


  return (
    <div className='article-page page-container'>
      <Fade triggerOnce duration={500}>
        <div className="article">
          {imageUrl && <img src={imageUrl} alt={post.title} className='article__banner' />}
          <h1 className="title article__title">{post.title}</h1>
          <div className='article__buttons'>
            <button className='article__buttons--save btn btn-outline' onClick={() => handleToggleBookmark(post.id)}>
              {bookmarkIcon}
              {isSaved ? 'Saved' : 'Save'}
            </button>
          </div>
          <div className="paragraph article__content" dangerouslySetInnerHTML={{ __html: contentHTML }} />
          <p className="paragraph article__author">{`By: ${post.authorUser?.name || "Anonymous"}`}</p>
          <p className="paragraph article__date">{`Published on: ${new Date(post.createdAt).toLocaleDateString()}`}</p>
          <p className="paragraph article__category">{`Category: ${categoryName}`}</p>
        </div>

        <div className="comment">
          <h2 className='comment__subtitle subtitle'>Comments</h2>
          <form className="comment__form" onSubmit={handleSubmit}>
            <div className="comment__group">
              <label className="paragraph comment__label">Leave a comment:</label>
              <textarea
                className="comment__input"
                type="text"
                name="name"
                value={commentInput.comment}
                onChange={e =>
                  setcommentInput(prev => ({
                    ...prev,
                    comment: e.target.value,
                    commentId: null
                  }))
                }
              />
              <button className="comment__button btn btn-outline" type="submit">Post</button>
            </div>
          </form>

          {comments.filter(comment => comment.postId === post.id)
            .map(comment => (
              <div key={comment.id} className="comment__item">
                <div className='comment__content'>
                  <div className="comment">
                    <div>
                      <div className="content">
                        <div className="avatar profile-avatar">
                          <img src={`${API}/uploads/profiles/${comment.author.image}`} alt="User's avatar" />
                        </div>
                        <div className="content-comment">
                          <div className="user">
                            <h5>{comment.author?.name || 'Anonymous'}</h5>
                            <span className="is-mute">{new Date(comment.createdAt).toLocaleString()}</span>
                          </div>
                          <p>{comment.content}</p>
                          <div className="content-footer">
                            <button className="btn btn-outline" onClick={() => toggleReplyId(comment.id)} >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-reply-fill" viewBox="0 0 16 16">
                                <path d="M5.921 11.9 1.353 8.62a.72.72 0 0 1 0-1.238L5.921 4.1A.716.716 0 0 1 7 4.719V6c1.5 0 6 0 7 8-2.5-4.5-7-4-7-4v1.281c0 .56-.606.898-1.079.62z" />
                              </svg> Reply</button>
                            {comment.commentId === null && openReplyId === comment.id && (
                              <Fade triggerOnce duration={250}>
                                <form className='comment__reply-form' onSubmit={(e) => handleSubmit(e, comment.id)}>
                                  <div className='comment__reply-group'>
                                    <input className="comment__input paragraph"
                                      value={replyInputs[comment.id] || ''}
                                      onChange={e =>
                                        setReplyInputs(prev => ({ ...prev, [comment.id]: e.target.value }))
                                      }
                                    />
                                  </div>
                                  <button className='btn btn-outline comment__button' type="submit">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send-fill" viewBox="0 0 16 16">
                                      <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
                                    </svg>
                                    Send
                                  </button>
                                </form>
                              </Fade>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mostrar respuestas a los comentarios */}
                {Array.isArray(comment.childrenComment) && comment.childrenComment.length > 0 && (
                  <div className="comment__replies">
                    {comment.childrenComment.map(comment_reply => (
                      <div key={comment_reply.id} className="comment_reply profile-avatar">
                        <div className="comment">
                          <div className="content">
                            <div className="avatar"> <img src={`${API}/uploads/profiles/${comment_reply.author.image}`} alt="User's avatar" /></div>
                            <div className="content-comment">
                              <div className="user">
                                <h5>{comment_reply.author?.name || 'Anonymous'}</h5>
                                <span className="is-mute">{new Date(comment_reply.createdAt).toLocaleString()}</span>
                              </div>
                              <p>{comment_reply.content}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </div>
      </Fade>
    </div>
  );
};

export default Article;
