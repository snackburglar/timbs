const express = require("express");

const { authenticate, requireAdmin } = require("../middleware/auth");
const validateBody = require("../middleware/validateBody");
const store = require("../store");
const { productSchema } = require("../validation/schemas");
const { makeId } = require("../utils");

const router = express.Router();

router.get("/", async (req, res) => {
  // normalize filters so matching is case-insensitive and whitespace-tolerant.
  const query = String(req.query.q || "")
    .trim()
    .toLowerCase();
  const category = String(req.query.category || "")
    .trim()
    .toLowerCase();
  const sort = String(req.query.sort || "name");
  // filter the collection first, then order only the records being returned.
  const usesFirestoreSortKey = category && ["price-asc", "price-desc"].includes(sort);
  const products = usesFirestoreSortKey
    ? await store.listProductsByCategoryAndPrice(
        String(req.query.category).trim(),
        sort === "price-desc" ? "desc" : "asc",
      )
    : await store.list("products");
  const result = products.filter(
    (product) =>
      (!query ||
        `${product.name} ${product.description}`.toLowerCase().includes(query)) &&
      (usesFirestoreSortKey ||
        !category ||
        product.category.toLowerCase() === category),
  );
  if (!usesFirestoreSortKey) {
    result.sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return a.name.localeCompare(b.name);
    });
  }
  res.json({ data: result });
});

router.get("/:id", async (req, res) => {
  const product = await store.get("products", req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  return res.json({ data: product });
});

router.post(
  "/",
  authenticate,
  requireAdmin,
  validateBody(productSchema),
  async (req, res) => {
    // derive a stable route id from the name and reject collisions before saving.
    const product = { id: makeId(req.body.name), ...req.body };
    if (!(await store.create("products", product))) {
      return res
        .status(409)
        .json({ error: "A product with that name already exists" });
    }
    return res.status(201).json({ data: product });
  },
);

router.put(
  "/:id",
  authenticate,
  requireAdmin,
  validateBody(productSchema),
  async (req, res) => {
    const product = await store.replace("products", req.params.id, {
      id: req.params.id,
      ...req.body,
    });
    if (!product)
      return res.status(404).json({ error: "Product not found" });
    return res.json({ data: product });
  },
);

router.delete("/:id", authenticate, requireAdmin, async (req, res) => {
  if (!(await store.remove("products", req.params.id)))
    return res.status(404).json({ error: "Product not found" });
  return res.status(204).send();
});

module.exports = router;
