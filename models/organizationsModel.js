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

module.exports = {
  getOrganizations,
  getOrganizationById,
};
