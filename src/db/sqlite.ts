import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import fs from 'fs';

let dbInstance: Database | null = null;
let poolWrapper: any = null;

// Pastikan folder data tersedia
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'database.sqlite');

export async function initDb() {
  if (!dbInstance) {
    dbInstance = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    console.log(`[SQLite] Connected to database at ${dbPath}`);

    // Wrapper untuk mensimulasikan sintaks pool.query MySQL
    poolWrapper = {
      query: async (sql: string, params: any[] = []) => {
        const isSelect = sql.trim().toUpperCase().startsWith('SELECT');
        if (isSelect) {
          const rows = await dbInstance!.all(sql, params);
          return [rows]; // MySQL me-return [rows, fields]
        } else {
          const result = await dbInstance!.run(sql, params);
          return [result]; // MySQL me-return [resultHeader]
        }
      }
    };
  }
}

// Mengembalikan wrapper yang mirip dengan MySQL pool
export function getDbPool() {
  if (!poolWrapper) {
    console.warn("[SQLite] getDbPool() dipanggil sebelum initDb() selesai.");
  }
  return poolWrapper;
}

export async function testDbConnectionDetailed(): Promise<{ connected: boolean; error?: string; host?: string; database?: string; user?: string }> {
  try {
    await initDb();
    return { connected: true, host: 'localhost', database: 'database.sqlite', user: 'sqlite' };
  } catch (err: any) {
    return { connected: false, error: err.message, host: 'localhost', database: 'database.sqlite', user: 'sqlite' };
  }
}

export async function isDbConnected(): Promise<boolean> {
  const result = await testDbConnectionDetailed();
  return result.connected;
}
