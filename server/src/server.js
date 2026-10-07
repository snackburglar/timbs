const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");

const { clientOrigin, port } = require("./config");
const communicationRoutes = require("./routes/communication");
const newsRoutes = require("./routes/news");
const productRoutes = require("./routes/products");
const systemRoutes = require("./routes/system");
const userRoutes = require("./routes/users");

const app = express();

app.use(helmet());
app.use(cors({ origin: clientOrigin }));
app.use(morgan("dev"));
app.use(express.json({ limit: "100kb" }));

app.use(systemRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/news", newsRoutes);
app.use("/api", communicationRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "API route not found" });
});

// express identifies error middleware by its four-argument signature.
app.use((error, req, res, next) => {
  if (
    error instanceof SyntaxError &&
    error.status === 400 &&
    error.type === "entity.parse.failed"
  ) {
    return res.status(400).json({ error: "Invalid JSON body" });
  }
  console.error(error.message);
  return res.status(500).json({ error: "An unexpected server error occurred" });
});

// importing the app for tests should not bind a listening port.
if (require.main === module) {
  app.listen(port, () =>
    console.log(`Server is running at http://localhost:${port}`),
  );
}

module.exports = app;
