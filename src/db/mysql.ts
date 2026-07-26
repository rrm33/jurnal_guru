import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

export function getDbPool(): mysql.Pool | null {
  if (pool) return pool;

  const host = process.env.DB_HOST;
  const dbName = process.env.DB_NAME;

  // Only attempt connection if host and db name are defined
  if (!host || !dbName) {
    console.warn("MySQL configuration missing (DB_HOST or DB_NAME not set).");
    return null;
  }

  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'jurnal_guru',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 5000,
    });
    console.log(`[MySQL] Connection pool created for database: ${process.env.DB_NAME}`);
    return pool;
  } catch (err) {
    console.error("[MySQL] Failed to create connection pool:", err);
    return null;
  }
}

export async function isDbConnected(): Promise<boolean> {
  const activePool = getDbPool();
  if (!activePool) return false;
  try {
    const connection = await activePool.getConnection();
    connection.release();
    return true;
  } catch (err) {
    console.error("[MySQL] Connection check failed:", err);
    return false;
  }
}
