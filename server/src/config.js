const dotenv = require("dotenv");

dotenv.config();

const jwtSecret =
  process.env.JWT_SECRET || "local-development-secret-change-me";

if (!process.env.JWT_SECRET) {
  console.warn(
    "JWT_SECRET is not configured; using the local development fallback.",
  );
}

module.exports = {
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  jwtSecret,
  port: process.env.PORT || 1337,
};
