import { body, validationResult } from 'express-validator';
import { getAllOrganizations } from '../models/organizations.js';
import { getAllCategories, getCategoriesByServiceProjectId } from '../models/categories.js';
import {
  createProject,
  getAllProjects,
  getProjectDetails,
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
  res.render('new-project', { title, organizations });
};

const processNewProjectForm = async (req, res) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    validationErrors.array().forEach((error) => {
      req.flash('error', error.msg);
    });
    return res.redirect('/new-project');
  }

  const { title, description, location, date, organizationId } = req.body;
  const projectId = await createProject(title, description, location, date, organizationId);
  req.flash('success', 'New service project created successfully!');
  res.redirect(`/project/${projectId}`);
};

export {
  showProjectsPage,
  showProjectDetailsPage,
  showNewProjectForm,
  processNewProjectForm,
  projectValidation,
};
