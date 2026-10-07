import styled from "styled-components";

import NewsCard from "../NewsCard";
import useApiResource from "../../hooks/useApiResource";

const NewsPage = styled.section`
  padding: 1rem 0 3rem;
`;

const NewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 2rem;

  @media (max-width: 800px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 440px) {
    grid-template-columns: 1fr;
  }
`;

function News() {
  // the api already returns newest-first, so the page can render the list directly.
  const { data: news, loading, error } = useApiResource("/news");
  return (
    <NewsPage>
      <h1>Club News</h1>
      <p>Stories from around Timbertop United.</p>
      {loading && <p>Loading news...</p>}
      {error && <p role="alert">Unable to load news: {error.message}</p>}
      {!loading && !error && (
        <NewsGrid>
          {news.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </NewsGrid>
      )}
    </NewsPage>
  );
}

export default News;
