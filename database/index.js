const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/cse340",
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
  connectionTimeoutMillis: 1000,
  idleTimeoutMillis: 1000,
  max: 5,
});

pool.on("error", (error) => {
  console.error("Unexpected database pool error:", error);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
