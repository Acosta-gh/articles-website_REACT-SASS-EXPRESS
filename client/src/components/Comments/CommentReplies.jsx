export default function CommentReplies({ replies, apiUrl, onDelete, commentId }) {
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
                  {/* Botón borrado */}
                  <button onClick = {() => onDelete(commentId)}  className="btn btn-outline"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
                  </svg></button>
                </div>
                <p>{reply.content}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}