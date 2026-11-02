const express = require("express");
const app = express();
require("dotenv").config();
const baseController = require("./controllers/baseController");

// Set View Engine to EJS
app.set("view engine", "ejs");

// STATIC MIDDLEWARE (Serves CSS and images from public folder)
app.use(express.static("public"));

// Routes for Home, Organizations, Projects, and Categories
app.get("/", baseController.buildHome);
app.get("/organizations", baseController.buildOrganizations);
app.get("/projects", baseController.buildProjects);
app.get("/categories", baseController.buildCategories);

// Server Port Configuration
const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

app.listen(port, () => {
  console.log(`App listening on http://${host}:${port}`);
});
