import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Fade } from "react-awesome-reveal";

// Auth Context
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL;

// Services (TODO: Cambiar por Hooks)
import { fetchBookmarks, toggleBookmark } from "../services/bookmarkService";
import { fetchComments, createComment, deleteComment } from "../services/commentService";

// Hooks
import { usePosts } from "../hooks/usePosts";
import { useCategories } from "../hooks/useCategories";

// Componentes  
import ArticleBanner from "../components/Article/ArticleBanner";
import BookmarkButton from "../components/BookmarkButton";
import ArticleContent from "../components/Article/ArticleContent";
import ArticleMeta from "../components/Article/ArticleMeta";
import CommentsSection from "../components/Article/CommentsSection";
import LoadingScreen from "../components/LoadingScreen";

const Article = () => {
  const { id } = useParams();
  const { categories } = useCategories();
  const [comments, setComments] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [commentInput, setCommentInput] = useState({
    comment: "",
    commentId: null,
  });
  const [replyInputs, setReplyInputs] = useState({});
  const [openReplyId, setOpenReplyId] = useState(null);

  const { posts, isLoading } = usePosts(id);

  // Auth context
  const { user, token, isAuthenticated, isTokenExpired } = useAuth();
  try {
    localStorage.setItem("userId", user.id);
    console.log(localStorage.getItem("userId"));
  } catch (err) {
    console.error("Error setting userId in localStorage:", err);
  }

  useEffect(() => {
    loadComments(id);
    if (token && !isTokenExpired()) {
      loadIfBookmarked(token, id);
    }
  }, [id, token]);

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
      if (!isAuthenticated || isTokenExpired()) {
        alert("You must be logged in.");
        return;
      }
      const success = await toggleBookmark(postId);
      if (success) {
        setIsSaved((prev) => !prev);
      } else {
        alert("There was an error saving/deleting this bookmark.");
        console.log("Error toggling bookmark");
      }
    } catch (error) {
      alert("There was an error saving/deleting this bookmark.");
      console.error("Error:", error);
      console.log(error, "<-- error in handleToggleBookmark");
    }
  };

  const handleSubmit = async (e, commentId = null) => {
    e.preventDefault();
    if (!isAuthenticated || isTokenExpired()) {
      alert("You must be logged in");
      return;
    }
    const content = commentId ? replyInputs[commentId] : commentInput.comment;

    try {
      await createComment({
        content,
        postId: posts.id,
        userId: user.id,
        commentId,
      });
      if (commentId) {
        setReplyInputs((prev) => ({ ...prev, [commentId]: "" }));
      } else {
        setCommentInput({ comment: "", commentId: null });
      }
      await loadComments(posts.id);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await deleteComment(commentId);
      if (response) {
        setComments(prev => removeReplyOrComment(prev, commentId));
      } else {
        alert("Failed to delete comment");
      }
    } catch (error) {
      alert("There was an error deleting the comment.");
    }
  };

  function removeReplyOrComment(comments, idToRemove) {
    return comments
      .filter(comment => comment.id !== idToRemove)
      .map(comment => ({
        ...comment,
        childrenComment: Array.isArray(comment.childrenComment)
          ? comment.childrenComment.filter(reply => reply.id !== idToRemove)
          : [],
      }));
  }

  if (isLoading || !posts) return <LoadingScreen />;

  const categoryObj = categories.find(cat => cat.id === posts.categoryId);
  const categoryName = categoryObj ? categoryObj.name : "Unknown Category";
  const publishedDate = new Date(posts.createdAt).toLocaleDateString();
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
          onDelete={handleDeleteComment}
        />
      </Fade>
    </div>
  );
};

export default Article;