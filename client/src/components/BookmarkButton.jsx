export default function BookmarkButton({ isSaved, onClick, icon }) {
  return (
    <button className="article__buttons--save btn btn-outline" onClick={onClick}>
      {icon}
      {isSaved ? "Saved" : "Save"}
    </button>
  );
}