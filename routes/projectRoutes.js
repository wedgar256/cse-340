const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const projectController = require("../controllers/projectController");

const projectRules = [
  body("organization_id")
    .trim()
    .notEmpty()
    .withMessage("Organization is required.")
    .isInt({ min: 1 })
    .withMessage("Select a valid organization."),
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ max: 150 })
    .withMessage("Name must be 150 characters or fewer."),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required."),
  body("location")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 150 })
    .withMessage("Location must be 150 characters or fewer."),
  body("date")
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("Date must be a valid date (YYYY-MM-DD)."),
];

const assignCategoryRules = [
  body("category_ids")
    .customSanitizer((value) => {
      if (value === undefined || value === null || value === "") return [];
      return Array.isArray(value) ? value : [value];
    })
    .isArray()
    .withMessage("Invalid category selection."),
  body("category_ids.*")
    .isInt({ min: 1 })
    .withMessage("Select valid categories."),
];

router.get("/projects/create", projectController.buildCreateProject);
router.post("/projects", projectRules, projectController.createProject);
router.get("/projects/:id/edit", projectController.buildEditProject);
router.post("/projects/:id/edit", projectRules, projectController.updateProject);
router.get("/projects/:id/assign-categories", projectController.buildAssignCategories);
router.post("/projects/:id/assign-categories", assignCategoryRules, projectController.assignCategories);

module.exports = router;
