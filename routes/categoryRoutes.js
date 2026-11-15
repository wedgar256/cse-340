const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const categoryController = require("../controllers/categoryController");

const categoryRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ max: 100 })
    .withMessage("Name must be 100 characters or fewer."),
];

router.get("/categories/create", categoryController.buildCreateCategory);
router.post("/categories", categoryRules, categoryController.createCategory);
router.get("/categories/:id/edit", categoryController.buildEditCategory);
router.post("/categories/:id/edit", categoryRules, categoryController.updateCategory);

module.exports = router;
