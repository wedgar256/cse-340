const pool = require("../database");

const getProjects = async () => {
  const query = `
    SELECT p.project_id, p.name, p.description, p.location,
           to_char(p.date, 'YYYY-MM-DD') AS date,
           o.organization_id, o.name AS organization_name,
           COALESCE(
             string_agg(c.name, ', ' ORDER BY c.category_id),
             ''
           ) AS category_name
    FROM projects p
    LEFT JOIN organizations o ON p.organization_id = o.organization_id
    LEFT JOIN project_categories pc ON pc.project_id = p.project_id
    LEFT JOIN categories c ON c.category_id = pc.category_id
    GROUP BY p.project_id, o.organization_id, o.name
    ORDER BY p.project_id ASC
  `;
  const result = await pool.query(query);
  return result.rows;
};

const getProjectById = async (projectId) => {
  const query = `
    SELECT p.project_id, p.name, p.description, p.location,
           to_char(p.date, 'YYYY-MM-DD') AS date,
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
    INNER JOIN project_categories pc ON pc.category_id = c.category_id
    WHERE pc.project_id = $1
    ORDER BY c.category_id ASC
  `;
  const result = await pool.query(query, [projectId]);
  return result.rows;
};

const getProjectCategoryIds = async (projectId) => {
  const query = "SELECT category_id FROM project_categories WHERE project_id = $1 ORDER BY category_id ASC";
  const result = await pool.query(query, [projectId]);
  return result.rows.map((row) => row.category_id);
};

const addProject = async (organizationId, name, description, location, date) => {
  const query = `
    INSERT INTO projects (organization_id, name, description, location, date)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const result = await pool.query(query, [
    organizationId,
    name,
    description,
    location,
    date || null,
  ]);
  return result.rows[0];
};

const updateProject = async (
  projectId,
  organizationId,
  name,
  description,
  location,
  date
) => {
  const query = `
    UPDATE projects
    SET organization_id = $1, name = $2, description = $3, location = $4, date = $5
    WHERE project_id = $6
    RETURNING *
  `;
  const result = await pool.query(query, [
    organizationId,
    name,
    description,
    location,
    date || null,
    projectId,
  ]);
  return result.rows[0] || null;
};

const updateProjectCategories = async (projectId, categoryIds) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM project_categories WHERE project_id = $1", [projectId]);
    if (categoryIds.length > 0) {
      await client.query(
        "INSERT INTO project_categories (project_id, category_id) SELECT $1, unnest($2::int[])",
        [projectId, categoryIds]
      );
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  getProjects,
  getProjectById,
  getProjectCategories,
  getProjectCategoryIds,
  addProject,
  updateProject,
  updateProjectCategories,
};
