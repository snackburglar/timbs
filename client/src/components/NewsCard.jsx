import { NavLink } from "react-router-dom";
import styled from "styled-components";

const Card = styled.article`
  overflow: hidden;
  border: 1px solid #e4e7ed;
  border-radius: 0.65rem;
  background: #ffffff;
  transition:
    transform 160ms ease,
    box-shadow 160ms ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 0.75rem 1.5rem rgba(143, 13, 23, 0.12);
  }
`;

const NewsLink = styled(NavLink)`
  display: block;
  color: inherit;
  text-decoration: none;
`;

const Artwork = styled.div`
  display: grid;
  aspect-ratio: 16 / 8;
  place-items: center;
  background: ${({ $colour }) => $colour};
  color: #ffffff;
`;

const ArtworkInitials = styled.span`
  font-size: 2rem;
  font-weight: 800;
`;

const NewsInfo = styled.div`
  padding: 1rem;
`;

const Meta = styled.p`
  margin: 0 0 0.5rem;
  color: #80666a;
  font-size: 0.7rem;
  font-weight: 700;
`;

const NewsTitle = styled.h2`
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.3;
`;

const Excerpt = styled.p`
  margin: 0.65rem 0 0;
  color: #70565a;
  font-size: 0.9rem;
  line-height: 1.5;
`;

function NewsCard({ article }) {
  return (
    <Card>
      <NewsLink to={`/news/${article.id}`}>
        <Artwork $colour={article.colour}>
          <ArtworkInitials>{article.initials}</ArtworkInitials>
        </Artwork>
        <NewsInfo>
          <Meta>
            {article.category} / {article.date}
          </Meta>
          <NewsTitle>{article.title}</NewsTitle>
          <Excerpt>{article.excerpt}</Excerpt>
        </NewsInfo>
      </NewsLink>
    </Card>
  );
}

export default NewsCard;
