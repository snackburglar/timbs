const bcrypt = require("bcryptjs");
const express = require("express");
const { rateLimit } = require("express-rate-limit");
const jwt = require("jsonwebtoken");
const { randomUUID } = require("node:crypto");

const { jwtSecret } = require("../config");
const { authenticate } = require("../middleware/auth");
const validateBody = require("../middleware/validateBody");
const store = require("../store");
const {
  credentialsSchema,
  registrationSchema,
} = require("../validation/schemas");
const { publicUser } = require("../utils");

const router = express.Router();
const registrationLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many registration attempts. Try again later." },
});
const loginLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many login attempts. Try again later." },
});

router.post("/register", registrationLimit, validateBody(registrationSchema), async (req, res) => {
  // one canonical form prevents duplicate accounts caused by email casing
  const email = req.body.email.toLowerCase();
  if (await store.findUserByEmail(email)) {
    return res
      .status(409)
      .json({ error: "An account already exists for that email" });
  }

  const user = {
    id: randomUUID(),
    name: req.body.name,
    email,
    // store only a salted hash, never the submitted password
    passwordHash: await bcrypt.hash(req.body.password, 12),
    role: "user",
  };
  if (!(await store.createUser(user))) {
    return res
      .status(409)
      .json({ error: "An account already exists for that email" });
  }
  return res.status(201).json({ user: publicUser(user) });
});

router.post("/login", loginLimit, validateBody(credentialsSchema), async (req, res) => {
  const user = await store.findUserByEmail(req.body.email.toLowerCase());
  if (!user || !(await bcrypt.compare(req.body.password, user.passwordHash))) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = jwt.sign({ role: user.role }, jwtSecret, {
    // use the id as the subject so middleware can reload the current account
    subject: user.id,
    expiresIn: "2h",
  });
  return res.json({ token, user: publicUser(user) });
});

router.get("/me", authenticate, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

module.exports = router;
