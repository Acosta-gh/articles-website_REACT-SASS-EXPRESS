import { useRouteError } from "react-router-dom";
import { IoHomeSharp } from "react-icons/io5";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>404 Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <p>
      </p>
      <a href="/"><IoHomeSharp /> <span>Go Home</span></a>
    </div>
  );
}
