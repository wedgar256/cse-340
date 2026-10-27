const baseController = {};

baseController.buildHome = async function (req, res) {
  res.render("index", { title: "Home" });
};

baseController.buildOrganizations = async function (req, res) {
  res.render("organizations", { title: "Organizations" });
};

baseController.buildProjects = async function (req, res) {
  res.render("projects", { title: "Projects" });
};

baseController.buildCategories = async function (req, res) {
  res.render("categories", { title: "Categories" });
};

module.exports = baseController;
