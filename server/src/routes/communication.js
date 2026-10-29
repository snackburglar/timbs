const express = require("express");
const { randomUUID } = require("node:crypto");

const validateBody = require("../middleware/validateBody");
const store = require("../store");
const { contactSchema, newsletterSchema } = require("../validation/schemas");

const router = express.Router();

router.post("/contact", validateBody(contactSchema), async (req, res) => {
  // capture receipt time on the server so clients cannot set it themselves
  await store.create("contactMessages", {
    id: `message-${randomUUID()}`,
    ...req.body,
    receivedAt: new Date().toISOString(),
  });
  res.status(201).json({ message: "Your message has been received" });
});

router.post("/newsletter", validateBody(newsletterSchema), async (req, res) => {
  const email = req.body.email.toLowerCase();
  // repeated sign ups should not create duplicate entries
  const id = Buffer.from(email).toString("base64url");
  await store.create("subscriptions", { id, email });
  res.status(201).json({ message: "You are subscribed to club updates" });
});

module.exports = router;
