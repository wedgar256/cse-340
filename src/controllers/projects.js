import { body, validationResult } from 'express-validator';
import { getAllOrganizations } from '../models/organizations.js';
import { getAllCategories, getCategoriesByServiceProjectId } from '../models/categories.js';
import {
  createProject,
  getAllProjects,
  getProjectDetails,
  updateProject,
} from '../models/projects.js';

const projectValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage('Project title must be between 3 and 150 characters.'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Project description is required.')
    .bail()
    .isLength({ max: 999 })
    .withMessage('Project description must be fewer than 1000 characters.'),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Project location is required.')
    .bail()
    .isLength({ max: 150 })
    .withMessage('Project location must be 150 characters or fewer.'),
  body('date')
    .trim()
    .isISO8601({ strict: true, strictSeparator: true })
    .withMessage('Please provide a valid project date.'),
  body('organizationId')
    .isInt({ min: 1 })
    .withMessage('Please select a valid organization.')
    .toInt(),
];

const showProjectsPage = async (req, res) => {
  const projects = await getAllProjects();
  const title = 'Service Projects';
  res.render('projects', { title, projects });
};

const showProjectDetailsPage = async (req, res) => {
  const projectId = Number(req.params.projectId);
  if (!Number.isSafeInteger(projectId) || projectId < 1) {
    const err = new Error('Project Not Found');
    err.status = 404;
    throw err;
  }

  const projectDetails = await getProjectDetails(projectId);
  if (!projectDetails) {
    const err = new Error('Project Not Found');
    err.status = 404;
    throw err;
  }

  const categories = await getCategoriesByServiceProjectId(projectId);
  const title = 'Project Details';
  res.render('project', { title, projectDetails, categories });
};

const showNewProjectForm = async (req, res) => {
  const organizations = await getAllOrganizations();
  const title = 'Add New Service Project';
  res.render('new-project', { title, organizations, formData: {}, errors: [] });
};

const processNewProjectForm = async (req, res) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const organizations = await getAllOrganizations();
    return res.status(400).render('new-project', {
      title: 'Add New Service Project',
      organizations,
      formData: req.body,
      errors: validationErrors.array(),
    });
  }

  const { title, description, location, date, organizationId } = req.body;
  try {
    const projectId = await createProject(title, description, location, date, organizationId);
    req.flash('success', 'New service project created successfully!');
    return res.redirect(`/project/${projectId}`);
  } catch (error) {
    console.error('Create service project failed:', error);
    req.flash('error', 'There was an error creating the service project. Please try again.');
    return res.redirect('/new-project');
  }
};

const formatDateInput = (value) => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  return String(value || '').slice(0, 10);
};

const showEditProjectForm = async (req, res) => {
  const projectId = Number(req.params.projectId);
  if (!Number.isSafeInteger(projectId) || projectId < 1) {
    const err = new Error('Project Not Found');
    err.status = 404;
    throw err;
  }

  const projectDetails = await getProjectDetails(projectId);
  if (!projectDetails) {
    const err = new Error('Project Not Found');
    err.status = 404;
    throw err;
  }

  const organizations = await getAllOrganizations();
  const projectDate = formatDateInput(projectDetails.date);
  const title = 'Edit Service Project';
  res.render('edit-project', {
    title, projectDetails, organizations, projectDate, formData: {}, errors: [],
  });
};

const processEditProjectForm = async (req, res) => {
  const projectId = Number(req.params.projectId);
  if (!Number.isSafeInteger(projectId) || projectId < 1) {
    const err = new Error('Project Not Found');
    err.status = 404;
    throw err;
  }

  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const [projectDetails, organizations] = await Promise.all([
      getProjectDetails(projectId),
      getAllOrganizations(),
    ]);
    if (!projectDetails) {
      const err = new Error('Project Not Found');
      err.status = 404;
      throw err;
    }
    return res.status(400).render('edit-project', {
      title: 'Edit Service Project',
      projectDetails,
      organizations,
      projectDate: formatDateInput(projectDetails.date),
      formData: req.body,
      errors: validationErrors.array(),
    });
  }

  const { title, description, location, date, organizationId } = req.body;
  try {
    const updatedProjectId = await updateProject(
      projectId,
      title,
      description,
      location,
      date,
      organizationId,
    );
    if (!updatedProjectId) {
      const err = new Error('Project Not Found');
      err.status = 404;
      throw err;
    }

    req.flash('success', 'Service project updated successfully!');
    return res.redirect(`/project/${projectId}`);
  } catch (error) {
    if (error.status === 404) throw error;
    console.error('Update service project failed:', error);
    req.flash('error', 'There was an error updating the service project. Please try again.');
    return res.redirect(`/edit-project/${projectId}`);
  }
};

export {
  showProjectsPage,
  showProjectDetailsPage,
  showNewProjectForm,
  processNewProjectForm,
  showEditProjectForm,
  processEditProjectForm,
  projectValidation,
};
