import { Link, useParams } from "react-router-dom";
import styled from "styled-components";

import useApiResource from "../../hooks/useApiResource";
import NotFound from "./NotFound";

const Details = styled.article`
  display: grid;
  grid-template-columns: minmax(15rem, 1fr) minmax(15rem, 1fr);
  gap: 3rem;
  align-items: center;
  padding: 2rem 0 4rem;

  @media (max-width: 650px) {
    grid-template-columns: 1fr;
  }
`;

const Artwork = styled.div`
  display: grid;
  min-height: 20rem;
  place-items: center;
  border-radius: 0.75rem;
  background: ${({ $colour }) => $colour};
  color: white;
`;

const Initials = styled.span`
  font-size: 6rem;
  font-weight: 800;
`;

const Price = styled.p`
  color: #c1121f;
  font-size: 1.5rem;
  font-weight: 800;
`;

function ProductDetails() {
  const { id } = useParams();
  const { data: product, loading, error } = useApiResource(`/products/${id}`);
  if (loading) return <p>Loading product...</p>;
  if (error?.status === 404) return <NotFound />;
  if (error)
    return <p role="alert">Unable to load this product: {error.message}</p>;
  const price = product.price.toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
  });
  return (
    <Details>
      <Artwork $colour={product.colour}>
        <Initials>{product.initials}</Initials>
      </Artwork>
      <div>
        <p>{product.category}</p>
        <h1>{product.name}</h1>
        <Price>{price}</Price>
        <p>{product.description}</p>
        <p>
          {product.available
            ? "Available for the prototype shop"
            : "Currently unavailable"}
        </p>
        <Link to="/products">Back to products</Link>
      </div>
    </Details>
  );
}

export default ProductDetails;
