import { NavLink } from "react-router-dom";
import styled from "styled-components";

const Card = styled.article`
  overflow: hidden;
  border: 1px solid #e4e7ed;
  border-radius: 0.65rem;
  color: #5f2027;
`;

const ProductLink = styled(NavLink)`
  display: block;
  color: inherit;
  text-decoration: none;
`;

const Artwork = styled.div`
  display: grid;
  aspect-ratio: 4 / 3;
  place-items: center;
  background: ${({ $colour }) => $colour};
  color: #ffffff;
`;

const ArtworkInitials = styled.span`
  font-size: clamp(2rem, 7vw, 3rem);
  font-weight: 800;
`;

const ProductInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem 1rem;
`;

const ProductName = styled.h2`
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.3;
`;

const Price = styled.p`
  flex-shrink: 0;
  margin: 0;
  color: #c1121f;
  font-size: 0.9rem;
  font-weight: 800;
`;

function FeaturedProductCard({ product }) {
  // format numbers for display but allow preformatted values from other sources.
  const price =
    typeof product.price === "number"
      ? product.price.toLocaleString("en-AU", {
          style: "currency",
          currency: "AUD",
        })
      : product.price;

  return (
    <Card>
      <ProductLink to={`/products/${product.id}`}>
        <Artwork $colour={product.colour}>
          <ArtworkInitials>{product.initials}</ArtworkInitials>
        </Artwork>
        <ProductInfo>
          <ProductName>{product.name}</ProductName>
          <Price>{price}</Price>
        </ProductInfo>
      </ProductLink>
    </Card>
  );
}

export default FeaturedProductCard;
