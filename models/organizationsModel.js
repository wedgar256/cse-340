const pool = require("../database");

const fallbackOrganizations = [
  {
    organization_id: 1,
    name: "Tech Innovators",
    logo_url: "/images/org1.svg",
  },
  {
    organization_id: 2,
    name: "Community Builders",
    logo_url: "/images/org2.svg",
  },
  {
    organization_id: 3,
    name: "Green Energy Corp",
    logo_url: "/images/org3.svg",
  },
];

const getOrganizations = async () => {
  try {
    const query = "SELECT * FROM organizations ORDER BY organization_id ASC";
    const timeout = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Database timeout")), 800);
    });

    const result = await Promise.race([pool.query(query), timeout]);

    if (result.rows && result.rows.length > 0) {
      return result.rows;
    }

    return fallbackOrganizations;
  } catch (error) {
    console.error("Error fetching organizations:", error.message);
    return fallbackOrganizations;
  }
};

module.exports = {
  getOrganizations,
};
