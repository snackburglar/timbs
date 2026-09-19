const bcrypt = require("bcryptjs");

const products = require("./data/products");
const news = require("./data/news");

// These arrays are the temporary in-memory repository layer for local development.
const users = [
  {
    id: "admin-user",
    name: "Timbertop Admin",
    email: process.env.ADMIN_EMAIL || "admin@timbertop.com",
    passwordHash: bcrypt.hashSync(
      process.env.ADMIN_PASSWORD || "Admin123!",
      10,
    ),
    role: "admin",
  },
];

module.exports = {
  users,
  products,
  news,
  subscriptions: [],
  contactMessages: [],
};
