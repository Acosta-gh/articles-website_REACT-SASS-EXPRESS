export default function CommentForm({ value, onChange, onSubmit }) {
  return (
    <form className="comment__form" onSubmit={onSubmit}>
      <div className="comment__group">
        <label className="paragraph comment__label">Leave a comment:</label>
        <textarea
          className="comment__input"
          type="text"
          name="name"
          value={value}
          onChange={onChange}
        />
        <button className="comment__button btn btn-outline" type="submit">
          Post
        </button>
      </div>
    </form>
  );
}