const express = require("express");
const router = express.Router();
const baseController = require("../controllers/baseController");
const detailController = require("../controllers/detailController");

router.get("/", baseController.buildHome);
router.get("/organizations", baseController.buildOrganizations);
router.get("/organizations/:id", detailController.buildOrganizationDetail);
router.get("/projects", baseController.buildProjects);
router.get("/projects/:id", detailController.buildProjectDetail);
router.get("/categories", baseController.buildCategories);
router.get("/categories/:id", detailController.buildCategoryDetail);

module.exports = router;
