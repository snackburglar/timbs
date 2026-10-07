const jwt = require("jsonwebtoken");

const { jwtSecret } = require("../config");
const { users } = require("../store");

function authenticate(req, res, next) {
  const authorization = req.get("authorization");
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : null;
  if (!token) return res.status(401).json({ error: "Authentication required" });

  try {
    const payload = jwt.verify(token, jwtSecret);
    // look up the current record so role changes apply without reissuing tokens.
    const user = users.find((candidate) => candidate.id === payload.sub);
    if (!user)
      return res.status(401).json({ error: "Authentication required" });
    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

function requireAdmin(req, res, next) {
  // authenticate must run first so req.user is available here.
  if (req.user.role !== "admin")
    return res.status(403).json({ error: "Administrator access required" });
  return next();
}

module.exports = { authenticate, requireAdmin };
