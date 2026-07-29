import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
import { createServer as createViteServer } from "vite";
import { getDbPool, isDbConnected, testDbConnectionDetailed } from "./src/db/mysql.ts";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // --- API ROUTES ---

  // Health check & DB connection status with try-catch and detailed error diagnostics
  app.get("/api/health", async (req, res) => {
    try {
      const testResult = await testDbConnectionDetailed();
      res.json({
        status: "ok",
        database: testResult.connected ? "connected" : "disconnected",
        error: testResult.error || null,
        config: {
          host: testResult.host,
          database: testResult.database,
          user: testResult.user
        }
      });
    } catch (err: any) {
      console.error("[API /api/health Error]:", err);
      res.status(500).json({
        status: "error",
        database: "disconnected",
        error: `[Server TryCatch Error] ${err.message || String(err)}`,
        config: {
          host: process.env.DB_HOST || 'Belum diisi',
          database: process.env.DB_NAME || 'Belum diisi',
          user: process.env.DB_USER || 'Belum diisi'
        }
      });
    }
  });

  // Function to initialize MySQL tables automatically
  async function initDbTables() {
    const pool = getDbPool();
    if (!pool) return false;
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS teacher_profile (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          nip VARCHAR(100) NOT NULL,
          school VARCHAR(255) NOT NULL,
          subjectGroup VARCHAR(255) NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS students (
          id VARCHAR(50) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          nisn VARCHAR(50) NOT NULL,
          className VARCHAR(100) NOT NULL,
          gender ENUM('L', 'P') NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

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
      return res.status(503).json({
        success: false,
        error: testResult.error || "Database MySQL belum terhubung.",
        config: { host: testResult.host, database: testResult.database, user: testResult.user }
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
    if (!pool) return res.status(503).json({ error: "Database MySQL tidak terhubung" });
    try {
      const [rows]: any = await pool.query("SELECT name, nip, school, subjectGroup FROM teacher_profile LIMIT 1");
      if (rows && rows.length > 0) {
        res.json(rows[0]);
      } else {
        res.json(null);
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/teacher-profile", async (req, res) => {
    const pool = getDbPool();
    if (!pool) return res.status(503).json({ error: "Database MySQL tidak terhubung" });
    const { name, nip, school, subjectGroup } = req.body;
    try {
      const [rows]: any = await pool.query("SELECT id FROM teacher_profile LIMIT 1");
      if (rows && rows.length > 0) {
        await pool.query("UPDATE teacher_profile SET name = ?, nip = ?, school = ?, subjectGroup = ? WHERE id = ?", [
          name, nip, school, subjectGroup, rows[0].id
        ]);
      } else {
        await pool.query("INSERT INTO teacher_profile (name, nip, school, subjectGroup) VALUES (?, ?, ?, ?)", [
          name, nip, school, subjectGroup
        ]);
      }
      res.json({ success: true, profile: { name, nip, school, subjectGroup } });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- STUDENTS ---
  app.get("/api/students", async (req, res) => {
    const pool = getDbPool();
    if (!pool) return res.status(503).json({ error: "Database MySQL tidak terhubung" });
    try {
      const [rows]: any = await pool.query("SELECT id, name, nisn, className, gender FROM students");
      res.json(rows);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/students", async (req, res) => {
    const pool = getDbPool();
    if (!pool) return res.status(503).json({ error: "Database MySQL tidak terhubung" });
    const { id, name, nisn, className, gender } = req.body;
    try {
      await pool.query("REPLACE INTO students (id, name, nisn, className, gender) VALUES (?, ?, ?, ?, ?)", [
        id, name, nisn, className, gender
      ]);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/students/:id", async (req, res) => {
    const pool = getDbPool();
    if (!pool) return res.status(503).json({ error: "Database MySQL tidak terhubung" });
    try {
      await pool.query("DELETE FROM students WHERE id = ?", [req.params.id]);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- LESSON PLANS ---
  app.get("/api/lesson-plans", async (req, res) => {
    const pool = getDbPool();
    if (!pool) return res.status(503).json({ error: "Database MySQL tidak terhubung" });
    try {
      const [rows]: any = await pool.query("SELECT * FROM lesson_plans");
      const formatted = rows.map((r: any) => ({
        ...r,
        materialFile: r.materialFile ? JSON.parse(r.materialFile) : null
      }));
      res.json(formatted);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/lesson-plans", async (req, res) => {
    const pool = getDbPool();
    if (!pool) return res.status(503).json({ error: "Database MySQL tidak terhubung" });
    const lp = req.body;
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
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/lesson-plans/:id", async (req, res) => {
    const pool = getDbPool();
    if (!pool) return res.status(503).json({ error: "Database MySQL tidak terhubung" });
    try {
      await pool.query("DELETE FROM lesson_plans WHERE id = ?", [req.params.id]);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- ATTENDANCE ---
  app.get("/api/attendance", async (req, res) => {
    const pool = getDbPool();
    if (!pool) return res.status(503).json({ error: "Database MySQL tidak terhubung" });
    try {
      const [rows]: any = await pool.query("SELECT * FROM attendance");
      res.json(rows);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/attendance", async (req, res) => {
    const pool = getDbPool();
    if (!pool) return res.status(503).json({ error: "Database MySQL tidak terhubung" });
    const { id, date, className, studentId, status, notes, lessonPlanId } = req.body;
    try {
      await pool.query(`
        REPLACE INTO attendance (id, date, className, studentId, status, notes, lessonPlanId)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [id, date, className, studentId, status, notes || null, lessonPlanId || null]);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Bulk save attendance
  app.post("/api/attendance/bulk", async (req, res) => {
    const pool = getDbPool();
    if (!pool) return res.status(503).json({ error: "Database MySQL tidak terhubung" });
    const items: any[] = req.body;
    if (!Array.isArray(items)) return res.status(400).json({ error: "Payload harus berupa array" });
    try {
      for (const item of items) {
        await pool.query(`
          REPLACE INTO attendance (id, date, className, studentId, status, notes, lessonPlanId)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [item.id, item.date, item.className, item.studentId, item.status, item.notes || null, item.lessonPlanId || null]);
      }
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- MATERIALS ---
  app.get("/api/materials", async (req, res) => {
    const pool = getDbPool();
    if (!pool) return res.status(503).json({ error: "Database MySQL tidak terhubung" });
    try {
      const [rows]: any = await pool.query("SELECT * FROM materials");
      const formatted = rows.map((r: any) => ({
        ...r,
        file: r.file ? JSON.parse(r.file) : null
      }));
      res.json(formatted);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/materials", async (req, res) => {
    const pool = getDbPool();
    if (!pool) return res.status(503).json({ error: "Database MySQL tidak terhubung" });
    const m = req.body;
    try {
      await pool.query(`
        REPLACE INTO materials (id, className, lessonPlanId, title, content, category, createdAt, file)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [m.id, m.className, m.lessonPlanId || null, m.title, m.content, m.category, m.createdAt, m.file ? JSON.stringify(m.file) : null]);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/materials/:id", async (req, res) => {
    const pool = getDbPool();
    if (!pool) return res.status(503).json({ error: "Database MySQL tidak terhubung" });
    try {
      await pool.query("DELETE FROM materials WHERE id = ?", [req.params.id]);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- TASKS & SUBMISSIONS ---
  app.get("/api/tasks", async (req, res) => {
    const pool = getDbPool();
    if (!pool) return res.status(503).json({ error: "Database MySQL tidak terhubung" });
    try {
      const [rows]: any = await pool.query("SELECT * FROM tasks");
      res.json(rows);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    const pool = getDbPool();
    if (!pool) return res.status(503).json({ error: "Database MySQL tidak terhubung" });
    const t = req.body;
    try {
      await pool.query(`
        REPLACE INTO tasks (id, className, title, description, maxPoints, deadline, createdAt, lessonPlanId)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [t.id, t.className, t.title, t.description, t.maxPoints || 100, t.deadline, t.createdAt, t.lessonPlanId || null]);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/task-submissions", async (req, res) => {
    const pool = getDbPool();
    if (!pool) return res.status(503).json({ error: "Database MySQL tidak terhubung" });
    try {
      const [rows]: any = await pool.query("SELECT * FROM task_submissions");
      const formatted = rows.map((r: any) => ({
        ...r,
        studentAnswerFile: r.studentAnswerFile ? JSON.parse(r.studentAnswerFile) : null
      }));
      res.json(formatted);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/task-submissions", async (req, res) => {
    const pool = getDbPool();
    if (!pool) return res.status(503).json({ error: "Database MySQL tidak terhubung" });
    const s = req.body;
    try {
      await pool.query(`
        REPLACE INTO task_submissions (id, taskId, studentId, submissionDate, status, grade, feedback, studentAnswerText, studentAnswerFile)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        s.id, s.taskId, s.studentId, s.submissionDate || null, s.status, s.grade ?? null, s.feedback || null, s.studentAnswerText || null,
        s.studentAnswerFile ? JSON.stringify(s.studentAnswerFile) : null
      ]);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- DEVELOPMENT PROGRESS ---
  app.get("/api/development-progress", async (req, res) => {
    const pool = getDbPool();
    if (!pool) return res.status(503).json({ error: "Database MySQL tidak terhubung" });
    try {
      const [rows]: any = await pool.query("SELECT * FROM development_progress");
      res.json(rows);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/development-progress", async (req, res) => {
    const pool = getDbPool();
    if (!pool) return res.status(503).json({ error: "Database MySQL tidak terhubung" });
    const p = req.body;
    try {
      await pool.query(`
        REPLACE INTO development_progress (id, studentId, date, aspect, status, notes)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [p.id, p.studentId, p.date, p.aspect, p.status, p.notes]);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- DISCIPLINE LOGS ---
  app.get("/api/discipline-logs", async (req, res) => {
    const pool = getDbPool();
    if (!pool) return res.status(503).json({ error: "Database MySQL tidak terhubung" });
    try {
      const [rows]: any = await pool.query("SELECT * FROM discipline_logs");
      res.json(rows);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/discipline-logs", async (req, res) => {
    const pool = getDbPool();
    if (!pool) return res.status(503).json({ error: "Database MySQL tidak terhubung" });
    const d = req.body;
    try {
      await pool.query(`
        REPLACE INTO discipline_logs (id, studentId, date, type, category, points, actionTaken, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [d.id, d.studentId, d.date, d.type, d.category, d.points, d.actionTaken || null, d.notes || null]);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Catch-all for API routes so missing API calls return JSON 404 instead of index.html
  app.all("/api/*", (req, res) => {
    res.status(404).json({ error: `API route ${req.originalUrl} tidak ditemukan.` });
  });

  // --- VITE MIDDLEWARE FOR DEV & STATIC SERVING FOR PROD ---
  const distPath = path.join(process.cwd(), "dist");

  if (process.env.NODE_ENV !== "production") {
    try {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } catch (err) {
      console.error("[Vite] Failed to start Vite middleware, falling back to static dist:", err);
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }
  } else {
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const isNumericPort = !isNaN(Number(PORT));
  if (isNumericPort) {
    app.listen(Number(PORT), "0.0.0.0", async () => {
      console.log(`Server Jurnal Guru running on port ${PORT}`);
      try {
        await initDbTables();
      } catch (err) {
        console.error("Database init error:", err);
      }
    });
  } else {
    // Passenger socket path
    app.listen(PORT, async () => {
      console.log(`Server Jurnal Guru running on Passenger socket ${PORT}`);
      try {
        await initDbTables();
      } catch (err) {
        console.error("Database init error:", err);
      }
    });
  }
}

startServer().catch((err) => {
  console.error("Failed to start server Jurnal Guru:", err);
});
