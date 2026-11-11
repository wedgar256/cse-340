const pool = require("../database");

const getProjects = async () => {
  const query = `
    SELECT p.project_id, p.name, p.description,
           o.organization_id, o.name AS organization_name,
           c.category_id, c.name AS category_name
    FROM projects p
    LEFT JOIN organizations o ON p.organization_id = o.organization_id
    LEFT JOIN categories c ON p.category_id = c.category_id
    ORDER BY p.project_id ASC
  `;
  const result = await pool.query(query);
  return result.rows;
};

const getProjectById = async (projectId) => {
  const query = `
    SELECT p.project_id, p.name, p.description,
           o.organization_id, o.name AS organization_name
    FROM projects p
    LEFT JOIN organizations o ON p.organization_id = o.organization_id
    WHERE p.project_id = $1
  `;
  const result = await pool.query(query, [projectId]);
  return result.rows[0] || null;
};

const getProjectCategories = async (projectId) => {
  const query = `
    SELECT c.category_id, c.name
    FROM categories c
    INNER JOIN projects p ON p.category_id = c.category_id
    WHERE p.project_id = $1
    ORDER BY c.category_id ASC
  `;
  const result = await pool.query(query, [projectId]);
  return result.rows;
};

module.exports = {
  getProjects,
  getProjectById,
  getProjectCategories,
};
