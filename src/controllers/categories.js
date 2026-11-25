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

  try {
    await updateCategoryAssignments(projectId, categoryIds);
    req.flash('success', 'Categories updated successfully.');
    return res.redirect(`/project/${projectId}`);
  } catch (error) {
    console.error('Update project categories failed:', error);
    req.flash('error', 'There was an error updating project categories. Please try again.');
    return res.redirect(`/assign-categories/${projectId}`);
  }
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
  res.render('new-category', { title, formData: {}, errors: [] });
};

const processNewCategoryForm = async (req, res) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return res.status(400).render('new-category', {
      title: 'Add New Category',
      formData: req.body,
      errors: validationErrors.array(),
    });
  }

  const { name } = req.body;
  try {
    await createCategory(name);
    req.flash('success', 'Category created successfully!');
    return res.redirect('/categories');
  } catch (error) {
    console.error('Create category failed:', error);
    req.flash('error', 'There was an error creating the category. Please try again.');
    return res.redirect('/new-category');
  }
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
  res.render('edit-category', { title, categoryDetails, formData: {}, errors: [] });
};

const processEditCategoryForm = async (req, res) => {
  const categoryId = parseCategoryId(req.params.id);
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const categoryDetails = await getCategoryById(categoryId);
    if (!categoryDetails) {
      const err = new Error('Category Not Found');
      err.status = 404;
      throw err;
    }
    return res.status(400).render('edit-category', {
      title: 'Edit Category',
      categoryDetails,
      formData: req.body,
      errors: validationErrors.array(),
    });
  }

  const { name } = req.body;
  try {
    const updatedCategoryId = await updateCategory(categoryId, name);
    if (!updatedCategoryId) {
      const err = new Error('Category Not Found');
      err.status = 404;
      throw err;
    }

    req.flash('success', 'Category updated successfully!');
    return res.redirect('/categories');
  } catch (error) {
    if (error.status === 404) throw error;
    console.error('Update category failed:', error);
    req.flash('error', 'There was an error updating the category. Please try again.');
    return res.redirect(`/edit-category/${categoryId}`);
  }
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
