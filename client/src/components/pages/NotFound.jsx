import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section role="alert">
      <h1>Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/">Return home</Link>
    </section>
  );
}

export default NotFound;
