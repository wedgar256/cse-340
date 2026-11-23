import {
  getAllCategories,
  getCategoriesByServiceProjectId,
  getCategoryById,
  createCategory,
  updateCategory,
  updateCategoryAssignments,
} from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';
import { body, validationResult } from 'express-validator';

const categoryValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required.')
    .bail()
    .isLength({ min: 3, max: 100 })
    .withMessage('Category name must be between 3 and 100 characters.'),
];

const showCategoriesPage = async (req, res) => {
  const categories = await getAllCategories();
  const title = 'Service Categories';
  res.render('categories', { title, categories });
};

const parseProjectId = (value) => {
  if (!/^\d+$/.test(value)) {
    const err = new Error('Project Not Found');
    err.status = 404;
    throw err;
  }

  const projectId = Number(value);
  if (!Number.isSafeInteger(projectId) || projectId < 1) {
    const err = new Error('Project Not Found');
    err.status = 404;
    throw err;
  }

  return projectId;
};

const showAssignCategoriesForm = async (req, res) => {
  const projectId = parseProjectId(req.params.projectId);
  const projectDetails = await getProjectDetails(projectId);
  if (!projectDetails) {
    const err = new Error('Project Not Found');
    err.status = 404;
    throw err;
  }

  const categories = await getAllCategories();
  const assignedCategories = await getCategoriesByServiceProjectId(projectId);
  const title = 'Assign Categories to Project';
  res.render('assign-categories', {
    title,
    projectId,
    projectDetails,
    categories,
    assignedCategories,
  });
};

const processAssignCategoriesForm = async (req, res) => {
  const projectId = parseProjectId(req.params.projectId);
  const projectDetails = await getProjectDetails(projectId);
  if (!projectDetails) {
    const err = new Error('Project Not Found');
    err.status = 404;
    throw err;
  }

  const selectedCategoryIds = req.body.categoryIds || [];
  const submittedIds = Array.isArray(selectedCategoryIds)
    ? selectedCategoryIds
    : [selectedCategoryIds];
  if (submittedIds.some((id) => !/^\d+$/.test(id))) {
    const err = new Error('Invalid category selection');
    err.status = 404;
    throw err;
  }

  const categoryIds = [...new Set(submittedIds.map(Number))];
  if (categoryIds.some((id) => !Number.isSafeInteger(id) || id < 1)) {
    const err = new Error('Invalid category selection');
    err.status = 404;
    throw err;
  }

  await updateCategoryAssignments(projectId, categoryIds);
  req.flash('success', 'Categories updated successfully.');
  res.redirect(`/project/${projectId}`);
};

const parseCategoryId = (value) => {
  if (!/^\d+$/.test(value)) {
    const err = new Error('Category Not Found');
    err.status = 404;
    throw err;
  }

  const categoryId = Number(value);
  if (!Number.isSafeInteger(categoryId) || categoryId < 1) {
    const err = new Error('Category Not Found');
    err.status = 404;
    throw err;
  }

  return categoryId;
};

const showNewCategoryForm = async (req, res) => {
  const title = 'Add New Category';
  res.render('new-category', { title });
};

const processNewCategoryForm = async (req, res) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    validationErrors.array().forEach((error) => {
      req.flash('error', error.msg);
    });
    return res.redirect('/new-category');
  }

  const { name } = req.body;
  await createCategory(name);
  req.flash('success', 'Category created successfully!');
  res.redirect('/categories');
};

const showEditCategoryForm = async (req, res) => {
  const categoryId = parseCategoryId(req.params.id);
  const categoryDetails = await getCategoryById(categoryId);
  if (!categoryDetails) {
    const err = new Error('Category Not Found');
    err.status = 404;
    throw err;
  }

  const title = 'Edit Category';
  res.render('edit-category', { title, categoryDetails });
};

const processEditCategoryForm = async (req, res) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    validationErrors.array().forEach((error) => {
      req.flash('error', error.msg);
    });
    return res.redirect(`/edit-category/${req.params.id}`);
  }

  const categoryId = parseCategoryId(req.params.id);
  const { name } = req.body;
  const updatedCategoryId = await updateCategory(categoryId, name);
  if (!updatedCategoryId) {
    const err = new Error('Category Not Found');
    err.status = 404;
    throw err;
  }

  req.flash('success', 'Category updated successfully!');
  res.redirect('/categories');
};

export {
  showCategoriesPage,
  showNewCategoryForm,
  processNewCategoryForm,
  showEditCategoryForm,
  processEditCategoryForm,
  showAssignCategoriesForm,
  processAssignCategoriesForm,
  categoryValidation,
};
