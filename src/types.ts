export enum AttendanceStatus {
  HADIR = "Hadir",
  SAKIT = "Sakit",
  IZIN = "Izin",
  ALPA = "Alpa"
}

export interface Student {
  id: string;
  name: string;
  nisn: string;
  className: string;
  gender: "L" | "P";
  photoUrl?: string;
  password?: string;
  hasChangedPassword?: boolean;
}

export interface UserAccount {
  id: string;
  username: string; // NIP for Guru, NISN for Siswa, or custom login handle
  name: string;
  role: "guru" | "siswa";
  password?: string;
  studentId?: string; // links to Student.id if role is "siswa"
  nip?: string;
  className?: string;
}

export interface LessonPlan {
  id: string;
  week: number;
  semester: 1 | 2;
  subject: string;
  className: string;
  topic: string;
  competency: string; // Tujuan Pembelajaran / Kompetensi Dasar
  activities: string;
  resources: string;
  status: "Scheduled" | "Completed";
  
  // Integrated Material & Task
  materialText?: string; // keterangan awal
  materialFile?: {
    name: string;
    size: string;
    type: string;
    dataUrl: string; // base64 representation
  } | null;
  taskTitle?: string;
  taskDescription?: string;
  taskMaxPoints?: number;
  taskDeadline?: string;
}

export interface Attendance {
  id: string;
  date: string; // YYYY-MM-DD
  className: string;
  studentId: string;
  status: AttendanceStatus;
  notes?: string;
  lessonPlanId?: string;
}

export interface Material {
  id: string;
  className: string;
  lessonPlanId?: string;
  title: string;
  content: string; // rich text or link
  category: "Teori" | "Praktikum" | "Referensi";
  createdAt: string;
  file?: {
    name: string;
    size: string;
    type: string;
    dataUrl: string;
  } | null;
}

export interface Task {
  id: string;
  className: string;
  title: string;
  description: string;
  maxPoints: number;
  deadline: string;
  createdAt: string;
  lessonPlanId?: string;
}

export interface TaskSubmission {
  id: string;
  taskId: string;
  studentId: string;
  submissionDate?: string;
  status: "Belum Mengumpulkan" | "Menunggu Penilaian" | "Selesai";
  grade?: number;
  feedback?: string;
  studentAnswerText?: string;
  studentAnswerFile?: {
    name: string;
    size: string;
    dataUrl: string;
  } | null;
}

export interface DevelopmentProgress {
  id: string;
  studentId: string;
  date: string;
  aspect: "Logika Pemrograman" | "Kualitas Kode" | "UI/UX & Desain" | "Kolaborasi Tim" | "Inisiatif & Problem Solving";
  status: "Perlu Bimbingan" | "Cukup" | "Baik" | "Sangat Baik";
  notes: string;
}

export interface DisciplineLog {
  id: string;
  studentId: string;
  date: string;
  type: "Negatif" | "Positif";
  category: string; // e.g., Terlambat, Main game, Merapikan Lab, Tutor Sebaya
  points: number; // e.g., -10 atau +10
  actionTaken?: string;
  notes?: string;
}

export interface GradeRecap {
  studentId: string;
  averageTasks: number;
  uts: number;
  uas: number;
  attitudeScore: number; // starts at 100, modified by discipline logs
  finalGrade: number;
  isPassed: boolean;
}

export interface TeacherProfile {
  name: string;
  nip: string;
  school: string;
  subjectGroup: string;
}
