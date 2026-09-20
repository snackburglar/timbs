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

const ProductLink = styled(NavLink)`
  display: block;
  color: inherit;
  text-decoration: none;
`;

const Artwork = styled.div`
  display: grid;
  aspect-ratio: 1 / 1;
  place-items: center;
  background: ${({ $colour }) => $colour};
  color: #ffffff;
`;

const ArtworkInitials = styled.span`
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: 800;
`;

const ProductInfo = styled.div`
  padding: 1rem;
`;

const Category = styled.p`
  margin: 0 0 0.35rem;
  color: #80666a;
  font-size: 0.7rem;
  font-weight: 700;
`;

const ProductName = styled.h2`
  margin: 0;
  font-size: 1rem;
  line-height: 1.3;
`;

const Price = styled.p`
  margin: 0.5rem 0 0;
  color: #c1121f;
  font-weight: 800;
`;

function ProductCard({ product }) {
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
          <Category>{product.category}</Category>
          <ProductName>{product.name}</ProductName>
          <Price>{price}</Price>
        </ProductInfo>
      </ProductLink>
    </Card>
  );
}

export default ProductCard;
