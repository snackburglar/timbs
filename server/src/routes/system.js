const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ name: "Timbertop United API", status: "ok" });
});

router.get("/api/health", (req, res) => {
  res.json({ status: "ok", storage: "local-mock" });
});

module.exports = router;
