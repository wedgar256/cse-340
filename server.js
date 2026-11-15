const express = require("express");
const app = express();
require("dotenv").config();
const session = require("express-session");
const flash = require("connect-flash");
const organizationRoutes = require("./routes/organizationRoutes");
const projectRoutes = require("./routes/projectRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const baseRoute = require("./routes/baseRoute");

// Set View Engine to EJS
app.set("view engine", "ejs");

// STATIC MIDDLEWARE (Serves CSS and images from public folder)
app.use(express.static("public"));

// Parse form submissions (create/edit POST requests)
app.use(express.urlencoded({ extended: false }));

// SESSION AND FLASH MIDDLEWARE (Success/error alerts)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "cse340-portal-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 30 },
  })
);
app.use(flash());

app.use((req, res, next) => {
  res.locals.successMessages = req.flash("success");
  res.locals.errorMessages = req.flash("error");
  next();
});

// Create/edit/assign routes are registered before the base routes so
// paths like /organizations/create are not captured by /organizations/:id
app.use("/", organizationRoutes);
app.use("/", projectRoutes);
app.use("/", categoryRoutes);

// Routes for Home, Organizations, Projects, and Categories
app.use("/", baseRoute);

// Server Port Configuration
const port = process.env.PORT || 3000;
const host = process.env.HOST || "0.0.0.0";

app.listen(port, host, () => {
  console.log(`App listening on http://${host}:${port}`);
});
