const express = require("express");

const { authenticate, requireAdmin } = require("../middleware/auth");
const validateBody = require("../middleware/validateBody");
const store = require("../store");
const { newsSchema } = require("../validation/schemas");
const { makeId } = require("../utils");

const router = express.Router();

router.get("/", async (req, res) => {
  const news = await store.list("news");
  res.json({
    // sort fetched records without changing their stored order
    data: [...news].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)),
  });
});

router.get("/:id", async (req, res) => {
  const article = await store.get("news", req.params.id);
  if (!article)
    return res.status(404).json({ error: "News article not found" });
  return res.json({ data: article });
});

router.post(
  "/",
  authenticate,
  requireAdmin,
  validateBody(newsSchema),
  async (req, res) => {
    const article = {
      id: makeId(req.body.title),
      publishedAt: req.body.publishedAt || new Date().toISOString(),
      ...req.body,
    };
    if (!(await store.create("news", article))) {
      return res
        .status(409)
        .json({ error: "A news article with that title already exists" });
    }
    return res.status(201).json({ data: article });
  },
);

router.put(
  "/:id",
  authenticate,
  requireAdmin,
  validateBody(newsSchema),
  async (req, res) => {
    const previous = await store.get("news", req.params.id);
    if (!previous)
      return res.status(404).json({ error: "News article not found" });
    const article = {
      id: req.params.id,
      // keep the existing timestamp when the update omits one
      publishedAt: previous.publishedAt,
      ...req.body,
    };
    const updated = await store.replace("news", req.params.id, article);
    if (!updated)
      return res.status(404).json({ error: "News article not found" });
    return res.json({ data: updated });
  },
);

router.delete("/:id", authenticate, requireAdmin, async (req, res) => {
  if (!(await store.remove("news", req.params.id)))
    return res.status(404).json({ error: "News article not found" });
  return res.status(204).send();
});

module.exports = router;
