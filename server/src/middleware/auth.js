const jwt = require("jsonwebtoken");

const { jwtSecret } = require("../config");
const store = require("../store");

async function authenticate(req, res, next) {
  const authorization = req.get("authorization");
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : null;
  if (!token) return res.status(401).json({ error: "Authentication required" });

  let payload;
  try {
    payload = jwt.verify(token, jwtSecret);
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  // look up the current record so role changes apply without reissuing tokens.
  const user = await store.get("users", payload.sub);
  if (!user) return res.status(401).json({ error: "Authentication required" });
  req.user = user;
  return next();
}

function requireAdmin(req, res, next) {
  // authenticate must run first so req.user is available here.
  if (req.user.role !== "admin")
    return res.status(403).json({ error: "Administrator access required" });
  return next();
}

module.exports = { authenticate, requireAdmin };
