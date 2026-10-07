import { useState } from "react";
import styled from "styled-components";

import ProductCard from "../ProductCard";
import useApiResource from "../../hooks/useApiResource";

const ProductsPage = styled.section`
  padding: 1rem 0 3rem;
`;

const FilterBar = styled.form`
  display: grid;
  grid-template-columns: minmax(12rem, 1fr) 12rem auto;
  gap: 1rem;
  align-items: end;
  margin: 2rem 0;
  padding: 1rem;
  border: 1px solid #eadfe1;
  border-radius: 0.5rem;

  label {
    display: grid;
    gap: 0.35rem;
    color: #5f2027;
    font-weight: 700;
  }

  input,
  select {
    min-width: 0;
    padding: 0.65rem;
    border: 1px solid #cdbcc0;
    border-radius: 0.25rem;
    font: inherit;
  }

  @media (max-width: 650px) {
    grid-template-columns: 1fr;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 650px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 440px) {
    grid-template-columns: 1fr;
  }
`;

function Products() {
  const [filters, setFilters] = useState({ q: "", category: "", sort: "name" });
  // serializing the form state makes each filter change a new resource request.
  const query = new URLSearchParams(filters).toString();
  const {
    data: products,
    loading,
    error,
  } = useApiResource(`/products?${query}`);

  function updateFilter(event) {
    setFilters((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  return (
    <ProductsPage>
      <h1>Products</h1>
      <p>Wear the colours. Support the club.</p>
      <FilterBar onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="product-search">
          Search products
          <input
            id="product-search"
            name="q"
            value={filters.q}
            onChange={updateFilter}
            placeholder="Search by name"
          />
        </label>
        <label htmlFor="product-category">
          Category
          <select
            id="product-category"
            name="category"
            value={filters.category}
            onChange={updateFilter}
          >
            <option value="">All categories</option>
            <option value="Matchwear">Matchwear</option>
            <option value="Training">Training</option>
            <option value="Supporter gear">Supporter gear</option>
            <option value="Accessories">Accessories</option>
          </select>
        </label>
        <label htmlFor="product-sort">
          Sort by
          <select
            id="product-sort"
            name="sort"
            value={filters.sort}
            onChange={updateFilter}
          >
            <option value="name">Name</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </label>
      </FilterBar>
      {loading && <p>Loading products...</p>}
      {error && <p role="alert">Unable to load products: {error.message}</p>}
      {!loading && !error && products.length === 0 && (
        <p>No products match those filters.</p>
      )}
      {!loading && !error && products.length > 0 && (
        <ProductGrid>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ProductGrid>
      )}
    </ProductsPage>
  );
}

export default Products;
