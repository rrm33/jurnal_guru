import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "app_db.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.error("Failed to create data directory:", err);
  }
}

interface JsonDbData {
  teacherProfile: any | null;
  students: any[];
  lessonPlans: any[];
  attendance: any[];
  materials: any[];
  tasks: any[];
  taskSubmissions: any[];
  developmentProgress: any[];
  disciplineLogs: any[];
}

function getInitialDbData(): JsonDbData {
  return {
    teacherProfile: null,
    students: [],
    lessonPlans: [],
    attendance: [],
    materials: [],
    tasks: [],
    taskSubmissions: [],
    developmentProgress: [],
    disciplineLogs: []
  };
}

export function readJsonDb(): JsonDbData {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      if (raw.trim()) {
        const parsed = JSON.parse(raw);
        return {
          teacherProfile: parsed.teacherProfile || null,
          students: Array.isArray(parsed.students) ? parsed.students : [],
          lessonPlans: Array.isArray(parsed.lessonPlans) ? parsed.lessonPlans : [],
          attendance: Array.isArray(parsed.attendance) ? parsed.attendance : [],
          materials: Array.isArray(parsed.materials) ? parsed.materials : [],
          tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
          taskSubmissions: Array.isArray(parsed.taskSubmissions) ? parsed.taskSubmissions : [],
          developmentProgress: Array.isArray(parsed.developmentProgress) ? parsed.developmentProgress : [],
          disciplineLogs: Array.isArray(parsed.disciplineLogs) ? parsed.disciplineLogs : []
        };
      }
    }
  } catch (err) {
    console.error("[JSON DB] Error reading DB file:", err);
  }
  const initial = getInitialDbData();
  writeJsonDb(initial);
  return initial;
}

export function writeJsonDb(data: JsonDbData): boolean {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("[JSON DB] Error writing DB file:", err);
    return false;
  }
}

// Entity helper methods
export function getJsonTeacherProfile() {
  const db = readJsonDb();
  return db.teacherProfile;
}

export function saveJsonTeacherProfile(profile: any) {
  const db = readJsonDb();
  db.teacherProfile = profile;
  writeJsonDb(db);
  return profile;
}

export function getJsonStudents() {
  const db = readJsonDb();
  return db.students;
}

export function saveJsonStudent(student: any) {
  const db = readJsonDb();
  const idx = db.students.findIndex(s => s.id === student.id);
  if (idx >= 0) {
    db.students[idx] = { ...db.students[idx], ...student };
  } else {
    db.students.push(student);
  }
  writeJsonDb(db);
  return student;
}

export function deleteJsonStudent(id: string) {
  const db = readJsonDb();
  db.students = db.students.filter(s => s.id !== id);
  writeJsonDb(db);
  return true;
}

export function getJsonLessonPlans() {
  const db = readJsonDb();
  return db.lessonPlans;
}

export function saveJsonLessonPlan(plan: any) {
  const db = readJsonDb();
  const idx = db.lessonPlans.findIndex(p => p.id === plan.id);
  if (idx >= 0) {
    db.lessonPlans[idx] = { ...db.lessonPlans[idx], ...plan };
  } else {
    db.lessonPlans.push(plan);
  }
  writeJsonDb(db);
  return plan;
}

export function deleteJsonLessonPlan(id: string) {
  const db = readJsonDb();
  db.lessonPlans = db.lessonPlans.filter(p => p.id !== id);
  writeJsonDb(db);
  return true;
}

export function getJsonAttendance() {
  const db = readJsonDb();
  return db.attendance;
}

export function saveJsonAttendance(att: any) {
  const db = readJsonDb();
  const idx = db.attendance.findIndex(a => a.id === att.id);
  if (idx >= 0) {
    db.attendance[idx] = { ...db.attendance[idx], ...att };
  } else {
    db.attendance.push(att);
  }
  writeJsonDb(db);
  return att;
}

