export default function ArticleBanner({ imageUrl, title }) {
  if (!imageUrl) return null;
  return <img src={imageUrl} alt={title} className="article__banner" />;
}