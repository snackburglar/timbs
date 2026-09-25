import { Link } from "react-router-dom";

function ServerError() {
  return (
    <section role="alert">
      <h1>Something Went Wrong</h1>
      <p>Sorry, the server could not complete your request.</p>
      <Link to="/">Return home</Link>
    </section>
  );
}

export default ServerError;