export function saveJsonAttendanceBulk(items: any[]) {
  const db = readJsonDb();
  for (const att of items) {
    const idx = db.attendance.findIndex(a => a.id === att.id);
    if (idx >= 0) {
      db.attendance[idx] = { ...db.attendance[idx], ...att };
    } else {
      db.attendance.push(att);
    }
  }
  writeJsonDb(db);
  return true;
}

export function getJsonMaterials() {
  const db = readJsonDb();
  return db.materials;
}

export function saveJsonMaterial(mat: any) {
  const db = readJsonDb();
  const idx = db.materials.findIndex(m => m.id === mat.id);
  if (idx >= 0) {
    db.materials[idx] = { ...db.materials[idx], ...mat };
  } else {
    db.materials.push(mat);
  }
  writeJsonDb(db);
  return mat;
}

export function deleteJsonMaterial(id: string) {
  const db = readJsonDb();
  db.materials = db.materials.filter(m => m.id !== id);
  writeJsonDb(db);
  return true;
}

export function getJsonTasks() {
  const db = readJsonDb();
  return db.tasks;
}

export function saveJsonTask(task: any) {
  const db = readJsonDb();
  const idx = db.tasks.findIndex(t => t.id === task.id);
  if (idx >= 0) {
    db.tasks[idx] = { ...db.tasks[idx], ...task };
  } else {
    db.tasks.push(task);
  }
  writeJsonDb(db);
  return task;
}

export function getJsonTaskSubmissions() {
  const db = readJsonDb();
  return db.taskSubmissions;
}

export function saveJsonTaskSubmission(sub: any) {
  const db = readJsonDb();
  const idx = db.taskSubmissions.findIndex(s => s.id === sub.id);
  if (idx >= 0) {
    db.taskSubmissions[idx] = { ...db.taskSubmissions[idx], ...sub };
  } else {
    db.taskSubmissions.push(sub);
  }
  writeJsonDb(db);
  return sub;
}

export function getJsonDevelopmentProgress() {
  const db = readJsonDb();
  return db.developmentProgress;
}

export function saveJsonDevelopmentProgress(prog: any) {
  const db = readJsonDb();
  const idx = db.developmentProgress.findIndex(p => p.id === prog.id);
  if (idx >= 0) {
    db.developmentProgress[idx] = { ...db.developmentProgress[idx], ...prog };
  } else {
    db.developmentProgress.push(prog);
  }
  writeJsonDb(db);
  return prog;
}

export function getJsonDisciplineLogs() {
  const db = readJsonDb();
  return db.disciplineLogs;
}

export function saveJsonDisciplineLog(disc: any) {
  const db = readJsonDb();
  const idx = db.disciplineLogs.findIndex(d => d.id === disc.id);
  if (idx >= 0) {
    db.disciplineLogs[idx] = { ...db.disciplineLogs[idx], ...disc };
  } else {
    db.disciplineLogs.push(disc);
  }
  writeJsonDb(db);
  return disc;
}

// Bulk sync endpoint helper
export function syncAllDataToJson(allData: Partial<JsonDbData>) {
  const db = readJsonDb();
  if (allData.teacherProfile) db.teacherProfile = allData.teacherProfile;
  if (Array.isArray(allData.students) && allData.students.length > 0) db.students = allData.students;
  if (Array.isArray(allData.lessonPlans) && allData.lessonPlans.length > 0) db.lessonPlans = allData.lessonPlans;
  if (Array.isArray(allData.attendance) && allData.attendance.length > 0) db.attendance = allData.attendance;
  if (Array.isArray(allData.materials) && allData.materials.length > 0) db.materials = allData.materials;
  if (Array.isArray(allData.tasks) && allData.tasks.length > 0) db.tasks = allData.tasks;
  if (Array.isArray(allData.taskSubmissions) && allData.taskSubmissions.length > 0) db.taskSubmissions = allData.taskSubmissions;
  if (Array.isArray(allData.developmentProgress) && allData.developmentProgress.length > 0) db.developmentProgress = allData.developmentProgress;
  if (Array.isArray(allData.disciplineLogs) && allData.disciplineLogs.length > 0) db.disciplineLogs = allData.disciplineLogs;
  writeJsonDb(db);
  return db;
}
