import { useState } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";

import { apiRequest } from "../../api";
import useApiResource from "../../hooks/useApiResource";
import FeaturedProductCard from "../FeaturedProductCard";
import NewsCard from "../NewsCard";

const HomePage = styled.section`
  padding-top: 4rem;
  text-align: center;
`;

const Heading = styled.h1`
  width: 100%;
  margin: 0 0 0.75rem;
  font-size: clamp(1.75rem, 4vw, 3rem);
`;

const Description = styled.p`
  margin: 0 0 2rem;
  color: #70565a;
  font-size: 1rem;
`;

const VideoFrame = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 0.75rem;

  video {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;

  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
    max-width: 260px;
  }
`;

const ActionButton = styled(NavLink)`
  padding: 0.8rem 1.4rem;
  background: #c1121f;
  color: #ffffff;
  font-weight: 700;
  text-decoration: none;
  border-radius: 0.25rem;

  &:hover,
  &:focus-visible {
    background: #99101a;
  }
`;

const ContentSection = styled.section`
  width: 100%;
  max-width: 900px;
  margin: 4rem auto 0;
  text-align: left;
`;

const SectionHeading = styled.h2`
  margin: 0 0 1.25rem;
  font-size: 1.5rem;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  @media (max-width: 700px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 440px) {
    grid-template-columns: 1fr;
  }
`;

const NewsGrid = styled(ProductGrid)``;

const Newsletter = styled.section`
  width: 100%;
  max-width: 900px;
  margin: 4rem auto 0;
  padding: 2rem;
  border-radius: 0.65rem;
  background: #6f0a12;
  color: #ffffff;
  text-align: left;
`;

const NewsletterHeading = styled.h2`
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
`;

const NewsletterDescription = styled.p`
  margin: 0 0 1.25rem;
  color: #f1dfe1;
`;

const NewsletterForm = styled.form`
  display: flex;
  gap: 0.75rem;

  @media (max-width: 520px) {
    flex-direction: column;
  }
`;

const EmailInput = styled.input`
  min-width: 0;
  flex: 1;
  padding: 0.8rem 1rem;
  border: 0;
  border-radius: 0.25rem;
  font: inherit;
`;

const SubscribeButton = styled.button`
  padding: 0.8rem 1.4rem;
  border: 0;
  border-radius: 0.25rem;
  background: #c1121f;
  color: #ffffff;
  cursor: pointer;
  font: inherit;
  font-weight: 700;

  &:hover,
  &:focus-visible {
    background: #99101a;
  }
`;

const Status = styled.p`
  margin: 1rem 0 0;
  color: ${({ $error }) => ($error ? "#ffd3d7" : "#d8ffd8")};
`;

function Home() {
  const productsResource = useApiResource("/products?sort=price-desc");
  const newsResource = useApiResource("/news");
  const [email, setEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("");
  const [newsletterError, setNewsletterError] = useState(false);

  async function subscribe(event) {
    event.preventDefault();
    setNewsletterStatus("");
    setNewsletterError(false);
    try {
      const response = await apiRequest("/newsletter", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setNewsletterStatus(response.message);
      setEmail("");
    } catch (error) {
      setNewsletterStatus(error.message);
      setNewsletterError(true);
    }
  }

  return (
    <HomePage>
      <Heading>One club. One heartbeat. Every match.</Heading>
      <Description>
        Proudly representing our community on and off the pitch.
      </Description>
      <VideoFrame>
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Timbertop United football video"
        >
          <source src="/videos/club-video.mp4" type="video/mp4" />
        </video>
      </VideoFrame>
      <Actions>
        <ActionButton to="/products">Browse products</ActionButton>
        <ActionButton to="/news">News</ActionButton>
      </Actions>
      <ContentSection>
        <SectionHeading>Club favourites</SectionHeading>
        {productsResource.loading && <p>Loading products...</p>}
        {productsResource.error && (
          <p role="alert">Products are temporarily unavailable.</p>
        )}
        {!productsResource.loading && !productsResource.error && (
          <ProductGrid>
            {productsResource.data.slice(0, 3).map((product) => (
              <FeaturedProductCard key={product.id} product={product} />
            ))}
          </ProductGrid>
        )}
      </ContentSection>
      <ContentSection>
        <SectionHeading>Latest news</SectionHeading>
        {newsResource.loading && <p>Loading news...</p>}
        {newsResource.error && (
          <p role="alert">News is temporarily unavailable.</p>
        )}
        {!newsResource.loading && !newsResource.error && (
          <NewsGrid>
            {newsResource.data.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </NewsGrid>
        )}
      </ContentSection>
      <Newsletter>
        <NewsletterHeading>Stay in the loop</NewsletterHeading>
        <NewsletterDescription>
          Get the latest club news, match updates, and Timbertop stories.
        </NewsletterDescription>
        <NewsletterForm onSubmit={subscribe}>
          <EmailInput
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Your email address"
            aria-label="Your email address"
            required
          />
          <SubscribeButton type="submit">Subscribe</SubscribeButton>
        </NewsletterForm>
        {newsletterStatus && (
          <Status role="status" $error={newsletterError}>
            {newsletterStatus}
          </Status>
        )}
      </Newsletter>
    </HomePage>
  );
}

export default Home;
