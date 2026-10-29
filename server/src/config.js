const dotenv = require("dotenv");

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!jwtSecret || jwtSecret.length < 32 || /replace|change-me|secret/i.test(jwtSecret)) {
  throw new Error("Set JWT_SECRET to a private random value of at least 32 characters");
}
if (
  !adminPassword ||
  adminPassword.length < 12 ||
  adminPassword.length > 72 ||
  /replace|change-me/i.test(adminPassword)
) {
  throw new Error("Set ADMIN_PASSWORD to a private password between 12 and 72 characters");
}

module.exports = {
  apiPublicUrl: (process.env.API_PUBLIC_URL || `http://localhost:${process.env.PORT || 1337}`).replace(
    /\/+$/,
    "",
  ),
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  adminPassword,
  jwtSecret,
  port: process.env.PORT || 1337,
};
