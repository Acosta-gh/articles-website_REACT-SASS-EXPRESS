import { useRouteError } from "react-router-dom";
import { IoHomeSharp } from "react-icons/io5";

export default function ErrorPage() {
  const error = useRouteError();
  console.log(error);
  console.log(error.statusText, "<-- error status text");
  console.log(error.message, "<-- error message");
  console.log(String(error), "<-- error as string");
  
  return (
    <div id="error-page">
      <h1>404 Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <a href="/"><IoHomeSharp /> <span>Go Home</span></a>
      {error &&
        <p style={{ color: "gray" }}>
          {error.statusText || error.message || String(error)}
        </p>
      }
    </div>
  );
}