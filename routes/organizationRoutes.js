const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const organizationController = require("../controllers/organizationController");

const organizationRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ max: 100 })
    .withMessage("Name must be 100 characters or fewer."),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required."),
  body("logo_url")
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^(https?:\/\/|\/)/)
    .withMessage("Logo URL must be a valid URL or a path starting with /."),
];

router.get("/organizations/create", organizationController.buildCreateOrganization);
router.post("/organizations", organizationRules, organizationController.createOrganization);
router.get("/organizations/:id/edit", organizationController.buildEditOrganization);
router.post("/organizations/:id/edit", organizationRules, organizationController.updateOrganization);

module.exports = router;
