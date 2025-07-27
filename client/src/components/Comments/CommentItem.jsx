import { Fade } from "react-awesome-reveal";
import ReplyForm from "../Article/ReplyForm";
import CommentReplies from "./CommentReplies";

export default function CommentItem({
  comment,
  apiUrl,
  openReplyId,
  toggleReplyId,
  replyValue,
  handleReplyChange,
  handleReplySubmit,
}) {
  return (
    <div className="comment__item">
      <div className="comment__content">
        <div className="comment">
          <div>
            <div className="content">
              <div className="avatar profile-avatar">
                <img
                  src={`${apiUrl}/uploads/profiles/${comment.author.image}`}
                  alt="User's avatar"
                />
              </div>
              <div className="content-comment">
                <div className="user">
                  <h5>{comment.author?.name || "Anonymous"}</h5>
                  <span className="is-mute">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
                <p>{comment.content}</p>
                <div className="content-footer">
                  <button
                    className="btn btn-outline"
                    onClick={() => toggleReplyId(comment.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-reply-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M5.921 11.9 1.353 8.62a.72.72 0 0 1 0-1.238L5.921 4.1A.716.716 0 0 1 7 4.719V6c1.5 0 6 0 7 8-2.5-4.5-7-4-7-4v1.281c0 .56-.606.898-1.079.62z" />
                    </svg>{" "}
                    Reply
                  </button>
                  {comment.commentId === null &&
                    openReplyId === comment.id && (
                      <Fade triggerOnce duration={250}>
                        <ReplyForm
                          value={replyValue}
                          onChange={handleReplyChange}
                          onSubmit={handleReplySubmit}
                        />
                      </Fade>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CommentReplies replies={comment.childrenComment} apiUrl={apiUrl} />
    </div>
  );
}