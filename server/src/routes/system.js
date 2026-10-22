const express = require("express");
require("../store");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ name: "Timbertop United API", status: "ok" });
});

router.get("/api/health", (req, res) => {
  res.json({ status: "ok", storage: "firestore" });
});

module.exports = router;
