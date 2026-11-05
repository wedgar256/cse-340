const baseController = {};

const organizations = [
  {
    name: "Tech Innovators",
    logo: "/images/org1.svg",
    description: "Technology strategy and product development."
  },
  {
    name: "Community Builders",
    logo: "/images/org2.svg",
    description: "Engaging local partnerships and outreach initiatives."
  },
  {
    name: "Green Energy Corp",
    logo: "/images/org3.svg",
    description: "Sustainable energy planning and environmental impact."
  }
];

const projects = [
  { name: "Project Alpha", description: "Inventory Management System" },
  { name: "Project Beta", description: "Dynamic Database Dashboard" },
  { name: "Project Gamma", description: "User Authentication Portal" }
];

const categories = [
  { name: "Software Development" },
  { name: "Database Administration" },
  { name: "UI/UX Design" },
  { name: "System Architecture" }
];

baseController.buildHome = async function (req, res) {
  res.render("index", {
    title: "Home",
    heroImage: "/images/hero-image.svg"
  });
};

baseController.buildOrganizations = async function (req, res) {
  res.render("organizations", {
    title: "Organizations",
    organizations
  });
};

baseController.buildProjects = async function (req, res) {
  res.render("projects", {
    title: "Projects",
    projects
  });
};

baseController.buildCategories = async function (req, res) {
  res.render("categories", {
    title: "Categories",
    categories
  });
};

module.exports = baseController;
