import CommentForm from "../Comments/CommentForm";
import CommentItem from "../Comments/CommentItem";

export default function CommentsSection({
  comments,
  postId,
  commentInput,
  setCommentInput,
  handleSubmit,
  openReplyId,
  setOpenReplyId,
  replyInputs,
  setReplyInputs,
  apiUrl,
}) {
  const handleReplyChange = (commentId) => (e) =>
    setReplyInputs((prev) => ({
      ...prev,
      [commentId]: e.target.value,
    }));

  const handleReplySubmit = (commentId) => (e) => {
    handleSubmit(e, commentId);
  };

  return (
    <div className="comment">
      <h2 className="comment__subtitle subtitle">Comments</h2>
      <CommentForm
        value={commentInput.comment}
        onChange={(e) =>
          setCommentInput((prev) => ({
            ...prev,
            comment: e.target.value,
            commentId: null,
          }))
        }
        onSubmit={handleSubmit}
      />
      {comments
        .filter((comment) => comment.postId === postId)
        .map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            apiUrl={apiUrl}
            openReplyId={openReplyId}
            toggleReplyId={setOpenReplyId}
            replyValue={replyInputs[comment.id] || ""}
            handleReplyChange={handleReplyChange(comment.id)}
            handleReplySubmit={handleReplySubmit(comment.id)}
          />
        ))}
    </div>
  );
}