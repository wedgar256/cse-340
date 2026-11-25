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
    .withMessage('Organization name must be between 3 and 150 characters.'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Organization description is required.')
    .bail()
    .isLength({ max: 500 })
    .withMessage('Organization description cannot exceed 500 characters.'),
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
  res.render('new-organization', { title, formData: {}, errors: [] });
};

const processNewOrganizationForm = async (req, res) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return res.status(400).render('new-organization', {
      title: 'Add New Organization',
      formData: req.body,
      errors: validationErrors.array(),
    });
  }

  const { name, description, contactEmail } = req.body;
  const logoFilename = 'placeholder-logo.png';

  try {
    const organizationId = await createOrganization(name, description, contactEmail, logoFilename);
    req.flash('success', 'Organization created successfully!');
    return res.redirect(`/organization/${organizationId}`);
  } catch (error) {
    console.error('Create organization failed:', error);
    req.flash('error', 'There was an error creating the organization. Please try again.');
    return res.redirect('/new-organization');
  }
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
  res.render('edit-organization', { title, organizationDetails, formData: {}, errors: [] });
};

const processEditOrganizationForm = async (req, res) => {
  const organizationId = Number(req.params.id);
  if (!Number.isSafeInteger(organizationId) || organizationId < 1) {
    const err = new Error('Organization Not Found');
    err.status = 404;
    throw err;
  }

  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const organizationDetails = await getOrganizationDetails(organizationId);
    if (!organizationDetails) {
      const err = new Error('Organization Not Found');
      err.status = 404;
      throw err;
    }
    return res.status(400).render('edit-organization', {
      title: 'Edit Organization',
      organizationDetails,
      formData: req.body,
      errors: validationErrors.array(),
    });
  }

  const { name, description, contactEmail } = req.body;
  try {
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
    return res.redirect(`/organization/${organizationId}`);
  } catch (error) {
    if (error.status === 404) throw error;
    console.error('Update organization failed:', error);
    req.flash('error', 'There was an error updating the organization. Please try again.');
    return res.redirect(`/edit-organization/${organizationId}`);
  }
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
