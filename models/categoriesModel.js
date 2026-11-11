const pool = require("../database");

const getCategories = async () => {
  const query = "SELECT * FROM categories ORDER BY category_id ASC";
  const result = await pool.query(query);
  return result.rows;
};

const getCategoryById = async (categoryId) => {
  const query = "SELECT * FROM categories WHERE category_id = $1";
  const result = await pool.query(query, [categoryId]);
  return result.rows[0] || null;
};

const getCategoryProjects = async (categoryId) => {
  const query = `
    SELECT p.project_id, p.name, p.description
    FROM projects p
    WHERE p.category_id = $1
    ORDER BY p.project_id ASC
  `;
  const result = await pool.query(query, [categoryId]);
  return result.rows;
};

module.exports = {
  getCategories,
  getCategoryById,
  getCategoryProjects,
};
