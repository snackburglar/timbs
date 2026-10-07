const express = require("express");

const { authenticate, requireAdmin } = require("../middleware/auth");
const validateBody = require("../middleware/validateBody");
const { news } = require("../store");
const { newsSchema } = require("../validation/schemas");
const { makeId } = require("../utils");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    // sort a copy so reads do not mutate the shared in-memory collection.
    data: [...news].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)),
  });
});

router.get("/:id", (req, res) => {
  const article = news.find((candidate) => candidate.id === req.params.id);
  if (!article)
    return res.status(404).json({ error: "News article not found" });
  return res.json({ data: article });
});

router.post(
  "/",
  authenticate,
  requireAdmin,
  validateBody(newsSchema),
  (req, res) => {
    const article = {
      id: makeId(req.body.title),
      publishedAt: req.body.publishedAt || new Date().toISOString(),
      ...req.body,
    };
    if (news.some((candidate) => candidate.id === article.id)) {
      return res
        .status(409)
        .json({ error: "A news article with that title already exists" });
    }
    news.push(article);
    return res.status(201).json({ data: article });
  },
);

router.put(
  "/:id",
  authenticate,
  requireAdmin,
  validateBody(newsSchema),
  (req, res) => {
    const index = news.findIndex((candidate) => candidate.id === req.params.id);
    if (index === -1)
      return res.status(404).json({ error: "News article not found" });
    news[index] = {
      id: req.params.id,
      // keep the existing timestamp when the update omits one.
      publishedAt: news[index].publishedAt,
      ...req.body,
    };
    return res.json({ data: news[index] });
  },
);

router.delete("/:id", authenticate, requireAdmin, (req, res) => {
  const index = news.findIndex((candidate) => candidate.id === req.params.id);
  if (index === -1)
    return res.status(404).json({ error: "News article not found" });
  news.splice(index, 1);
  return res.status(204).send();
});

module.exports = router;
