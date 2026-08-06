import { Student, LessonPlan, Attendance, Material, Task, TaskSubmission, DevelopmentProgress, DisciplineLog, TeacherProfile, AttendanceStatus, UserAccount } from "./types";
import { createSampleExcelDataUrl, createSampleImageDataUrl, createSamplePdfDataUrl } from "./lib/fileSampleUtils";

export const DEFAULT_TEACHER_PROFILE: TeacherProfile = { name: "", nip: "", school: "", subjectGroup: "" };

export const INITIAL_STUDENTS: Student[] = [];

export const INITIAL_LESSON_PLANS: LessonPlan[] = [];

// Prepopulate attendance data for the last 3 active teaching days
export const INITIAL_ATTENDANCE: Attendance[] = [];

export const INITIAL_MATERIALS: Material[] = [];

export const INITIAL_TASKS: Task[] = [];

export const INITIAL_TASK_SUBMISSIONS: TaskSubmission[] = [];

export const INITIAL_DEVELOPMENT_PROGRESS: DevelopmentProgress[] = [];

export const INITIAL_DISCIPLINE_LOGS: DisciplineLog[] = [];

export const INITIAL_USER_ACCOUNTS: UserAccount[] = [];

// Helper to prevent React Error #31 from corrupted string objects (Buffer/Uint8Array/String objects)
export const safeString = (val: any): string => {
  if (typeof val === 'string') return val;
  if (!val) return "";
  if (typeof val === 'object') {
    if (val.type === 'Buffer' && Array.isArray(val.data)) return String.fromCharCode(...val.data);
    if (val[0] !== undefined) {
      if (typeof val[0] === 'number') return String.fromCharCode(...(Object.values(val) as number[]));
      if (typeof val[0] === 'string') return Object.values(val).join('');
    }
    if (val.name) return val.name;
    return JSON.stringify(val);
  }
  return String(val);
};

// LocalStorage helpers to allow state persistence across reloads
export const loadData = <T>(key: string, defaultValue: T): T => {
  // Hanya simpan sesi login di localStorage. Buang cache data lokal lainnya (paksa pakai MySQL)
  if (key !== "app_auth_session" && key !== "active_user_role") {
    return defaultValue;
  }

  try {
    const saved = localStorage.getItem(key);
    if (!saved) return defaultValue;
    return JSON.parse(saved);
  } catch (e) {
    return defaultValue;
  }
};

export const saveData = <T>(key: string, data: T): void => {
  // Hanya simpan sesi login di localStorage. Buang cache data lokal lainnya (paksa pakai MySQL)
  if (key !== "app_auth_session" && key !== "active_user_role") {
    return;
  }

  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn("Warning: Could not save data to localStorage for key: " + key);
  }
};
