const { validationResult } = require("express-validator");
const { getOrganizations } = require("../models/organizationsModel");
const { getCategories } = require("../models/categoriesModel");
const {
  getProjectById,
  getProjectCategoryIds,
  addProject,
  updateProject,
  updateProjectCategories,
} = require("../models/projectsModel");

const projectController = {};

const collectErrors = (req) =>
  validationResult(req).array().map((error) => ({
    field: error.path,
    message: error.msg,
  }));

const parseEntityId = (value) => {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
};

projectController.buildCreateProject = async function (req, res) {
  try {
    const organizations = await getOrganizations();
    return res.render("project-form", {
      title: "Create Project",
      action: "/projects",
      project: {
        organization_id: "",
        name: "",
        description: "",
      },
      organizations,
      errors: [],
    });
  } catch (error) {
    console.error("Failed to load create project form:", error);
    return res.status(500).send("Unable to load create project form.");
  }
};

projectController.createProject = async function (req, res) {
  const errors = collectErrors(req);
  const project = {
    organization_id: req.body.organization_id || "",
    name: req.body.name || "",
    description: req.body.description || "",
  };

  try {
    const organizations = await getOrganizations();

    if (errors.length > 0) {
      return res.status(422).render("project-form", {
        title: "Create Project",
        action: "/projects",
        project,
        organizations,
        errors,
      });
    }

    await addProject(
      Number(project.organization_id),
      project.name.trim(),
      project.description.trim()
    );
    req.flash("success", "Project created successfully.");
    return res.redirect("/projects");
  } catch (error) {
    console.error("Failed to create project:", error);
    req.flash("error", "Unable to create project. Please try again.");
    return res.redirect("/projects/create");
  }
};

projectController.buildEditProject = async function (req, res) {
  const id = parseEntityId(req.params.id);
  if (id === null) {
    return res.status(400).send("Invalid ID.");
  }

  try {
    const project = await getProjectById(id);
    if (!project) {
      return res.status(404).send("Project not found.");
    }
    const organizations = await getOrganizations();
    return res.render("project-form", {
      title: `Edit ${project.name}`,
      action: `/projects/${project.project_id}/edit`,
      project,
      organizations,
      errors: [],
    });
  } catch (error) {
    console.error("Failed to load project for edit:", error);
    return res.status(500).send("Unable to load project.");
  }
};

projectController.updateProject = async function (req, res) {
  const id = parseEntityId(req.params.id);
  if (id === null) {
    return res.status(400).send("Invalid ID.");
  }

  const errors = collectErrors(req);
  const project = {
    project_id: id,
    organization_id: req.body.organization_id || "",
    name: req.body.name || "",
    description: req.body.description || "",
  };

  try {
    const organizations = await getOrganizations();

    if (errors.length > 0) {
      return res.status(422).render("project-form", {
        title: "Edit Project",
        action: `/projects/${id}/edit`,
        project,
        organizations,
        errors,
      });
    }

    const updated = await updateProject(
      id,
      Number(project.organization_id),
      project.name.trim(),
      project.description.trim()
    );
    if (!updated) {
      return res.status(404).send("Project not found.");
    }
    req.flash("success", "Project updated successfully.");
    return res.redirect(`/projects/${id}`);
  } catch (error) {
    console.error("Failed to update project:", error);
    req.flash("error", "Unable to update project. Please try again.");
    return res.redirect(`/projects/${id}/edit`);
  }
};

projectController.buildAssignCategories = async function (req, res) {
  const id = parseEntityId(req.params.id);
  if (id === null) {
    return res.status(400).send("Invalid ID.");
  }

  try {
    const project = await getProjectById(id);
    if (!project) {
      return res.status(404).send("Project not found.");
    }
    const categories = await getCategories();
    const assignedCategoryIds = await getProjectCategoryIds(id);
    return res.render("assign-categories", {
      title: `Assign Categories - ${project.name}`,
      project,
      categories,
      assignedCategoryIds,
      errors: [],
    });
  } catch (error) {
    console.error("Failed to load assign categories form:", error);
    return res.status(500).send("Unable to load assign categories form.");
  }
};

projectController.assignCategories = async function (req, res) {
  const id = parseEntityId(req.params.id);
  if (id === null) {
    return res.status(400).send("Invalid ID.");
  }

  const errors = collectErrors(req);
  const categoryIds = Array.isArray(req.body.category_ids)
    ? req.body.category_ids.map(Number)
    : [];

  try {
    const project = await getProjectById(id);
    if (!project) {
      return res.status(404).send("Project not found.");
    }
    const categories = await getCategories();

    if (errors.length > 0) {
      return res.status(422).render("assign-categories", {
        title: `Assign Categories - ${project.name}`,
        project,
        categories,
        assignedCategoryIds: categoryIds,
        errors,
      });
    }

    await updateProjectCategories(id, categoryIds);
    req.flash("success", "Project categories updated successfully.");
    return res.redirect(`/projects/${id}`);
  } catch (error) {
    console.error("Failed to assign categories:", error);
    req.flash("error", "Unable to update project categories. Please try again.");
    return res.redirect(`/projects/${id}/assign-categories`);
  }
};

module.exports = projectController;
