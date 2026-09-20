import { Link, useParams } from "react-router-dom";
import styled from "styled-components";

import useApiResource from "../../hooks/useApiResource";
import NotFound from "./NotFound";

const Article = styled.article`
  max-width: 760px;
  margin: 0 auto;
  padding: 2rem 0 4rem;

  p {
    line-height: 1.7;
  }
`;

function NewsArticle() {
  const { id } = useParams();
  const { data: article, loading, error } = useApiResource(`/news/${id}`);
  if (loading) return <p>Loading article...</p>;
  if (error?.status === 404) return <NotFound />;
  if (error)
    return <p role="alert">Unable to load this article: {error.message}</p>;
  return (
    <Article>
      <p>
        {article.category} / {article.date}
      </p>
      <h1>{article.title}</h1>
      <p>
        <strong>{article.excerpt}</strong>
      </p>
      <p>{article.content}</p>
      <Link to="/news">Back to news</Link>
    </Article>
  );
}

export default NewsArticle;
