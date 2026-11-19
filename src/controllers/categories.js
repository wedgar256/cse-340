import {
  getAllCategories,
  getCategoriesByServiceProjectId,
  updateCategoryAssignments,
} from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';

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

export { showCategoriesPage, showAssignCategoriesForm, processAssignCategoriesForm };
