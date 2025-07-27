import { marked } from "marked";

export default function ArticleContent({ content }) {
  return (
    <div
      className="paragraph article__content"
      dangerouslySetInnerHTML={{ __html: marked(content || "") }}
    />
  );
}