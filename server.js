require("dotenv").config();
const express = require("express");
const app = express();
const baseRoutes = require("./routes/baseRoute");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use("/", baseRoutes);

app.use((req, res, next) => {
  res.status(404).render("index", { title: "Page Not Found" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
