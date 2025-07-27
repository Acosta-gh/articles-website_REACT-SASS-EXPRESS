export default function CommentReplies({ replies, apiUrl, onDelete }) {
  if (!Array.isArray(replies) || replies.length === 0) return null;
  return (
    <div className="comment__replies">
      {replies.map((reply) => (
        <div key={reply.id} className="comment_reply profile-avatar">
          <div className="comment">
            <div className="content">
              <div className="avatar">
                <img
                  src={`${apiUrl}/uploads/profiles/${reply.author.image}`}
                  alt="User's avatar"
                />
              </div>
              <div className="content-comment">
                <div className="user">
                  <h5>{reply.author?.name || "Anonymous"}</h5>
                  <span className="is-mute">
                    {new Date(reply.createdAt).toLocaleString()}
                  </span>
                </div>
                <p>{reply.content}</p>
                <div className="content-footer">
                  <button
                    className="btn btn-outline comment__button"
                    onClick={() => onDelete && onDelete(reply.id)}
                  >
                   
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}