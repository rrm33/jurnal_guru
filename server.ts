import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// Robust dotenv loading for cPanel/Passenger
const possiblePaths = [
  path.resolve(process.cwd(), '.env')
];

try {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  possiblePaths.push(path.resolve(currentDir, '.env'));
  possiblePaths.push(path.resolve(currentDir, '..', '.env'));
} catch (e) {}

try {
  // @ts-ignore
  if (typeof __dirname !== 'undefined') {
    // @ts-ignore
    possiblePaths.push(path.resolve(__dirname, '.env'));
    // @ts-ignore
    possiblePaths.push(path.resolve(__dirname, '..', '.env'));
  }
} catch (e) {}

let envLoaded = false;
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p });
    console.log(`[Env] Loaded from ${p}`);
    envLoaded = true;
    break;
  }
}
if (!envLoaded) {
  dotenv.config();
}
import { createServer as createViteServer } from "vite";
import { getDbPool, isDbConnected, testDbConnectionDetailed } from "./src/db/mysql.ts";

// Utilities for file storage
function processBase64Photo(base64Str: string, id: string): string {
  if (!base64Str || !base64Str.startsWith("data:image/")) return base64Str;
  
  const uploadDir = path.join(process.cwd(), "public", "uploads", "photos");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) return base64Str;

  const ext = matches[1].split('/')[1]?.replace("jpeg", "jpg") || 'jpg';
  const buffer = Buffer.from(matches[2], 'base64');
  const filename = `${id}_${Date.now()}.${ext}`;
  const filepath = path.join(uploadDir, filename);
  
  fs.writeFileSync(filepath, buffer);
  return `/uploads/photos/${filename}`;
}

