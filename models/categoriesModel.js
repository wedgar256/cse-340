const pool = require("../database");

const fallbackCategories = [
  { category_id: 1, name: "Software Development" },
  { category_id: 2, name: "Database Administration" },
  { category_id: 3, name: "UI/UX Design" },
  { category_id: 4, name: "System Architecture" },
];

const getCategories = async () => {
  try {
    const query = "SELECT * FROM categories ORDER BY category_id ASC";
    const timeout = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Database timeout")), 800);
    });

    const result = await Promise.race([pool.query(query), timeout]);

    if (result.rows && result.rows.length > 0) {
      return result.rows;
    }

    return fallbackCategories;
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    return fallbackCategories;
  }
};

module.exports = {
  getCategories,
};
