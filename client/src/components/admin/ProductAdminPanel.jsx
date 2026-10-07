import { useState } from "react";

import { apiRequest } from "../../api";
import useApiResource from "../../hooks/useApiResource";
import {
  ButtonRow,
  CheckLabel,
  DangerButton,
  Feedback,
  Form,
  Panel,
  Record,
  Records,
  SecondaryButton,
} from "./AdminStyles";

function emptyProduct() {
  return {
    name: "",
    category: "",
    price: "",
    initials: "",
    colour: "#c1121f",
    description: "",
    available: true,
  };
}

function ProductAdminPanel() {
  const productsResource = useApiResource("/products?sort=name");
  const [product, setProduct] = useState(emptyProduct);
  const [feedback, setFeedback] = useState("");
  const [feedbackError, setFeedbackError] = useState(false);

  function updateProduct(event) {
    const { name, value, type, checked } = event.target;
    setProduct((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function showFeedback(message, isError = false) {
    setFeedback(message);
    setFeedbackError(isError);
  }

  async function saveProduct(event) {
    event.preventDefault();
    // ids are route data, while the form keeps price as a text input value.
    const { id, ...payload } = product;

    try {
      const response = await apiRequest(id ? `/products/${id}` : "/products", {
        method: id ? "PUT" : "POST",
        body: JSON.stringify({ ...payload, price: Number(payload.price) }),
      });
      setProduct(emptyProduct());
      showFeedback(
        `Product ${id ? "updated" : "created"}: ${response.data.name}`,
      );
      productsResource.reload();
    } catch (error) {
      showFeedback(error.message, true);
    }
  }

  async function deleteProduct(id) {
    if (!window.confirm("Delete this product?")) return;

    try {
      await apiRequest(`/products/${id}`, { method: "DELETE" });
      showFeedback("Product deleted.");
      productsResource.reload();
    } catch (error) {
      showFeedback(error.message, true);
    }
  }

  return (
    <Panel>
      <h2>{product.id ? "Edit product" : "New product"}</h2>
      <Form onSubmit={saveProduct}>
        <label htmlFor="admin-product-name">
          Name
          <input
            id="admin-product-name"
            name="name"
            value={product.name}
            onChange={updateProduct}
            required
          />
        </label>
        <label htmlFor="admin-product-category">
          Category
          <input
            id="admin-product-category"
            name="category"
            value={product.category}
            onChange={updateProduct}
            required
          />
        </label>
        <label htmlFor="admin-product-price">
          Price
          <input
            id="admin-product-price"
            name="price"
            type="number"
            min="0.01"
            step="0.01"
            value={product.price}
            onChange={updateProduct}
            required
          />
        </label>
        <label htmlFor="admin-product-initials">
          Artwork initials
          <input
            id="admin-product-initials"
            name="initials"
            maxLength="4"
            value={product.initials}
            onChange={updateProduct}
            required
          />
        </label>
        <label htmlFor="admin-product-colour">
          Artwork colour
          <input
            id="admin-product-colour"
            name="colour"
            type="color"
            value={product.colour}
            onChange={updateProduct}
            required
          />
        </label>
        <label htmlFor="admin-product-description">
          Description
          <textarea
            id="admin-product-description"
            name="description"
            value={product.description}
            onChange={updateProduct}
            required
          />
        </label>
        <CheckLabel htmlFor="admin-product-available">
          <input
            id="admin-product-available"
            name="available"
            type="checkbox"
            checked={product.available}
            onChange={updateProduct}
          />
          <span>Available</span>
        </CheckLabel>
        <ButtonRow>
          <button type="submit">
            {product.id ? "Update product" : "Create product"}
          </button>
          {product.id && (
            <SecondaryButton
              type="button"
              onClick={() => setProduct(emptyProduct())}
            >
              Cancel
            </SecondaryButton>
          )}
        </ButtonRow>
      </Form>
      {feedback && (
        <Feedback
          role={feedbackError ? "alert" : "status"}
          $error={feedbackError}
        >
          {feedback}
        </Feedback>
      )}
      <Records>
        {productsResource.data.map((item) => (
          <Record key={item.id}>
            <span>{item.name}</span>
            <ButtonRow>
              <SecondaryButton type="button" onClick={() => setProduct(item)}>
                Edit
              </SecondaryButton>
              <DangerButton
                type="button"
                onClick={() => deleteProduct(item.id)}
              >
                Delete
              </DangerButton>
            </ButtonRow>
          </Record>
        ))}
      </Records>
    </Panel>
  );
}

export default ProductAdminPanel;
