const {
  getOrganizationById,
} = require("../models/organizationsModel");
const {
  getProjectById,
  getProjectCategories,
} = require("../models/projectsModel");
const {
  getCategoryById,
  getCategoryProjects,
} = require("../models/categoriesModel");

const detailController = {};

const parseEntityId = (value) => {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
};

const rejectInvalidId = (req, res) => {
  const id = parseEntityId(req.params.id);
  if (id === null) {
    res.status(400).send("Invalid ID.");
    return null;
  }
  return id;
};

detailController.buildOrganizationDetail = async function (req, res) {
  const id = rejectInvalidId(req, res);
  if (id === null) return;

  try {
    const organization = await getOrganizationById(id);
    if (!organization) {
      return res.status(404).send("Organization not found.");
    }
    return res.render("organization-detail", {
      title: organization.name,
      organization,
    });
  } catch (error) {
    console.error("Failed to load organization:", error);
    return res.status(500).send("Unable to load organization.");
  }
};

detailController.buildProjectDetail = async function (req, res) {
  const id = rejectInvalidId(req, res);
  if (id === null) return;

  try {
    const project = await getProjectById(id);
    if (!project) {
      return res.status(404).send("Project not found.");
    }
    const categories = await getProjectCategories(id);
    return res.render("project-detail", {
      title: project.name,
      project,
      categories,
    });
  } catch (error) {
    console.error("Failed to load project:", error);
    return res.status(500).send("Unable to load project.");
  }
};

detailController.buildCategoryDetail = async function (req, res) {
  const id = rejectInvalidId(req, res);
  if (id === null) return;

  try {
    const category = await getCategoryById(id);
    if (!category) {
      return res.status(404).send("Category not found.");
    }
    const projects = await getCategoryProjects(id);
    return res.render("category-detail", {
      title: category.name,
      category,
      projects,
    });
  } catch (error) {
    console.error("Failed to load category:", error);
    return res.status(500).send("Unable to load category.");
  }
};

module.exports = detailController;
