const bcrypt = require("bcryptjs");
const express = require("express");
const jwt = require("jsonwebtoken");

const { jwtSecret } = require("../config");
const { authenticate } = require("../middleware/auth");
const validateBody = require("../middleware/validateBody");
const { users } = require("../store");
const {
  credentialsSchema,
  registrationSchema,
} = require("../validation/schemas");
const { makeId, publicUser } = require("../utils");

const router = express.Router();

router.post("/register", validateBody(registrationSchema), async (req, res) => {
  const email = req.body.email.toLowerCase();
  if (users.some((user) => user.email === email)) {
    return res
      .status(409)
      .json({ error: "An account already exists for that email" });
  }

  const user = {
    id: makeId(email),
    name: req.body.name,
    email,
    passwordHash: await bcrypt.hash(req.body.password, 10),
    role: "user",
  };
  users.push(user);
  return res.status(201).json({ user: publicUser(user) });
});

router.post("/login", validateBody(credentialsSchema), async (req, res) => {
  const user = users.find(
    (candidate) => candidate.email === req.body.email.toLowerCase(),
  );
  if (!user || !(await bcrypt.compare(req.body.password, user.passwordHash))) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = jwt.sign({ role: user.role }, jwtSecret, {
    subject: user.id,
    expiresIn: "2h",
  });
  return res.json({ token, user: publicUser(user) });
});

router.get("/me", authenticate, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

module.exports = router;
