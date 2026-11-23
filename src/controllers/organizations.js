import {
  createOrganization,
  getAllOrganizations,
  getOrganizationDetails,
  updateOrganization,
} from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';
import { body, validationResult } from 'express-validator';

const organizationValidation = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage('Organization name must be between 3 and 150 characters.')
    .escape(),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Organization description is required.')
    .bail()
    .isLength({ max: 500 })
    .withMessage('Organization description cannot exceed 500 characters.')
    .escape(),
  body('contactEmail')
    .trim()
    .isLength({ max: 255 })
    .withMessage('Contact email cannot exceed 255 characters.')
    .bail()
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(),
];

const showOrganizationsPage = async (req, res) => {
  const organizations = await getAllOrganizations();
  const title = 'Our Partner Organizations';
  res.render('organizations', { title, organizations });
};

const showOrganizationDetailsPage = async (req, res) => {
  if (!/^\d+$/.test(req.params.id)) {
    const err = new Error('Invalid organization ID');
    err.status = 404;
    throw err;
  }

  const organizationId = Number(req.params.id);
  if (!Number.isSafeInteger(organizationId) || organizationId < 1) {
    const err = new Error('Invalid organization ID');
    err.status = 404;
    throw err;
  }

  const organizationDetails = await getOrganizationDetails(organizationId);
  if (!organizationDetails) {
    const err = new Error('Organization Not Found');
    err.status = 404;
    throw err;
  }

  const projects = await getProjectsByOrganizationId(organizationId);
  const title = 'Organization Details';
  res.render('organization', { title, organizationDetails, projects });
};

const showNewOrganizationForm = async (req, res) => {
  const title = 'Add New Organization';
  res.render('new-organization', { title });
};

const processNewOrganizationForm = async (req, res) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    validationErrors.array().forEach((error) => {
      req.flash('error', error.msg);
    });
    return res.redirect('/new-organization');
  }

  const { name, description, contactEmail } = req.body;
  const logoFilename = 'placeholder-logo.png';

  const organizationId = await createOrganization(name, description, contactEmail, logoFilename);
  req.flash('success', 'Organization created successfully!');
  res.redirect(`/organization/${organizationId}`);
};

const showEditOrganizationForm = async (req, res) => {
  const organizationId = Number(req.params.id);
  if (!Number.isSafeInteger(organizationId) || organizationId < 1) {
    const err = new Error('Organization Not Found');
    err.status = 404;
    throw err;
  }

  const organizationDetails = await getOrganizationDetails(organizationId);
  if (!organizationDetails) {
    const err = new Error('Organization Not Found');
    err.status = 404;
    throw err;
  }

  const title = 'Edit Organization';
  res.render('edit-organization', { title, organizationDetails });
};

const processEditOrganizationForm = async (req, res) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    validationErrors.array().forEach((error) => {
      req.flash('error', error.msg);
    });
    return res.redirect(`/edit-organization/${req.params.id}`);
  }

  const organizationId = Number(req.params.id);
  if (!Number.isSafeInteger(organizationId) || organizationId < 1) {
    const err = new Error('Organization Not Found');
    err.status = 404;
    throw err;
  }

  const { name, description, contactEmail } = req.body;
  const updatedOrganizationId = await updateOrganization(
    organizationId,
    name,
    description,
    contactEmail,
  );
  if (!updatedOrganizationId) {
    const err = new Error('Organization Not Found');
    err.status = 404;
    throw err;
  }

  req.flash('success', 'Organization updated successfully!');
  res.redirect(`/organization/${organizationId}`);
};

export {
  showOrganizationsPage,
  showOrganizationDetailsPage,
  showNewOrganizationForm,
  processNewOrganizationForm,
  showEditOrganizationForm,
  processEditOrganizationForm,
  organizationValidation,
};
