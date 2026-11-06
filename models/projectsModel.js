const pool = require("../database");

const fallbackProjects = [
  {
    project_id: 1,
    organization_id: 1,
    category_id: 1,
    name: "Project Alpha",
    description: "Inventory Management System",
  },
  {
    project_id: 2,
    organization_id: 2,
    category_id: 2,
    name: "Project Beta",
    description: "Dynamic Database Dashboard",
  },
  {
    project_id: 3,
    organization_id: 3,
    category_id: 3,
    name: "Project Gamma",
    description: "User Authentication Portal",
  },
];

const getProjects = async () => {
  try {
    const query = `
      SELECT p.project_id, p.name, p.description,
             o.organization_id, o.name AS organization_name,
             c.category_id, c.name AS category_name
      FROM projects p
      LEFT JOIN organizations o ON p.organization_id = o.organization_id
      LEFT JOIN categories c ON p.category_id = c.category_id
      ORDER BY p.project_id ASC
    `;
    const timeout = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Database timeout")), 800);
    });

    const result = await Promise.race([pool.query(query), timeout]);

    if (result.rows && result.rows.length > 0) {
      return result.rows;
    }

    return fallbackProjects;
  } catch (error) {
    console.error("Error fetching projects:", error.message);
    return fallbackProjects;
  }
};

module.exports = {
  getProjects,
};
