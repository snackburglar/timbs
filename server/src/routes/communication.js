const express = require("express");

const validateBody = require("../middleware/validateBody");
const { contactMessages, subscriptions } = require("../store");
const { contactSchema, newsletterSchema } = require("../validation/schemas");

const router = express.Router();

router.post("/contact", validateBody(contactSchema), (req, res) => {
  contactMessages.push({
    id: `message-${Date.now()}`,
    ...req.body,
    receivedAt: new Date().toISOString(),
  });
  res.status(201).json({ message: "Your message has been received" });
});

router.post("/newsletter", validateBody(newsletterSchema), (req, res) => {
  const email = req.body.email.toLowerCase();
  if (!subscriptions.includes(email)) subscriptions.push(email);
  res.status(201).json({ message: "You are subscribed to club updates" });
});

module.exports = router;
