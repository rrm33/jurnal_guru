import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

export function getDbPool(): mysql.Pool | null {
  if (pool) return pool;

  const rawHost = process.env.DB_HOST;
  const dbName = process.env.DB_NAME;

  // Only attempt connection if host and db name are defined
  if (!rawHost || !dbName) {
    console.warn("MySQL configuration missing (DB_HOST or DB_NAME not set).");
    return null;
  }

  // Force '127.0.0.1' when 'localhost' is specified to avoid IPv6 (::1) connection errors on cPanel
  const host = rawHost === 'localhost' ? '127.0.0.1' : rawHost;

  try {
    pool = mysql.createPool({
      host,
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: dbName,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 5000,
    });
    console.log(`[MySQL] Connection pool created for database: ${dbName} at ${host}`);
    return pool;
  } catch (err) {
    console.error("[MySQL] Failed to create connection pool:", err);
    return null;
  }
}

export async function testDbConnectionDetailed(): Promise<{ connected: boolean; error?: string; host?: string; database?: string; user?: string }> {
  const host = (process.env.DB_HOST === 'localhost' ? '127.0.0.1' : process.env.DB_HOST) || 'Belum diisi';
  const database = process.env.DB_NAME || 'Belum diisi';
  const user = process.env.DB_USER || 'Belum diisi';

  if (!process.env.DB_HOST || !process.env.DB_NAME) {
    return {
      connected: false,
      error: "Variabel DB_HOST atau DB_NAME belum dikonfigurasi di Environment Variables cPanel / file .env.",
      host,
      database,
      user
    };
  }

  try {
    const activePool = getDbPool();
    if (!activePool) {
      return { connected: false, error: "Gagal membuat pool koneksi MySQL.", host, database, user };
    }
    const connection = await activePool.getConnection();
    connection.release();
    return { connected: true, host, database, user };
  } catch (err: any) {
    console.error("[MySQL] Connection check failed:", err);
    let detailedError = err.message || "Unknown connection error";
    if (err.code === 'ECONNREFUSED') {
      detailedError = `Gagal terhubung ke MySQL server (${host}:${process.env.DB_PORT || 3306}). Pastikan MySQL service berjalan dan gunakan DB_HOST = 127.0.0.1`;
    } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      detailedError = `Akses ditolak untuk user '${user}'. Periksa kembali DB_USER dan DB_PASSWORD pada cPanel.`;
    } else if (err.code === 'ER_BAD_DB_ERROR') {
      detailedError = `Database '${database}' tidak ditemukan. Pastikan nama database di cPanel sudah sesuai (termasuk prefix cPanel seperti 'user_dbname').`;
    }
    return { connected: false, error: detailedError, host, database, user };
  }
}

export async function isDbConnected(): Promise<boolean> {
  const result = await testDbConnectionDetailed();
  return result.connected;
}

