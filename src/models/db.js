import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || process.env.DB_URL;
const nodeEnvironment = (process.env.NODE_ENV || 'production').toLowerCase();
const databaseHost = connectionString ? new URL(connectionString).hostname : '';
const useSsl = nodeEnvironment === 'production' || databaseHost.endsWith('.render.com');

const pool = new Pool({
  connectionString,
  ssl: useSsl ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
});

pool.on('error', (error) => {
  console.error('Unexpected PostgreSQL pool error:', error.message);
});

let db = pool;

if (process.env.NODE_ENV === 'development' && process.env.ENABLE_SQL_LOGGING === 'true') {
  db = {
    async query(text, params) {
      try {
        const start = Date.now();
        const result = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('Executed query:', {
          text: text.replace(/\s+/g, ' ').trim(),
          duration: `${duration}ms`,
          rows: result.rowCount,
        });
        return result;
      } catch (error) {
        console.error('Error in query:', {
          text: text.replace(/\s+/g, ' ').trim(),
          error: error.message,
        });
        throw error;
      }
    },

    async close() {
      await pool.end();
    },
  };
}

const testConnection = async () => {
  try {
    if (!connectionString) {
      throw new Error('Database URL is missing. Set DATABASE_URL or DB_URL in the service environment.');
    }

    const result = await db.query('SELECT NOW() as current_time');
    console.log('Database connection successful:', result.rows[0].current_time);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    throw error;
  }
};

export { db as default, testConnection };
