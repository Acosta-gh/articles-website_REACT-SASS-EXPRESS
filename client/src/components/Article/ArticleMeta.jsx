export default function ArticleMeta({ author, date, category }) {
  return (
    <>
      <p className="paragraph article__author">{`By: ${author || "Anonymous"}`}</p>
      <p className="paragraph article__date">{`Published on: ${date}`}</p>
      <p className="paragraph article__category">{`Category: ${category}`}</p>
    </>
  );
}