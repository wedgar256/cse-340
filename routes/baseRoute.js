const express = require("express");
const router = express.Router();
const baseController = require("../controllers/baseController");

router.get("/", baseController.buildHome);
router.get("/organizations", baseController.buildOrganizations);
router.get("/projects", baseController.buildProjects);
router.get("/categories", baseController.buildCategories);

module.exports = router;
