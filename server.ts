import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
import { createServer as createViteServer } from "vite";
import { getDbPool, isDbConnected, testDbConnectionDetailed } from "./src/db/mysql.ts";
import { 
  readJsonDb,
  getJsonTeacherProfile, saveJsonTeacherProfile,
  getJsonStudents, saveJsonStudent, deleteJsonStudent,
  getJsonLessonPlans, saveJsonLessonPlan, deleteJsonLessonPlan,
  getJsonAttendance, saveJsonAttendance, saveJsonAttendanceBulk,
  getJsonMaterials, saveJsonMaterial, deleteJsonMaterial,
  getJsonTasks, saveJsonTask, deleteJsonTask,
  getJsonTaskSubmissions, saveJsonTaskSubmission,
  getJsonDevelopmentProgress, saveJsonDevelopmentProgress, deleteJsonDevelopmentProgress,
  getJsonDisciplineLogs, saveJsonDisciplineLog, deleteJsonDisciplineLog,
  getJsonExamGrades, saveJsonExamGrade, saveJsonExamGradesBulk,
  syncAllDataToJson
} from "./src/db/jsonStore.ts";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

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
          mode: "json_server",
          message: "Server JSON Storage Aktif - Semua data tersimpan terpusat di server & dapat diakses antar-perangkat.",
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
        mode: "json_server",
        message: "Server JSON Storage Aktif - Semua data tersimpan terpusat di server.",
        mysqlError: err.message || String(err)
      });
    }
  });

  // Function to initialize MySQL tables automatically
  async function initDbTables() {
    if (!process.env.DB_HOST || !(process.env.DB_NAME || process.env.DB_DATABASE)) {
      return { success: false, mode: "json_server" };
    }
    const connected = await isDbConnected();
    if (!connected) {
      return { success: false, mode: "json_server" };
    }
    const pool = getDbPool();
    if (!pool) return { success: false, mode: "json_server" };
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
          gender ENUM('L', 'P') NOT NULL,
          photoUrl LONGTEXT NULL,
          password TEXT NULL,
          hasChangedPassword TINYINT(1) DEFAULT 0
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      try { await pool.query("ALTER TABLE students ADD COLUMN photoUrl LONGTEXT NULL"); } catch (e) {}
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
      return res.status(200).json({
        success: true,
        message: "Memakai Server JSON Storage. MySQL tidak aktif.",
        mode: "json_server"
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
        const [rows]: any = await pool.query("SELECT name, nip, school, subjectGroup FROM teacher_profile LIMIT 1");
        if (rows && rows.length > 0) return res.json(rows[0]);
      } catch (err) {
        // Fallback to JSON store silently if MySQL is offline or not created
      }
    }
    res.json(getJsonTeacherProfile());
  });

  app.post("/api/teacher-profile", async (req, res) => {
    const profile = req.body;
    saveJsonTeacherProfile(profile);
    const pool = getDbPool();
    if (pool) {
      try {
        const { name, nip, school, subjectGroup } = profile;
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
      } catch (err) {
        // Saved in JSON store
      }
    }
    res.json({ success: true, profile });
  });

  // --- STUDENTS ---
  app.get("/api/students", async (req, res) => {
    const pool = getDbPool();
    if (pool) {
      try {
        const [rows]: any = await pool.query("SELECT id, name, nisn, className, gender, photoUrl, password, hasChangedPassword FROM students");
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
    res.json(getJsonStudents());
  });

  app.post("/api/students", async (req, res) => {
    const body = req.body;
    const items = Array.isArray(body) ? body : [body];
    const pool = getDbPool();
    for (const student of items) {
      if (student && student.id) {
        saveJsonStudent(student);
        if (pool) {
          try {
            const { id, name, nisn, className, gender, photoUrl, password, hasChangedPassword } = student;
            await pool.query(
              "REPLACE INTO students (id, name, nisn, className, gender, photoUrl, password, hasChangedPassword) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", 
              [id, name, nisn, className, gender, photoUrl || null, password || null, hasChangedPassword ? 1 : 0]
            );
          } catch (err) {
            // Saved in JSON store
          }
        }
      }
    }
    res.json({ success: true });
  });

  app.delete("/api/students/:id", async (req, res) => {
    deleteJsonStudent(req.params.id);
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
    res.json(getJsonLessonPlans());
  });

  app.post("/api/lesson-plans", async (req, res) => {
    const lp = req.body;
    saveJsonLessonPlan(lp);
    const pool = getDbPool();
    if (pool) {
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
        // Saved in JSON store
      }
    }
    res.json({ success: true });
  });

  app.delete("/api/lesson-plans/:id", async (req, res) => {
    deleteJsonLessonPlan(req.params.id);
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
        if (rows && rows.length > 0) return res.json(rows);
      } catch (err) {
        // Fallback to JSON store
      }
    }
    res.json(getJsonAttendance());
  });

  app.post("/api/attendance", async (req, res) => {
    const att = req.body;
    saveJsonAttendance(att);
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
      saveJsonAttendanceBulk(items);
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
    res.json(getJsonMaterials());
  });

  app.post("/api/materials", async (req, res) => {
    const m = req.body;
    saveJsonMaterial(m);
    const pool = getDbPool();
    if (pool) {
      try {
        await pool.query(`
          REPLACE INTO materials (id, className, lessonPlanId, title, content, category, createdAt, file)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [m.id, m.className, m.lessonPlanId || null, m.title, m.content, m.category, m.createdAt, m.file ? JSON.stringify(m.file) : null]);
      } catch (err) {
        // Saved in JSON store
      }
    }
    res.json({ success: true });
  });

  app.delete("/api/materials/:id", async (req, res) => {
    deleteJsonMaterial(req.params.id);
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
        if (rows && rows.length > 0) return res.json(rows);
      } catch (err) {
        // Fallback to JSON store
      }
    }
    res.json(getJsonTasks());
  });

  app.post("/api/tasks", async (req, res) => {
    const t = req.body;
    saveJsonTask(t);
    const pool = getDbPool();
    if (pool) {
      try {
        await pool.query(`
          REPLACE INTO tasks (id, className, title, description, maxPoints, deadline, createdAt, lessonPlanId)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [t.id, t.className, t.title, t.description, t.maxPoints || 100, t.deadline, t.createdAt, t.lessonPlanId || null]);
      } catch (err) {
        // Saved in JSON store
      }
    }
    res.json({ success: true });
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    deleteJsonTask(req.params.id);
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
    res.json(getJsonTaskSubmissions());
  });

  app.post("/api/task-submissions", async (req, res) => {
    const s = req.body;
    saveJsonTaskSubmission(s);
    const pool = getDbPool();
    if (pool) {
      try {
        await pool.query(`
          REPLACE INTO task_submissions (id, taskId, studentId, submissionDate, status, grade, feedback, studentAnswerText, studentAnswerFile)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          s.id, s.taskId, s.studentId, s.submissionDate || null, s.status, s.grade ?? null, s.feedback || null, s.studentAnswerText || null,
          s.studentAnswerFile ? JSON.stringify(s.studentAnswerFile) : null
        ]);
      } catch (err) {
        // Saved in JSON store
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
        if (rows && rows.length > 0) return res.json(rows);
      } catch (err) {
        // Fallback to JSON store
      }
    }
    res.json(getJsonDevelopmentProgress());
  });

  app.post("/api/development-progress", async (req, res) => {
    const p = req.body;
    saveJsonDevelopmentProgress(p);
    const pool = getDbPool();
    if (pool) {
      try {
        await pool.query(`
          REPLACE INTO development_progress (id, studentId, date, aspect, status, notes)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [p.id, p.studentId, p.date, p.aspect, p.status, p.notes]);
      } catch (err) {
        // Saved in JSON store
      }
    }
    res.json({ success: true });
  });

  app.delete("/api/development-progress/:id", async (req, res) => {
    deleteJsonDevelopmentProgress(req.params.id);
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
        if (rows && rows.length > 0) return res.json(rows);
      } catch (err) {
        // Fallback to JSON store
      }
    }
    res.json(getJsonDisciplineLogs());
  });

  app.post("/api/discipline-logs", async (req, res) => {
    const d = req.body;
    saveJsonDisciplineLog(d);
    const pool = getDbPool();
    if (pool) {
      try {
        await pool.query(`
          REPLACE INTO discipline_logs (id, studentId, date, type, category, points, actionTaken, notes)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [d.id, d.studentId, d.date, d.type, d.category, d.points, d.actionTaken || null, d.notes || null]);
      } catch (err) {
        // Saved in JSON store
      }
    }
    res.json({ success: true });
  });

  app.delete("/api/discipline-logs/:id", async (req, res) => {
    deleteJsonDisciplineLog(req.params.id);
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
    res.json(getJsonExamGrades());
  });

  app.post("/api/exam-grades", (req, res) => {
    const body = req.body;
    if (body.studentId) {
      saveJsonExamGrade(body.studentId, body.uts, body.uas);
    } else if (typeof body === "object") {
      saveJsonExamGradesBulk(body);
    }
    res.json({ success: true });
  });

  // --- SYNC ALL DATA ENDPOINT ---
  app.post("/api/sync-all", (req, res) => {
    try {
      const synced = syncAllDataToJson(req.body);
      res.json({ success: true, data: synced });
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