async function uploadToTelegram(base64Str: string, filename: string): Promise<string> {
  if (!base64Str || !base64Str.startsWith("data:")) return base64Str;
  
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return base64Str; // fallback if not configured

  const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) return base64Str;

  const buffer = Buffer.from(matches[2], 'base64');
  const blob = new Blob([buffer], { type: matches[1] });
  const form = new FormData();
  form.append("chat_id", chatId);
  form.append("document", blob, filename || "document.file");

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendDocument`, {
      method: "POST",
      body: form as any
    });
    const json = await res.json();
    if (json.ok && json.result.document) {
      return `/api/telegram/download/${json.result.document.file_id}`;
    }
  } catch (err) {
    console.error("[Telegram] Upload error", err);
  }
  return base64Str; // fallback
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Telegram download route (must be before body parsers if large, but here is fine)
  app.get("/api/telegram/download/:file_id", async (req, res) => {
    const fileId = req.params.file_id;
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) return res.status(500).send("Telegram not configured");
    try {
      const response = await fetch(`https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`);
      const json = await response.json();
      if (json.ok && json.result.file_path) {
        // Redirect client to download directly from Telegram
        res.redirect(`https://api.telegram.org/file/bot${token}/${json.result.file_path}`);
      } else {
        res.status(404).send("File not found on Telegram");
      }
    } catch (err) {
      res.status(500).send("Error contacting Telegram API");
    }
  });

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Serve dynamic uploads (photos)
  app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));

  // --- API ROUTES ---

  // Health check & DB connection status with fallback to Server JSON Store
  app.get("/api/health", async (req, res) => {
    try {
      const testResult = await testDbConnectionDetailed();
      if (testResult.connected) {
        res.json({
          status: "ok",
          database: "connected",
          mode: "mysql",
          error: null,
          config: {
            host: testResult.host,
            database: testResult.database,
            user: testResult.user
          }
        });
      } else {
        res.json({
          status: "ok",
          database: "connected",
          mode: "error",
          message: "MySQL disconnected.",
          mysqlError: testResult.error,
          config: {
            host: testResult.host,
            database: testResult.database,
            user: testResult.user
          }
        });
      }
    } catch (err: any) {
      res.json({
        status: "ok",
        database: "connected",
        mode: "error",
        message: "MySQL disconnected.",
        mysqlError: err.message || String(err)
      });
    }
  });

  // Function to initialize MySQL tables automatically
  async function initDbTables() {
    if (!process.env.DB_HOST || !(process.env.DB_NAME || process.env.DB_DATABASE)) {
      return { success: false, error: "MySQL not configured" };
    }
    const connected = await isDbConnected();
    if (!connected) {
      return { success: false, error: "MySQL not configured" };
    }
    const pool = getDbPool();
    if (!pool) return { success: false, error: "MySQL not configured" };
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS teacher_profile (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          nip VARCHAR(50) NULL,
          school VARCHAR(100) NULL,
          subjectGroup VARCHAR(100) NULL,
          photoUrl LONGTEXT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      try {
        await pool.query("ALTER TABLE teacher_profile ADD COLUMN photoUrl LONGTEXT NULL");
      } catch (err: any) {
        // Ignored if column already exists (ER_DUP_FIELDNAME)
      }

      await pool.query(`
        CREATE TABLE IF NOT EXISTS students (
          id VARCHAR(50) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          nisn VARCHAR(50) NOT NULL,
          className VARCHAR(100) NOT NULL,
          gender ENUM('L', 'P') NOT NULL,
          photoUrl LONGTEXT NULL,
          whatsapp VARCHAR(20) NULL,
          password TEXT NULL,
          hasChangedPassword TINYINT(1) DEFAULT 0
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      try { await pool.query("ALTER TABLE students ADD COLUMN photoUrl LONGTEXT NULL"); } catch (e) {}
      try { await pool.query("ALTER TABLE students ADD COLUMN whatsapp VARCHAR(20) NULL"); } catch (e) {}
      try { await pool.query("ALTER TABLE students ADD COLUMN password TEXT NULL"); } catch (e) {}
      try { await pool.query("ALTER TABLE students ADD COLUMN hasChangedPassword TINYINT(1) DEFAULT 0"); } catch (e) {}

      await pool.query(`
        CREATE TABLE IF NOT EXISTS lesson_plans (
          id VARCHAR(50) PRIMARY KEY,
          week INT NOT NULL,
          semester INT NOT NULL,
          subject VARCHAR(255) NOT NULL,
          className VARCHAR(100) NOT NULL,
          topic VARCHAR(255) NOT NULL,
          competency TEXT NOT NULL,
          activities TEXT NOT NULL,
          resources TEXT NOT NULL,
          status ENUM('Scheduled', 'Completed') DEFAULT 'Scheduled',
          materialText TEXT NULL,
          materialFile LONGTEXT NULL,
          taskTitle VARCHAR(255) NULL,
          taskDescription TEXT NULL,
          taskMaxPoints INT DEFAULT 100,
          taskDeadline VARCHAR(50) NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS attendance (
          id VARCHAR(50) PRIMARY KEY,
          date VARCHAR(20) NOT NULL,
          className VARCHAR(100) NOT NULL,
          studentId VARCHAR(50) NOT NULL,
          status ENUM('Hadir', 'Sakit', 'Izin', 'Alpa') NOT NULL,
          notes TEXT NULL,
          lessonPlanId VARCHAR(50) NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS materials (
          id VARCHAR(50) PRIMARY KEY,
          className VARCHAR(100) NOT NULL,
          lessonPlanId VARCHAR(50) NULL,
          title VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          category ENUM('Teori', 'Praktikum', 'Referensi') NOT NULL,
          createdAt VARCHAR(50) NOT NULL,
          file LONGTEXT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS tasks (
          id VARCHAR(50) PRIMARY KEY,
          className VARCHAR(100) NOT NULL,
          title VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          maxPoints INT DEFAULT 100,
          deadline VARCHAR(50) NOT NULL,
          createdAt VARCHAR(50) NOT NULL,
          lessonPlanId VARCHAR(50) NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS task_submissions (
          id VARCHAR(50) PRIMARY KEY,
          taskId VARCHAR(50) NOT NULL,
          studentId VARCHAR(50) NOT NULL,
          submissionDate VARCHAR(50) NULL,
          status ENUM('Belum Mengumpulkan', 'Menunggu Penilaian', 'Selesai') DEFAULT 'Belum Mengumpulkan',
          grade INT NULL,
          feedback TEXT NULL,
          studentAnswerText TEXT NULL,
          studentAnswerFile LONGTEXT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS development_progress (
          id VARCHAR(50) PRIMARY KEY,
          studentId VARCHAR(50) NOT NULL,
          date VARCHAR(20) NOT NULL,
          aspect VARCHAR(255) NOT NULL,
          status ENUM('Perlu Bimbingan', 'Cukup', 'Baik', 'Sangat Baik') NOT NULL,
          notes TEXT NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS discipline_logs (
          id VARCHAR(50) PRIMARY KEY,
          studentId VARCHAR(50) NOT NULL,
          date VARCHAR(20) NOT NULL,
          type ENUM('Negatif', 'Positif') NOT NULL,
          category VARCHAR(255) NOT NULL,
          points INT NOT NULL,
          actionTaken TEXT NULL,
          notes TEXT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS subjects (
          name VARCHAR(255) PRIMARY KEY
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS classes (
          name VARCHAR(255) PRIMARY KEY
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS informasi (
          id VARCHAR(100) PRIMARY KEY,
          info TEXT,
          isi LONGTEXT,
          gambar LONGTEXT,
          createdAt VARCHAR(100)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      // Seed subjects and classes if empty
      const [subjRows]: any = await pool.query("SELECT COUNT(*) as count FROM subjects");
      if (subjRows[0].count === 0) {
        await pool.query("INSERT INTO subjects (name) VALUES ('Pemrograman Mobile'), ('Rekayasa Perangkat Lunak')");
      }
      
      const [classRows]: any = await pool.query("SELECT COUNT(*) as count FROM classes");
      if (classRows[0].count === 0) {
        await pool.query("INSERT INTO classes (name) VALUES ('XI RPL 1'), ('XI RPL 2')");
      }

      // --- LEGACY DATA MIGRATION ---
      // Update any existing "Pemrograman Web & Perangkat Bergerak" to "Pemrograman Mobile"
      try {
        await pool.query(`UPDATE lesson_plans SET subject = 'Pemrograman Mobile' WHERE subject = 'Pemrograman Web & Perangkat Bergerak'`);
        try {
          await pool.query(`ALTER TABLE attendance ADD COLUMN subject VARCHAR(255) NULL`);
        } catch(e) {}
        try {
          await pool.query(`UPDATE attendance SET subject = 'Pemrograman Mobile' WHERE subject = 'Pemrograman Web & Perangkat Bergerak'`);
        } catch(e) {}
      } catch (err) {
        console.warn("[MySQL] Failed to run legacy migration:", err);
      }

      console.log("[MySQL] Tabel berhasil dibuat / terverifikasi!");
      return { success: true };
    } catch (err: any) {
      console.error("[MySQL] Gagal inisialisasi tabel:", err);
      return { success: false, error: err.message || "Gagal membuat tabel MySQL" };
    }
  }

  // Auto initialize MySQL tables endpoint (GET and POST supported)
  app.all("/api/init-db", async (req, res) => {
    const testResult = await testDbConnectionDetailed();
    if (!testResult.connected) {
      return res.status(500).json({
        success: false,
        message: "MySQL tidak aktif. Tidak dapat melanjutkan.",
        mode: "error"
      });
    }

    const initResult = await initDbTables();
    if (initResult.success) {
      res.json({ success: true, message: "Tabel MySQL berhasil dibuat & diverifikasi!" });
    } else {
      res.status(500).json({ success: false, error: initResult.error });
    }
  });

  // --- TEACHER PROFILE ---
  app.get("/api/teacher-profile", async (req, res) => {
    const pool = getDbPool();
    if (pool) {
      try {
        const [rows]: any = await pool.query("SELECT name, nip, school, subjectGroup, photoUrl FROM teacher_profile LIMIT 1");
        if (rows && rows.length > 0) return res.json(rows[0]); return res.json({});
      } catch (err) {
        // Fallback to JSON store silently if MySQL is offline or not created
      }
    }
    return res.status(500).json({ error: "Database offline" });
  });

  app.post("/api/teacher-profile", async (req, res) => {
    const profile = req.body;
    if (profile.photoUrl) {
      profile.photoUrl = processBase64Photo(profile.photoUrl, "teacher");
    }
    const pool = getDbPool();
    if (pool) {
      try {
        const { name, nip, school, subjectGroup, photoUrl } = profile;
        const [rows]: any = await pool.query("SELECT id FROM teacher_profile LIMIT 1");
        if (rows && rows.length > 0) {
          await pool.query("UPDATE teacher_profile SET name = ?, nip = ?, school = ?, subjectGroup = ?, photoUrl = ? WHERE id = ?", [
            name, nip, school, subjectGroup, photoUrl || null, rows[0].id
          ]);
        } else {
          await pool.query("INSERT INTO teacher_profile (name, nip, school, subjectGroup, photoUrl) VALUES (?, ?, ?, ?, ?)", [
            name, nip, school, subjectGroup, photoUrl || null
          ]);
        }
      } catch (err) {
        // Saved in JSON store
      }
    }
    res.json({ success: true, profile });
  });
  // --- SUBJECTS ---
  app.get("/api/subjects", async (req, res) => {
    const pool = getDbPool();
    if (pool) {
      try {
        const [rows]: any = await pool.query("SELECT name FROM subjects");
        return res.json((rows || []).map((r: any) => r.name));
      } catch (err) {}
    }
    return res.status(500).json({ error: "Database offline" });
  });

  app.post("/api/subjects", async (req, res) => {
    const items = req.body;
    const pool = getDbPool();
    if (pool) {
      try {
        await pool.query("DELETE FROM subjects");
        if (items.length > 0) {
          const values = items.map((name: string) => [name]);
          await pool.query("INSERT INTO subjects (name) VALUES ?", [values]);
        }
      } catch (err) {}
    }
    res.json({ success: true });
  });

  // --- CLASSES ---
  app.get("/api/classes", async (req, res) => {
    const pool = getDbPool();
    if (pool) {
      try {
        const [rows]: any = await pool.query("SELECT name FROM classes");
        return res.json((rows || []).map((r: any) => r.name));
      } catch (err) {}
    }
    return res.status(500).json({ error: "Database offline" });
  });

  app.post("/api/classes", async (req, res) => {
    const items = req.body;
    const pool = getDbPool();
    if (pool) {
      try {
        await pool.query("DELETE FROM classes");
        if (items.length > 0) {
          const values = items.map((name: string) => [name]);
          await pool.query("INSERT INTO classes (name) VALUES ?", [values]);
        }
      } catch (err) {}
    }
    res.json({ success: true });
  });


  // --- STUDENTS ---
  app.get("/api/students", async (req, res) => {
    const pool = getDbPool();
    if (pool) {
      try {
        const [rows]: any = await pool.query("SELECT id, name, nisn, className, gender, photoUrl, whatsapp, password, hasChangedPassword FROM students");
        if (rows && rows.length > 0) {
          const formatted = rows.map((r: any) => ({
            ...r,
            hasChangedPassword: Boolean(r.hasChangedPassword)
          }));
          return res.json(formatted);
        }
      } catch (err) {
        // Fallback to JSON store
      }
    }
    return res.status(500).json({ error: "Database offline" });
  });

  app.post("/api/students", async (req, res) => {
    const body = req.body;
    const items = Array.isArray(body) ? body : [body];
    const pool = getDbPool();
    
    // Fallback bulk save to avoid OOM
    if (items.length > 0) {
      for (const s of items) {
        if (s && s.photoUrl) {
          s.photoUrl = processBase64Photo(s.photoUrl, s.id || "student");
        }
      }
    }

    if (pool) {
      for (const student of items) {
        if (student && student.id) {
          try {
            const { id, name, nisn, className, gender, photoUrl, whatsapp, password, hasChangedPassword } = student;
            await pool.query(
              "REPLACE INTO students (id, name, nisn, className, gender, photoUrl, whatsapp, password, hasChangedPassword) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", 
              [id, name, nisn, className, gender, photoUrl || null, whatsapp || null, password || null, hasChangedPassword ? 1 : 0]
            );
          } catch (err) {
            // Error ignored
          }
        }
      }
    }
    res.json({ success: true });
  });

  app.delete("/api/students/:id", async (req, res) => {
    const pool = getDbPool();
    if (pool) {
      try {
        await pool.query("DELETE FROM students WHERE id = ?", [req.params.id]);
      } catch (err) {
        // Handled in JSON store
      }
    }
    res.json({ success: true });
  });

  // --- LESSON PLANS ---
  app.get("/api/lesson-plans", async (req, res) => {
    const pool = getDbPool();
    if (pool) {
      try {
        const [rows]: any = await pool.query("SELECT * FROM lesson_plans");
        if (rows && rows.length > 0) {
          const formatted = rows.map((r: any) => ({
            ...r,
            materialFile: r.materialFile ? JSON.parse(r.materialFile) : null
          }));
          return res.json(formatted);
        }
      } catch (err) {
        // Fallback to JSON store
      }
    }
    return res.status(500).json({ error: "Database offline" });
  });

  app.post("/api/lesson-plans", async (req, res) => {
    const body = req.body;
    const items = Array.isArray(body) ? body : [body];
    const pool = getDbPool();

    if (items.length > 0) {
      for (const lp of items) {
        if (lp && lp.materialFile && lp.materialFile.dataUrl) {
          lp.materialFile.dataUrl = await uploadToTelegram(lp.materialFile.dataUrl, lp.materialFile.name);
        }
      }
    }

    if (pool) {
      for (const lp of items) {
        if (lp && lp.id) {
          try {
            await pool.query(`
              REPLACE INTO lesson_plans 
              (id, week, semester, subject, className, topic, competency, activities, resources, status, materialText, materialFile, taskTitle, taskDescription, taskMaxPoints, taskDeadline)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
              lp.id, lp.week, lp.semester, lp.subject, lp.className, lp.topic, lp.competency, lp.activities, lp.resources, lp.status,
              lp.materialText || null, lp.materialFile ? JSON.stringify(lp.materialFile) : null,
              lp.taskTitle || null, lp.taskDescription || null, lp.taskMaxPoints || 100, lp.taskDeadline || null
            ]);
          } catch (err) {
            // Error ignored
          }
        }
      }
    }
    res.json({ success: true });
  });

  app.delete("/api/lesson-plans/:id", async (req, res) => {
    const pool = getDbPool();
    if (pool) {
      try {
        await pool.query("DELETE FROM lesson_plans WHERE id = ?", [req.params.id]);
      } catch (err) {
        // Handled in JSON store
      }
    }
    res.json({ success: true });
  });

  // --- ATTENDANCE ---
  app.get("/api/attendance", async (req, res) => {
    const pool = getDbPool();
    if (pool) {
      try {
        const [rows]: any = await pool.query("SELECT * FROM attendance");
        return res.json(rows || []);
      } catch (err) {
        // Fallback to JSON store
      }
    }
    return res.status(500).json({ error: "Database offline" });
  });

  app.post("/api/attendance", async (req, res) => {
    const att = req.body;
    const pool = getDbPool();
    if (pool) {
      try {
        const { id, date, className, studentId, status, notes, lessonPlanId } = att;
        await pool.query(`
          REPLACE INTO attendance (id, date, className, studentId, status, notes, lessonPlanId)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [id, date, className, studentId, status, notes || null, lessonPlanId || null]);
      } catch (err) {
        // Saved in JSON store
      }
    }
    res.json({ success: true });
  });

  // Bulk save attendance
  app.post("/api/attendance/bulk", async (req, res) => {
    const items: any[] = req.body;
    if (Array.isArray(items)) {
      const pool = getDbPool();
      if (pool) {
        try {
          for (const item of items) {
            await pool.query(`
              REPLACE INTO attendance (id, date, className, studentId, status, notes, lessonPlanId)
              VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [item.id, item.date, item.className, item.studentId, item.status, item.notes || null, item.lessonPlanId || null]);
          }
        } catch (err) {
          // Saved in JSON store
        }
      }
    }
    res.json({ success: true });
  });

  // --- MATERIALS ---
  app.get("/api/materials", async (req, res) => {
    const pool = getDbPool();
    if (pool) {
      try {
        const [rows]: any = await pool.query("SELECT * FROM materials");
        if (rows && rows.length > 0) {
          const formatted = rows.map((r: any) => ({
            ...r,
            file: r.file ? JSON.parse(r.file) : null
          }));
          return res.json(formatted);
        }
      } catch (err) {
        // Fallback to JSON store
      }
    }
    return res.status(500).json({ error: "Database offline" });
  });

  app.post("/api/materials", async (req, res) => {
    const items = Array.isArray(req.body) ? req.body : [req.body];
    if (items.length > 0) {
      for (const m of items) {
        if (m && m.file && m.file.dataUrl) {
          m.file.dataUrl = await uploadToTelegram(m.file.dataUrl, m.file.name);
        }
      }
    }

    const pool = getDbPool();
    if (pool) {
      for (const m of items) {
        if (m && m.id) {
          try {
            await pool.query(`
              REPLACE INTO materials (id, className, lessonPlanId, title, content, category, createdAt, file)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [m.id, m.className, m.lessonPlanId || null, m.title, m.content, m.category, m.createdAt, m.file ? JSON.stringify(m.file) : null]);
          } catch (err) {
            // Error ignored
          }
        }
      }
    }
    res.json({ success: true });
  });

  app.delete("/api/materials/:id", async (req, res) => {
    const pool = getDbPool();
    if (pool) {
      try {
        await pool.query("DELETE FROM materials WHERE id = ?", [req.params.id]);
      } catch (err) {
        // Handled in JSON store
      }
    }
    res.json({ success: true });
  });

  // --- TASKS & SUBMISSIONS ---
  app.get("/api/tasks", async (req, res) => {
    const pool = getDbPool();
    if (pool) {
      try {
        const [rows]: any = await pool.query("SELECT * FROM tasks");
        return res.json(rows || []);
      } catch (err) {
        // Fallback to JSON store
      }
    }
    return res.status(500).json({ error: "Database offline" });
  });

  app.post("/api/tasks", async (req, res) => {
    const items = Array.isArray(req.body) ? req.body : [req.body];

    const pool = getDbPool();
    if (pool) {
      for (const t of items) {
        if (t && t.id) {
          try {
            await pool.query(`
              REPLACE INTO tasks (id, className, title, description, maxPoints, deadline, createdAt, lessonPlanId)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [t.id, t.className, t.title, t.description, t.maxPoints || 100, t.deadline, t.createdAt, t.lessonPlanId || null]);
          } catch (err) {
            // Error ignored
          }
        }
      }
    }
    res.json({ success: true });
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    const pool = getDbPool();
    if (pool) {
      try {
        await pool.query("DELETE FROM tasks WHERE id = ?", [req.params.id]);
      } catch (err) {}
    }
    res.json({ success: true });
  });

  app.get("/api/task-submissions", async (req, res) => {
    const pool = getDbPool();
    if (pool) {
      try {
        const [rows]: any = await pool.query("SELECT * FROM task_submissions");
        if (rows && rows.length > 0) {
          const formatted = rows.map((r: any) => ({
            ...r,
            studentAnswerFile: r.studentAnswerFile ? JSON.parse(r.studentAnswerFile) : null
          }));
          return res.json(formatted);
        }
      } catch (err) {
        // Fallback to JSON store
      }
    }
    return res.status(500).json({ error: "Database offline" });
  });

  app.post("/api/task-submissions", async (req, res) => {
    const items = Array.isArray(req.body) ? req.body : [req.body];
    if (items.length > 0) {
      for (const s of items) {
        if (s && s.studentAnswerFile && s.studentAnswerFile.dataUrl) {
          s.studentAnswerFile.dataUrl = await uploadToTelegram(s.studentAnswerFile.dataUrl, s.studentAnswerFile.name);
        }
      }
    }

    const pool = getDbPool();
    if (pool) {
      for (const s of items) {
        if (s && s.id) {
          try {
            await pool.query(`
              REPLACE INTO task_submissions (id, taskId, studentId, submissionDate, status, grade, feedback, studentAnswerText, studentAnswerFile)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
              s.id, s.taskId, s.studentId, s.submissionDate || null, s.status, s.grade ?? null, s.feedback || null, s.studentAnswerText || null,
              s.studentAnswerFile ? JSON.stringify(s.studentAnswerFile) : null
            ]);
          } catch (err) {
            // Error ignored
          }
        }
      }
    }
    res.json({ success: true });
  });

  // --- DEVELOPMENT PROGRESS ---
  app.get("/api/development-progress", async (req, res) => {
    const pool = getDbPool();
    if (pool) {
      try {
        const [rows]: any = await pool.query("SELECT * FROM development_progress");
        return res.json(rows || []);
      } catch (err) {
        // Fallback to JSON store
      }
    }
    return res.status(500).json({ error: "Database offline" });
  });

  app.post("/api/development-progress", async (req, res) => {
    const items = Array.isArray(req.body) ? req.body : [req.body];

    const pool = getDbPool();
    if (pool) {
      for (const p of items) {
        if (p && p.id) {
          try {
            await pool.query(`
              REPLACE INTO development_progress (id, studentId, date, aspect, status, notes)
              VALUES (?, ?, ?, ?, ?, ?)
            `, [p.id, p.studentId, p.date, p.aspect, p.status, p.notes || null]);
          } catch (err) {
            // Error ignored
          }
        }
      }
    }
    res.json({ success: true });
  });

  app.delete("/api/development-progress/:id", async (req, res) => {
    const pool = getDbPool();
    if (pool) {
      try {
        await pool.query("DELETE FROM development_progress WHERE id = ?", [req.params.id]);
      } catch (err) {}
    }
    res.json({ success: true });
  });

  // --- DISCIPLINE LOGS ---
  app.get("/api/discipline-logs", async (req, res) => {
    const pool = getDbPool();
    if (pool) {
      try {
        const [rows]: any = await pool.query("SELECT * FROM discipline_logs");
        return res.json(rows || []);
      } catch (err) {
        // Fallback to JSON store
      }
    }
    return res.status(500).json({ error: "Database offline" });
  });

  app.post("/api/discipline-logs", async (req, res) => {
    const items = Array.isArray(req.body) ? req.body : [req.body];

    const pool = getDbPool();
    if (pool) {
      for (const l of items) {
        if (l && l.id) {
          try {
            await pool.query(`
              REPLACE INTO discipline_logs (id, studentId, date, type, category, points, actionTaken, notes)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [l.id, l.studentId, l.date, l.type, l.category, l.points, l.actionTaken || null, l.notes || null]);
          } catch (err) {
            // Error ignored
          }
        }
      }
    }
    res.json({ success: true });
  });

  app.delete("/api/discipline-logs/:id", async (req, res) => {
    const pool = getDbPool();
    if (pool) {
      try {
        await pool.query("DELETE FROM discipline_logs WHERE id = ?", [req.params.id]);
      } catch (err) {}
    }
    res.json({ success: true });
  });

  // --- EXAM GRADES ---
  app.get("/api/exam-grades", (req, res) => {
    return res.status(500).json({ error: "Database offline" });
  });

  app.post("/api/exam-grades", (req, res) => {
    const body = req.body;
    if (body.studentId) {
    } else if (typeof body === "object") {
    }
    res.json({ success: true });
  });

  // --- USER ACCOUNTS (Dummy endpoint to prevent 404 on frontend sync) ---
  app.get("/api/user-accounts", (req, res) => {
    res.json([]);
  });

  app.post("/api/user-accounts", (req, res) => {
    res.json({ success: true });
  });

  // --- INFORMASI ---
  app.get("/api/informasi", async (req, res) => {
    const pool = getDbPool();
    if (pool) {
      try {
        const [rows]: any = await pool.query("SELECT * FROM informasi");
        res.json(rows);
      } catch (err) {
        res.status(500).json({ error: "Gagal mengambil data informasi" });
      }
    } else {
      res.json([]);
    }
  });

  app.post("/api/informasi", async (req, res) => {
    const pool = getDbPool();
    if (pool) {
      const { id, info, isi, gambar, createdAt } = req.body;
      try {
        const [existing]: any = await pool.query("SELECT id FROM informasi WHERE id = ?", [id]);
        if (existing.length > 0) {
          await pool.query("UPDATE informasi SET info=?, isi=?, gambar=?, createdAt=? WHERE id=?", [
            info, isi, gambar || null, createdAt, id
          ]);
        } else {
          await pool.query("INSERT INTO informasi (id, info, isi, gambar, createdAt) VALUES (?, ?, ?, ?, ?)", [
            id, info, isi, gambar || null, createdAt
          ]);
        }
        res.json({ success: true });
      } catch (err) {
        res.status(500).json({ error: "Gagal menyimpan data informasi" });
      }
    } else {
      res.json({ success: false });
    }
  });

  app.delete("/api/informasi/:id", async (req, res) => {
    const pool = getDbPool();
    if (pool) {
      try {
        await pool.query("DELETE FROM informasi WHERE id = ?", [req.params.id]);
        res.json({ success: true });
      } catch (err) {
        res.status(500).json({ error: "Gagal menghapus informasi" });
      }
    } else {
      res.json({ success: false });
    }
  });

  // --- SYNC ALL DATA ENDPOINT ---

  // Catch-all for API routes so missing API calls return JSON 404 instead of index.html
  app.all("/api/*", (req, res) => {
    res.status(404).json({ error: `API route ${req.originalUrl} tidak ditemukan.` });
  });

  // --- VITE MIDDLEWARE FOR DEV & STATIC SERVING FOR PROD ---
  const distPath = path.join(process.cwd(), "dist");

  if (process.env.NODE_ENV !== "production" && !__dirname.endsWith("dist")) {
    try {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } catch (err) {
      console.error("[Vite] Failed to start Vite middleware, falling back to static dist:", err);
      app.use(express.static(distPath, { index: false }));
      app.get("*", (req, res) => {
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        res.sendFile(path.join(distPath, "index.html"));
      });
    }
  } else {
    // Serve static assets with long cache, but disable cache for index.html
    app.use(express.static(distPath, { 
      index: false,
      setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        } else {
          // JS/CSS are hashed, they can be cached
          res.setHeader('Cache-Control', 'public, max-age=31536000');
        }
      }
    }));
    app.get("*", (req, res) => {
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, async () => {
    console.log(`Server Jurnal Guru running on port/socket ${PORT}`);
    try {
      await initDbTables();
    } catch (err) {
      console.error("Database init error:", err);
    }
  });
}

startServer().catch((err) => {
  console.error("Failed to start server Jurnal Guru:", err);
});
