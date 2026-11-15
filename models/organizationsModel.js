const pool = require("../database");

const getOrganizations = async () => {
  const query = "SELECT * FROM organizations ORDER BY organization_id ASC";
  const result = await pool.query(query);
  return result.rows;
};

const getOrganizationById = async (organizationId) => {
  const query = "SELECT * FROM organizations WHERE organization_id = $1";
  const result = await pool.query(query, [organizationId]);
  return result.rows[0] || null;
};

const addOrganization = async (name, description, logoUrl) => {
  const query = `
    INSERT INTO organizations (name, description, logo_url)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const result = await pool.query(query, [name, description, logoUrl]);
  return result.rows[0];
};

const updateOrganization = async (organizationId, name, description, logoUrl) => {
  const query = `
    UPDATE organizations
    SET name = $1, description = $2, logo_url = $3
    WHERE organization_id = $4
    RETURNING *
  `;
  const result = await pool.query(query, [name, description, logoUrl, organizationId]);
  return result.rows[0] || null;
};

module.exports = {
  getOrganizations,
  getOrganizationById,
  addOrganization,
  updateOrganization,
};
