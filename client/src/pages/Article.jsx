import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import { jwtDecode } from "jwt-decode";
import { fetchBookmarks } from "../services/bookmarkService";
import { fetchComments } from "../services/commentService";
import LoadingScreen from "../components/LoadingScreen";
import { fetchCategories } from "../services/categoryService";
import { usePosts } from "../hooks/usePosts";

import ArticleBanner from "../components/Article/ArticleBanner";
import BookmarkButton from "../components/BookmarkButton";
import ArticleContent from "../components/Article/ArticleContent";
import ArticleMeta from "../components/Article/ArticleMeta";
import CommentsSection from "../components/Article/CommentsSection";

const API = import.meta.env.VITE_API_URL;

const Article = () => {
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [comments, setComments] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [commentInput, setCommentInput] = useState({
    comment: "",
    commentId: null,
  });
  const [replyInputs, setReplyInputs] = useState({});
  const [openReplyId, setOpenReplyId] = useState(null);

  const { posts, isLoading } = usePosts(id);

  useEffect(() => {
    const token = localStorage.getItem("token");
    loadComments(id);
    loadIfBookmarked(token, id);
  }, [id]);

  useEffect(() => {
    if (posts && posts.categoryId) {
      loadCategory(posts.categoryId);
    }
  }, [posts]);

  const loadCategory = async (categoryId) => {
    const data = await fetchCategories(categoryId);
    setCategories(data.error ? null : data);
  };

  const loadComments = async (id) => {
    const data = await fetchComments(id);
    setComments(data);
  };

  const loadIfBookmarked = async (token, id) => {
    if (token) {
      const data = await fetchBookmarks(token, id);
      if (data.bookmark != null) {
        setIsSaved(true);
      }
    }
  };

  if (isLoading || !posts) return <LoadingScreen />;

  const handleToggleBookmark = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in.");
        return;
      }
      const decoded = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < currentTime) {
        alert("Your session expired.");
        localStorage.removeItem("token");
        return;
      }
      const response = await fetch(`${API}/bookmark/${postId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Error al guardar/eliminar el bookmark");
      }
      await response.json();
      setIsSaved((prev) => !prev);
    } catch (error) {
      console.error("Error al guardar/eliminar bookmark:", error);
      alert("There was an error saving/deliting this bookmark.");
    }
  };

  const handleSubmit = async (e, commentId = null) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in");
      return;
    }
    const decoded = jwtDecode(token);
    const content = commentId ? replyInputs[commentId] : commentInput.comment;
    const payload = {
      content,
      postId: posts.id,
      userId: decoded.id,
      commentId,
    };
    const res = await fetch(`${API}/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) return alert(`Error: ${data.message}`);
    if (commentId) {
      setReplyInputs((prev) => ({ ...prev, [commentId]: "" }));
    } else {
      setCommentInput({ comment: "", commentId: null });
    }
    await loadComments(posts.id);
  };

  const publishedDate = new Date(posts.createdAt).toLocaleDateString();
  const categoryName = categories ? categories.name : "Unknown Category";
  const imageUrl = posts.image ? `${API}/uploads/posts/${posts.image}` : null;

  const bookmarkIcon = isSaved ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-bookmark-check-fill"
      viewBox="0 0 16 16"
    >
      <path
        fillRule="evenodd"
        d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5m8.854-9.646a.5.5 0 0 0-.708-.708L7.5 7.793 6.354 6.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0z"
      />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-bookmark"
      viewBox="0 0 16 16"
    >
      <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
    </svg>
  );

  return (
    <div className="article-page page-container">
      <Fade triggerOnce duration={500}>
        <div className="article">
          <ArticleBanner imageUrl={imageUrl} title={posts.title} />
          <h1 className="title article__title">{posts.title}</h1>
          <div className="article__buttons">
            <BookmarkButton
              isSaved={isSaved}
              onClick={() => handleToggleBookmark(posts.id)}
              icon={bookmarkIcon}
            />
          </div>
          <ArticleContent content={posts.content} />
          <ArticleMeta
            author={posts.authorUser?.name}
            date={publishedDate}
            category={categoryName}
          />
        </div>
        <CommentsSection
          comments={comments}
          postId={posts.id}
          commentInput={commentInput}
          setCommentInput={setCommentInput}
          handleSubmit={handleSubmit}
          openReplyId={openReplyId}
          setOpenReplyId={setOpenReplyId}
          replyInputs={replyInputs}
          setReplyInputs={setReplyInputs}
          apiUrl={API}
        />
      </Fade>
    </div>
  );
};

export default Article;