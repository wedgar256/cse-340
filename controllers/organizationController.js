const { validationResult } = require("express-validator");
const {
  getOrganizations,
  getOrganizationById,
  addOrganization,
  updateOrganization,
} = require("../models/organizationsModel");

const organizationController = {};

const collectErrors = (req) =>
  validationResult(req).array().map((error) => ({
    field: error.path,
    message: error.msg,
  }));

const parseEntityId = (value) => {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
};

organizationController.buildCreateOrganization = async function (req, res) {
  res.render("organization-form", {
    title: "Create Organization",
    action: "/organizations",
    organization: {
      name: "",
      description: "",
      logo_url: "",
    },
    errors: [],
  });
};

organizationController.createOrganization = async function (req, res) {
  const errors = collectErrors(req);
  const organization = {
    name: req.body.name || "",
    description: req.body.description || "",
    logo_url: req.body.logo_url || "",
  };

  if (errors.length > 0) {
    return res.status(422).render("organization-form", {
      title: "Create Organization",
      action: "/organizations",
      organization,
      errors,
    });
  }

  try {
    await addOrganization(
      organization.name.trim(),
      organization.description.trim(),
      organization.logo_url.trim() || null
    );
    req.flash("success", "Organization created successfully.");
    return res.redirect("/organizations");
  } catch (error) {
    console.error("Failed to create organization:", error);
    req.flash("error", "Unable to create organization. Please try again.");
    return res.redirect("/organizations/create");
  }
};

organizationController.buildEditOrganization = async function (req, res) {
  const id = parseEntityId(req.params.id);
  if (id === null) {
    return res.status(400).send("Invalid ID.");
  }

  try {
    const organization = await getOrganizationById(id);
    if (!organization) {
      return res.status(404).send("Organization not found.");
    }
    return res.render("organization-form", {
      title: `Edit ${organization.name}`,
      action: `/organizations/${organization.organization_id}/edit`,
      organization,
      errors: [],
    });
  } catch (error) {
    console.error("Failed to load organization for edit:", error);
    return res.status(500).send("Unable to load organization.");
  }
};

organizationController.updateOrganization = async function (req, res) {
  const id = parseEntityId(req.params.id);
  if (id === null) {
    return res.status(400).send("Invalid ID.");
  }

  const errors = collectErrors(req);
  const organization = {
    organization_id: id,
    name: req.body.name || "",
    description: req.body.description || "",
    logo_url: req.body.logo_url || "",
  };

  if (errors.length > 0) {
    return res.status(422).render("organization-form", {
      title: "Edit Organization",
      action: `/organizations/${id}/edit`,
      organization,
      errors,
    });
  }

  try {
    const updated = await updateOrganization(
      id,
      organization.name.trim(),
      organization.description.trim(),
      organization.logo_url.trim() || null
    );
    if (!updated) {
      return res.status(404).send("Organization not found.");
    }
    req.flash("success", "Organization updated successfully.");
    return res.redirect(`/organizations/${id}`);
  } catch (error) {
    console.error("Failed to update organization:", error);
    req.flash("error", "Unable to update organization. Please try again.");
    return res.redirect(`/organizations/${id}/edit`);
  }
};

module.exports = organizationController;
