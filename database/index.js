const { Pool } = require("pg");
require("dotenv").config();

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/cse340";

const isLocalHost = /localhost|127\.0\.0\.1|\[::1\]/.test(connectionString);

const pool = new Pool({
  connectionString,
  ssl: isLocalHost ? false : { rejectUnauthorized: false },
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 1000,
  max: 5,
});

pool.on("error", (error) => {
  console.error("Unexpected database pool error:", error);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  connect: () => pool.connect(),
};
