const { getOrganizations } = require("../models/organizationsModel");
const { getProjects } = require("../models/projectsModel");
const { getCategories } = require("../models/categoriesModel");

const baseController = {};

baseController.buildHome = async function (req, res) {
  res.render("index", {
    title: "Home",
    heroImage: "/images/hero-image.svg"
  });
};

baseController.buildOrganizations = async function (req, res) {
  try {
    const organizations = await getOrganizations();
    res.render("organizations", {
      title: "Organizations",
      organizations
    });
  } catch (error) {
    console.error("Failed to load organizations:", error);
    res.status(500).send("Unable to load organizations.");
  }
};

baseController.buildProjects = async function (req, res) {
  try {
    const projects = await getProjects();
    res.render("projects", {
      title: "Projects",
      projects
    });
  } catch (error) {
    console.error("Failed to load projects:", error);
    res.status(500).send("Unable to load projects.");
  }
};

baseController.buildCategories = async function (req, res) {
  try {
    const categories = await getCategories();
    res.render("categories", {
      title: "Categories",
      categories
    });
  } catch (error) {
    console.error("Failed to load categories:", error);
    res.status(500).send("Unable to load categories.");
  }
};

module.exports = baseController;
