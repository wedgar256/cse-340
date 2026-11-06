const express = require("express");
const app = express();
require("dotenv").config();
const baseRoute = require("./routes/baseRoute");

// Set View Engine to EJS
app.set("view engine", "ejs");

// STATIC MIDDLEWARE (Serves CSS and images from public folder)
app.use(express.static("public"));

// Routes for Home, Organizations, Projects, and Categories
app.use("/", baseRoute);

// Server Port Configuration
const port = process.env.PORT || 3000;
const host = process.env.HOST || "0.0.0.0";

app.listen(port, host, () => {
  console.log(`App listening on http://${host}:${port}`);
});
