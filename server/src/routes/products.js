const express = require("express");

const { authenticate, requireAdmin } = require("../middleware/auth");
const validateBody = require("../middleware/validateBody");
const { products } = require("../store");
const { productSchema } = require("../validation/schemas");
const { makeId } = require("../utils");

const router = express.Router();

router.get("/", (req, res) => {
  // normalize filters so matching is case-insensitive and whitespace-tolerant.
  const query = String(req.query.q || "")
    .trim()
    .toLowerCase();
  const category = String(req.query.category || "")
    .trim()
    .toLowerCase();
  const sort = String(req.query.sort || "name");
  // filter the collection first, then order only the records being returned.
  const result = products
    .filter(
      (product) =>
        !query ||
        `${product.name} ${product.description}`.toLowerCase().includes(query),
    )
    .filter(
      (product) => !category || product.category.toLowerCase() === category,
    )
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return a.name.localeCompare(b.name);
    });
  res.json({ data: result });
});

router.get("/:id", (req, res) => {
  const product = products.find((candidate) => candidate.id === req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  return res.json({ data: product });
});

router.post(
  "/",
  authenticate,
  requireAdmin,
  validateBody(productSchema),
  (req, res) => {
    // derive a stable route id from the name and reject collisions before saving.
    const product = { id: makeId(req.body.name), ...req.body };
    if (products.some((candidate) => candidate.id === product.id)) {
      return res
        .status(409)
        .json({ error: "A product with that name already exists" });
    }
    products.push(product);
    return res.status(201).json({ data: product });
  },
);

router.put(
  "/:id",
  authenticate,
  requireAdmin,
  validateBody(productSchema),
  (req, res) => {
    const index = products.findIndex(
      (candidate) => candidate.id === req.params.id,
    );
    if (index === -1)
      return res.status(404).json({ error: "Product not found" });
    products[index] = { id: req.params.id, ...req.body };
    return res.json({ data: products[index] });
  },
);

router.delete("/:id", authenticate, requireAdmin, (req, res) => {
  const index = products.findIndex(
    (candidate) => candidate.id === req.params.id,
  );
  if (index === -1) return res.status(404).json({ error: "Product not found" });
  products.splice(index, 1);
  return res.status(204).send();
});

module.exports = router;
