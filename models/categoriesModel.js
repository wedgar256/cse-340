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
    INNER JOIN project_categories pc ON pc.project_id = p.project_id
    WHERE pc.category_id = $1
    ORDER BY p.project_id ASC
  `;
  const result = await pool.query(query, [categoryId]);
  return result.rows;
};

const addCategory = async (name) => {
  const query = "INSERT INTO categories (name) VALUES ($1) RETURNING *";
  const result = await pool.query(query, [name]);
  return result.rows[0];
};

const updateCategory = async (categoryId, name) => {
  const query = `
    UPDATE categories
    SET name = $1
    WHERE category_id = $2
    RETURNING *
  `;
  const result = await pool.query(query, [name, categoryId]);
  return result.rows[0] || null;
};

module.exports = {
  getCategories,
  getCategoryById,
  getCategoryProjects,
  addCategory,
  updateCategory,
};
