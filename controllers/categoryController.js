const { validationResult } = require("express-validator");
const {
  getCategories,
  getCategoryById,
  addCategory,
  updateCategory,
} = require("../models/categoriesModel");

const categoryController = {};

const collectErrors = (req) =>
  validationResult(req).array().map((error) => ({
    field: error.path,
    message: error.msg,
  }));

const parseEntityId = (value) => {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
};

const isUniqueViolation = (error) => error && error.code === "23505";

categoryController.buildCreateCategory = async function (req, res) {
  res.render("category-form", {
    title: "Create Category",
    action: "/categories",
    category: {
      name: "",
    },
    errors: [],
  });
};

categoryController.createCategory = async function (req, res) {
  const errors = collectErrors(req);
  const category = {
    name: req.body.name || "",
  };

  if (errors.length > 0) {
    return res.status(422).render("category-form", {
      title: "Create Category",
      action: "/categories",
      category,
      errors,
    });
  }

  try {
    await addCategory(category.name.trim());
    req.flash("success", "Category created successfully.");
    return res.redirect("/categories");
  } catch (error) {
    console.error("Failed to create category:", error);
    if (isUniqueViolation(error)) {
      req.flash("error", "A category with that name already exists.");
      return res.redirect("/categories/create");
    }
    req.flash("error", "Unable to create category. Please try again.");
    return res.redirect("/categories/create");
  }
};

categoryController.buildEditCategory = async function (req, res) {
  const id = parseEntityId(req.params.id);
  if (id === null) {
    return res.status(400).send("Invalid ID.");
  }

  try {
    const category = await getCategoryById(id);
    if (!category) {
      return res.status(404).send("Category not found.");
    }
    return res.render("category-form", {
      title: `Edit ${category.name}`,
      action: `/categories/${category.category_id}/edit`,
      category,
      errors: [],
    });
  } catch (error) {
    console.error("Failed to load category for edit:", error);
    return res.status(500).send("Unable to load category.");
  }
};

categoryController.updateCategory = async function (req, res) {
  const id = parseEntityId(req.params.id);
  if (id === null) {
    return res.status(400).send("Invalid ID.");
  }

  const errors = collectErrors(req);
  const category = {
    category_id: id,
    name: req.body.name || "",
  };

  if (errors.length > 0) {
    return res.status(422).render("category-form", {
      title: "Edit Category",
      action: `/categories/${id}/edit`,
      category,
      errors,
    });
  }

  try {
    const updated = await updateCategory(id, category.name.trim());
    if (!updated) {
      return res.status(404).send("Category not found.");
    }
    req.flash("success", "Category updated successfully.");
    return res.redirect(`/categories/${id}`);
  } catch (error) {
    console.error("Failed to update category:", error);
    if (isUniqueViolation(error)) {
      req.flash("error", "A category with that name already exists.");
      return res.redirect(`/categories/${id}/edit`);
    }
    req.flash("error", "Unable to update category. Please try again.");
    return res.redirect(`/categories/${id}/edit`);
  }
};

module.exports = categoryController;
