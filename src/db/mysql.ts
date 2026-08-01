import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

export function getDbPool(): mysql.Pool | null {
  if (pool) return pool;

  const host = process.env.DB_HOST;
  const dbName = process.env.DB_NAME || process.env.DB_DATABASE;

  if (!host || !dbName) {
    return null;
  }

  try {
    pool = mysql.createPool({
      host,
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: dbName,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 5000, // 5 seconds timeout
    });
    console.log(`[MySQL] Connection pool created for database: ${dbName} at ${host}`);
    return pool;
  } catch (err) {
    console.error("[MySQL] Failed to create connection pool:", err);
    return null;
  }
}

export async function testDbConnectionDetailed(): Promise<{ connected: boolean; error?: string; host?: string; database?: string; user?: string }> {
  const host = process.env.DB_HOST || 'Belum diisi';
  const database = process.env.DB_NAME || process.env.DB_DATABASE || 'Belum diisi';
  const user = process.env.DB_USER || process.env.DB_USERNAME || 'Belum diisi';
  const password = process.env.DB_PASSWORD || '';
  const port = Number(process.env.DB_PORT) || 3306;

  if (!process.env.DB_HOST || !(process.env.DB_NAME || process.env.DB_DATABASE)) {
    return {
      connected: false,
      error: "Variabel DB_HOST atau DB_NAME belum dikonfigurasi di Environment Variables cPanel / file .env.",
      host,
      database,
      user
    };
  }

  try {
    // Force a fresh direct connection to test credentials without using the pool
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port,
      user: process.env.DB_USER || process.env.DB_USERNAME || 'root',
      password,
      database: process.env.DB_NAME || process.env.DB_DATABASE,
      connectTimeout: 5000
    });
    await connection.end();
    
    // Also initialize the pool if it works
    getDbPool();
    
    return { connected: true, host, database, user };
  } catch (err: any) {
    console.info("[MySQL] Connection test note:", err.code || err.message || "Disconnected");
    let detailedError = `[${err.code || 'UNKNOWN_ERROR'}] ${err.message || String(err)}`;
    
    if (err.code === 'ECONNREFUSED') {
      detailedError = `[ECONNREFUSED] Gagal terhubung ke MySQL server (${host}:${port}). Service MySQL mungkin mati atau host salah (Coba ganti localhost/127.0.0.1). Detail: ${err.message}`;
    } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      detailedError = `[ER_ACCESS_DENIED_ERROR] Akses ditolak untuk user '${user}'. Periksa DB_PASSWORD dan DB_USER pada cPanel. Detail: ${err.message}`;
    } else if (err.code === 'ER_BAD_DB_ERROR') {
      detailedError = `[ER_BAD_DB_ERROR] Database '${database}' tidak ditemukan. Pastikan nama database di cPanel sudah sesuai. Detail: ${err.message}`;
    } else if (err.code === 'ENOTFOUND') {
      detailedError = `[ENOTFOUND] Host '${host}' tidak dapat ditemukan. Coba ganti DB_HOST menjadi '127.0.0.1' atau 'localhost'. Detail: ${err.message}`;
    }
    
    return { connected: false, error: detailedError, host, database, user };
  }
}

export async function isDbConnected(): Promise<boolean> {
  const result = await testDbConnectionDetailed();
  return result.connected;
}
