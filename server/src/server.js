const express = require("express");

const app = express();
app.use(express.json());

require("dotenv").config();

app.get("/", (req, res) => {
  res.send("Timbertop United API");
});

const port = process.env.PORT || 1738;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
