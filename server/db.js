import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const connectionString =
  process.env.DATABASE_URL ||
  'postgres://postgres:postgrespassword@localhost:5432/gogangs';

export const pool = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 3000,
});

let isConnected = false;

// Test initial connection
pool.connect((err, client, release) => {
  if (err) {
    console.warn('⚠️  PostgreSQL (Docker) not detected yet. Backend is running in resilient hybrid fallback mode.');
    isConnected = false;
  } else {
    isConnected = true;
    console.log('🐘 PostgreSQL connected successfully to:', connectionString.split('@')[1] || connectionString);
    release();
  }
});

export async function query(text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  // console.log('executed query', { text, duration, rows: res.rowCount });
  return res;
}

export function isDbConnected() {
  return isConnected;
}
