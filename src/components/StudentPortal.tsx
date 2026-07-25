import React, { useState } from "react";
import { 
  User, 
  GraduationCap, 
  BookOpen, 
  FileText, 
  Award, 
  Calendar, 
  Download, 
  Upload, 
  Paperclip, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle,
  LogOut, 
  ShieldCheck, 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  UserCheck, 
  TrendingUp,
  Eye
} from "lucide-react";
import { motion } from "motion/react";
import { Student, LessonPlan, Attendance, Material, Task, TaskSubmission, DisciplineLog } from "../types";
import FilePreviewModal, { PreviewableFile } from "./FilePreviewModal";

interface StudentPortalProps {
  students: Student[];
  lessonPlans: LessonPlan[];
  attendance: Attendance[];
  tasks: Task[];
  submissions: TaskSubmission[];
  disciplineLogs: DisciplineLog[];
  onSaveSubmission: (submission: TaskSubmission) => void;
}

export default function StudentPortal({
  students,
  lessonPlans,
  attendance,
  tasks,
  submissions,
  disciplineLogs,
  onSaveSubmission
}: StudentPortalProps) {
  // Login states
  const [loggedStudent, setLoggedStudent] = useState<Student | null>(() => {
    const saved = localStorage.getItem("student_logged_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [nisnInput, setNisnInput] = useState("");
  const [loginError, setLoginError] = useState("");

  // Subsections navigation inside Student Portal
  const [activeSubTab, setActiveSubTab] = useState<"materi" | "attitude">("materi");

  // Submission editing form states (per task ID)
  const [submissionTexts, setSubmissionTexts] = useState<{ [taskId: string]: string }>({});
  const [submissionFiles, setSubmissionFiles] = useState<{ [taskId: string]: { name: string; size: string; dataUrl: string } }>({});
  const [isDraggingFiles, setIsDraggingFiles] = useState<{ [taskId: string]: boolean }>({});
  const [expandedPlanIds, setExpandedPlanIds] = useState<{ [planId: string]: boolean }>({});
  const [previewFile, setPreviewFile] = useState<PreviewableFile | null>(null);

  const togglePlanExpand = (planId: string) => {
    setExpandedPlanIds(prev => ({
      ...prev,
      [planId]: !prev[planId]
    }));
  };

  const handleLogin = (nisnToUse?: string) => {
    const targetNisn = nisnToUse || nisnInput.trim();
    if (!targetNisn) {
      setLoginError("Harap masukkan NISN.");
      return;
    }

    const student = students.find(s => s.nisn === targetNisn);
    if (student) {
      setLoggedStudent(student);
      localStorage.setItem("student_logged_user", JSON.stringify(student));
      setLoginError("");
      setNisnInput("");
    } else {
      setLoginError("NISN tidak terdaftar. Periksa kembali atau pilih Akun Demo di bawah.");
    }
  };

  const handleLogout = () => {
    setLoggedStudent(null);
    localStorage.removeItem("student_logged_user");
  };

  // If no student is logged in, show the login view
  if (!loggedStudent) {
    // Quick Demo Accounts to facilitate grading and checking
    const demoStudents = students.slice(0, 4);

    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-natural-border shadow-md overflow-hidden p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="bg-natural-accent w-14 h-14 rounded-2xl flex items-center justify-center text-natural-sage mx-auto shadow-sm">
            <GraduationCap size={32} />
          </div>
          <h2 className="text-xl font-bold text-natural-dark">Portal Siswa SMKN 6 Jember</h2>
          <p className="text-xs text-slate-400">Silakan masuk menggunakan NISN Anda untuk melihat jurnal pembelajaran, tugas, dan nilai.</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-slate-600 font-bold text-xs">Nomor Induk Siswa Nasional (NISN)</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="cth: 0074128910"
                value={nisnInput}
                onChange={(e) => setNisnInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }}
                className="flex-1 bg-[#FBFBFA] border border-natural-border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-natural-sage"
              />
              <button
                onClick={() => handleLogin()}
                className="bg-natural-mid hover:bg-natural-dark text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer transition-colors"
              >
                Masuk
              </button>
            </div>
            {loginError && (
              <p className="text-[10px] text-rose-600 font-bold flex items-center gap-1">
                <AlertCircle size={12} /> {loginError}
              </p>
            )}
          </div>
        </div>

        {/* Quick Demo Login */}
        <div className="border-t border-natural-border pt-5 space-y-3">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider text-center">Akun Demo Pengujian Cepat</p>
          <div className="grid grid-cols-1 gap-2">
            {demoStudents.map(std => (
              <button
                key={std.id}
                onClick={() => handleLogin(std.nisn)}
                className="flex items-center justify-between bg-[#FBFBFA] hover:bg-natural-accent/40 border border-natural-border p-2.5 rounded-xl text-left transition-all text-xs text-natural-dark cursor-pointer group"
              >
                <div>
                  <p className="font-bold">{std.name}</p>
                  <p className="text-[10px] text-slate-400">Kelas: {std.className} | NISN: <span className="font-mono">{std.nisn}</span></p>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Logged in Student statistics computation
  const studentPlans = lessonPlans.filter(p => p.className === loggedStudent.className);
  
  // 1. Attendance percentage
  const myAttendance = attendance.filter(a => a.studentId === loggedStudent.id);
  const totalMeetings = myAttendance.length;
  const meetingsPresent = myAttendance.filter(a => a.status === "Hadir").length;
  const attendanceRate = totalMeetings > 0 ? Math.round((meetingsPresent / totalMeetings) * 100) : 100;

  // 2. Attitude Score calculation (starts at 100, maps positive & negative point shifts)
  const myDisciplineLogs = disciplineLogs.filter(d => d.studentId === loggedStudent.id);
  const totalAttitudePoints = myDisciplineLogs.reduce((acc, log) => acc + log.points, 100);
  
  let attitudeLevel = "Sangat Baik";
  if (totalAttitudePoints >= 115) attitudeLevel = "Istimewa";
  else if (totalAttitudePoints >= 100) attitudeLevel = "Sangat Baik";
  else if (totalAttitudePoints >= 85) attitudeLevel = "Baik";
  else if (totalAttitudePoints >= 70) attitudeLevel = "Cukup";
  else attitudeLevel = "Perlu Bimbingan";

  // 3. Task Completion progress
  // Get all active tasks for student's class
  const classTasks = tasks.filter(t => t.className === loggedStudent.className);
  const mySubmissions = submissions.filter(s => s.studentId === loggedStudent.id);
  const gradedTasksCount = mySubmissions.filter(s => s.status === "Selesai").length;
  const pendingTasksCount = mySubmissions.filter(s => s.status === "Menunggu Penilaian").length;
  const completedTasksCount = gradedTasksCount + pendingTasksCount;
  const unsubmittedTasksCount = Math.max(0, classTasks.length - completedTasksCount);
  const taskCompletionRate = classTasks.length > 0 ? Math.round((completedTasksCount / classTasks.length) * 100) : 100;

  // 4. Average Grades
  const gradedSubmissions = mySubmissions.filter(s => s.status === "Selesai" && s.grade !== undefined);
  const averageGrade = gradedSubmissions.length > 0 
    ? Math.round(gradedSubmissions.reduce((acc, curr) => acc + (curr.grade || 0), 0) / gradedSubmissions.length) 
    : null;

  // Form file processors for student submissions
  const processSubmissionFile = (taskId: string, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setSubmissionFiles(prev => ({
        ...prev,
        [taskId]: {
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          dataUrl: reader.result as string
        }
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmissionFileChange = (taskId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processSubmissionFile(taskId, file);
    }
  };

  const handleSubDragOver = (taskId: string, e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFiles(prev => ({ ...prev, [taskId]: true }));
  };

  const handleSubDragLeave = (taskId: string) => {
    setIsDraggingFiles(prev => ({ ...prev, [taskId]: false }));
  };

  const handleSubDrop = (taskId: string, e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFiles(prev => ({ ...prev, [taskId]: false }));
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processSubmissionFile(taskId, file);
    }
  };

  const submitAssignment = (taskId: string) => {
    const text = submissionTexts[taskId] || "";
    const file = submissionFiles[taskId] || null;

    if (!text && !file) {
      alert("Harap tuliskan jawaban / tautan pengumpulan atau unggah file tugas.");
      return;
    }

    const payload: TaskSubmission = {
      id: `sub_${taskId}_${loggedStudent.id}`,
      taskId,
      studentId: loggedStudent.id,
      submissionDate: new Date().toISOString().split("T")[0],
      status: "Menunggu Penilaian",
      studentAnswerText: text,
      studentAnswerFile: file
    };

    onSaveSubmission(payload);
    alert("Tugas berhasil dikirimkan! Menunggu penilaian dari guru.");
    
    // Clear temporary inputs for this task
    setSubmissionTexts(prev => ({ ...prev, [taskId]: "" }));
    setSubmissionFiles(prev => {
      const copy = { ...prev };
      delete copy[taskId];
      return copy;
    });
  };

  return (
    <div className="space-y-6">
      {/* Student Welcome Header Card */}
      <div className="bg-white rounded-2xl border border-natural-border p-4.5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-3xs">
        <div className="flex items-center gap-3">
          <div className="bg-natural-sage text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold">
            {loggedStudent.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-natural-dark leading-tight">{loggedStudent.name}</h2>
              <span className="bg-[#E8EDDF] text-natural-dark text-[10px] font-bold px-2 py-0.5 rounded-md font-mono">{loggedStudent.className}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">NISN: <span className="font-mono">{loggedStudent.nisn}</span> • Peran: Siswa Terautentikasi</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-1.5 border border-natural-border hover:border-rose-200 bg-[#FBFBFA] text-slate-500 hover:text-rose-600 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-3xs"
        >
          <LogOut size={14} />
          Keluar
        </button>
      </div>

      {/* Grid of Real-Time Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance widget */}
        <div className="bg-white rounded-2xl border border-natural-border p-4.5 shadow-3xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E8EDDF] text-natural-mid flex items-center justify-center shrink-0">
            <UserCheck size={18} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Persentase Presensi</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-bold text-natural-dark">{attendanceRate}%</span>
              <span className="text-[10px] text-slate-400 font-medium font-mono">({meetingsPresent}/{totalMeetings} Sesi)</span>
            </div>
          </div>
        </div>

        {/* Attitude Score widget */}
        <div className="bg-white rounded-2xl border border-natural-border p-4.5 shadow-3xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E8EDDF] text-natural-mid flex items-center justify-center shrink-0">
            <ShieldCheck size={18} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Poin Sikap / Karakter</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-bold text-natural-dark">{totalAttitudePoints}</span>
              <span className="text-[10px] text-natural-sage font-bold font-mono">({attitudeLevel})</span>
            </div>
          </div>
        </div>

        {/* Task completion widget */}
        <div className="bg-white rounded-2xl border border-natural-border p-4.5 shadow-3xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E8EDDF] text-natural-mid flex items-center justify-center shrink-0">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Penyelesaian Tugas</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-bold text-natural-dark">{taskCompletionRate}%</span>
              <span className="text-[10px] text-slate-400 font-medium font-mono">({completedTasksCount}/{classTasks.length} Tugas)</span>
            </div>
          </div>
        </div>

        {/* Average Grade widget */}
        <div className="bg-white rounded-2xl border border-natural-border p-4.5 shadow-3xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E8EDDF] text-natural-mid flex items-center justify-center shrink-0">
            <TrendingUp size={18} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Rata-rata Nilai Tugas</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-bold text-natural-dark">{averageGrade !== null ? averageGrade : "---"}</span>
              <span className="text-[10px] text-slate-400 font-medium font-mono">/100 Poin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subsection Navigation Bar */}
      <div className="flex border-b border-natural-border gap-2 text-xs">
        <button
          onClick={() => setActiveSubTab("materi")}
          className={`px-4 py-2.5 font-bold border-b-2 transition-all cursor-pointer ${
            activeSubTab === "materi" 
              ? "border-natural-mid text-natural-mid" 
              : "border-transparent text-slate-400 hover:text-natural-dark"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <BookOpen size={14} /> Jurnal & Materi Pembelajaran
          </span>
        </button>
        <button
          onClick={() => setActiveSubTab("attitude")}
          className={`px-4 py-2.5 font-bold border-b-2 transition-all cursor-pointer ${
            activeSubTab === "attitude" 
              ? "border-natural-mid text-natural-mid" 
              : "border-transparent text-slate-400 hover:text-natural-dark"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <UserCheck size={14} /> Catatan Sikap & Presensi
          </span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="space-y-4">
        {activeSubTab === "materi" && (
          <div className="space-y-4">
            <div className="bg-[#FBFBFA] border border-natural-border p-4.5 rounded-2xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-natural-dark flex items-center gap-1.5">
                    <Calendar size={14} className="text-natural-mid" /> Jadwal Semester & RPP Terintegrasi
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Timeline rancangan mengajar guru. Warna indikator menunjukkan status pengerjaan tugas Anda.
                  </p>
                </div>

                {/* Status Bar Indicators */}
                <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[10px] flex items-center gap-1">
                    <CheckCircle2 size={11} className="text-emerald-700" />
                    <span>Sudah Dikerjakan: {completedTasksCount}</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 border border-rose-300 font-bold text-[10px] flex items-center gap-1">
                    <XCircle size={11} className="text-rose-700" />
                    <span>Belum Dikerjakan: {unsubmittedTasksCount}</span>
                  </span>
                </div>
              </div>
            </div>

            {studentPlans.length > 0 ? (
              <div className="space-y-3">
                {studentPlans.map((plan, idx) => {
                  const planTask = tasks.find(t => t.lessonPlanId === plan.id);
                  const submission = planTask ? mySubmissions.find(s => s.taskId === planTask.id) : null;
                  const isExpanded = !!expandedPlanIds[plan.id];
                  
                  return (
                    <div 
                      key={plan.id}
                      className="bg-white rounded-2xl border border-natural-border overflow-hidden shadow-3xs hover:border-natural-sage/50 transition-all duration-200"
                    >
                      {/* List Tile Header (Clickable to Expand/Collapse) */}
                      <div 
                        onClick={() => togglePlanExpand(plan.id)}
                        className="p-4 sm:px-6 sm:py-4 flex items-center justify-between gap-3 cursor-pointer bg-white hover:bg-natural-accent/20 transition-colors select-none"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-natural-accent text-natural-sage font-mono font-bold flex flex-col items-center justify-center text-xs shrink-0 border border-natural-border/30">
                            <span className="text-[8px] uppercase font-bold text-slate-400 leading-none">Pert</span>
                            <span className="text-xs font-black leading-tight">{plan.week}</span>
                          </div>
                          <div className="min-w-0">
                            <span className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-wider">{plan.subject}</span>
                            <h4 className="text-xs sm:text-sm font-bold text-natural-dark leading-tight mt-0.5 truncate max-w-[200px] sm:max-w-md md:max-w-xl">{plan.topic}</h4>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                          {planTask ? (
                            submission?.status === "Selesai" ? (
                              <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 shadow-2xs">
                                <CheckCircle2 size={12} className="text-emerald-600" />
                                <span>Sudah Dikerjakan ({submission.grade} pts)</span>
                              </span>
                            ) : submission?.status === "Menunggu Penilaian" ? (
                              <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1 shadow-2xs">
                                <Clock size={12} className="text-amber-600" />
                                <span>Menunggu Penilaian</span>
                              </span>
                            ) : (
                              <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1 shadow-2xs animate-pulse">
                                <XCircle size={12} className="text-rose-600" />
                                <span>Belum Dikerjakan</span>
                              </span>
                            )
                          ) : (
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full hidden sm:inline-block ${
                              plan.status === "Completed" 
                                ? "bg-natural-accent text-natural-sage border border-natural-border/60" 
                                : "bg-slate-50 text-slate-500 border border-slate-100"
                            }`}>
                              {plan.status === "Completed" ? "Selesai" : "Rencana"}
                            </span>
                          )}
                          
                          <div className="p-1.5 rounded-lg bg-natural-accent/50 text-natural-dark hover:bg-natural-accent transition-colors">
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </div>
                        </div>
                      </div>

                      {/* Expandable Body */}
                      {isExpanded && (
                        <div className="p-4 sm:p-6 border-t border-natural-border/60 bg-[#FBFBFA]/20 space-y-4 animate-fade-in">
                          {/* Status Badge for mobile */}
                          <div className="sm:hidden flex justify-end">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              plan.status === "Completed" 
                                ? "bg-natural-accent text-natural-sage border border-natural-border/60" 
                                : "bg-slate-50 text-slate-500 border border-slate-100"
                            }`}>
                              Status: {plan.status === "Completed" ? "Selesai Terlaksana" : "Direncanakan"}
                            </span>
                          </div>

                          {/* Objectives */}
                          <div className="text-xs space-y-1">
                            <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Tujuan Pembelajaran (ATP)</span>
                            <p className="text-natural-dark font-medium leading-relaxed bg-[#FBFBFA] p-3 rounded-xl border border-natural-border shadow-3xs">
                              {plan.competency}
                            </p>
                          </div>

                          {/* Materials block */}
                          <div className="bg-[#FBFBFA]/60 p-4 rounded-xl border border-natural-border space-y-2">
                            <h5 className="font-bold text-natural-dark text-xs flex items-center gap-1.5 border-b border-natural-border/40 pb-1">
                              <BookOpen size={13} className="text-natural-mid" /> Bahan Belajar Mandiri
                            </h5>
                            
                            {plan.materialText || plan.materialFile ? (
                              <div className="space-y-3">
                                {plan.materialText && (
                                  <p className="text-slate-600 text-xs leading-relaxed font-medium whitespace-pre-line">
                                    {plan.materialText}
                                  </p>
                                )}
                                {plan.materialFile && (
                                  <div className="bg-white border border-natural-border rounded-xl p-3 flex items-center justify-between shadow-2xs">
                                    <div className="flex items-center gap-2 min-w-0">
                                      <FileText size={16} className="text-natural-sage shrink-0" />
                                      <div className="min-w-0">
                                        <p className="text-xs font-bold text-natural-dark truncate max-w-[200px] sm:max-w-xs">{plan.materialFile.name}</p>
                                        <p className="text-[10px] text-slate-400 font-mono">{plan.materialFile.size}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      <button
                                        type="button"
                                        onClick={() => setPreviewFile(plan.materialFile!)}
                                        className="bg-natural-accent hover:bg-natural-light text-natural-dark border border-natural-border font-bold text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                                        title="Pratinjau File"
                                      >
                                        <Eye size={13} />
                                        <span className="hidden sm:inline">Pratinjau</span>
                                      </button>
                                      <a
                                        href={plan.materialFile.dataUrl}
                                        download={plan.materialFile.name}
                                        className="bg-natural-mid hover:bg-natural-dark text-white p-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
                                        title="Download File Materi"
                                      >
                                        <Download size={13} />
                                      </a>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <p className="text-slate-400 italic text-xs">Belum ada lampiran modul materi dari guru.</p>
                            )}
                          </div>

                          {/* Tasks block */}
                          <div className="bg-[#FBFBFA]/60 p-4 rounded-xl border border-natural-border space-y-3">
                            <h5 className="font-bold text-natural-dark text-xs flex items-center gap-1.5 border-b border-natural-border/40 pb-1">
                              <Award size={13} className="text-natural-mid" /> Penugasan Pertemuan
                            </h5>

                            {planTask ? (
                              <div className="space-y-3 text-xs">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white px-3 py-1.5 rounded-lg border border-natural-border shadow-3xs">
                                  <span className="font-bold text-natural-dark text-xs">{planTask.title}</span>
                                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                                    <span className="bg-[#E8EDDF] text-natural-dark px-2 py-0.5 rounded font-bold font-sans">Maks Poin: {planTask.maxPoints}</span>
                                    {planTask.deadline && <span>Batas: {planTask.deadline}</span>}
                                  </div>
                                </div>

                                {planTask.description && (
                                  <p className="text-slate-600 leading-relaxed font-medium whitespace-pre-line px-1">
                                    {planTask.description}
                                  </p>
                                )}

                                {/* Student Submission Form / State Details */}
                                <div className="border-t border-natural-border/40 pt-3 mt-1">
                                  {(!submission || submission.status === "Belum Mengumpulkan") ? (
                                    <div className="space-y-3">
                                      <div className="bg-rose-100/80 border border-rose-200 text-rose-900 p-3 rounded-xl text-xs font-bold flex items-center justify-between gap-2 shadow-3xs">
                                        <div className="flex items-center gap-2">
                                          <XCircle size={16} className="text-rose-600 shrink-0" />
                                          <span>Tugas Belum Dikumpulkan</span>
                                        </div>
                                        <span className="bg-rose-200 text-rose-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-rose-300">
                                          🔴 Belum Dikerjakan
                                        </span>
                                      </div>

                                      <div className="space-y-3 bg-white p-4 rounded-xl border border-natural-border shadow-2xs">
                                        <div className="space-y-1">
                                          <label className="text-slate-600 font-bold text-xs">Jawaban Text / Tautan Tugas (GitHub, Web Link, dll)</label>
                                          <textarea
                                            value={submissionTexts[planTask.id] || ""}
                                            onChange={(e) => setSubmissionTexts(prev => ({ ...prev, [planTask.id]: e.target.value }))}
                                            placeholder="Tuliskan tautan proyek GitHub Anda, tautan hasil hosting, atau jawaban tertulis di sini..."
                                            rows={3}
                                            className="w-full bg-[#FBFBFA] border border-natural-border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-natural-sage"
                                          />
                                        </div>

                                        {/* Task File Upload */}
                                        <div className="space-y-1">
                                          <label className="text-slate-600 font-bold text-xs">Lampiran File Hasil Kerja (Format: ZIP/PDF/Doc/Screenshots)</label>
                                          <div
                                            onDragOver={(e) => handleSubDragOver(planTask.id, e)}
                                            onDragLeave={() => handleSubDragLeave(planTask.id)}
                                            onDrop={(e) => handleSubDrop(planTask.id, e)}
                                            className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                                              isDraggingFiles[planTask.id]
                                                ? "border-natural-mid bg-natural-accent"
                                                : "border-natural-border bg-[#FBFBFA] hover:bg-natural-accent/20"
                                            }`}
                                            onClick={() => document.getElementById(`sub-upload-${planTask.id}`)?.click()}
                                          >
                                            <input
                                              type="file"
                                              id={`sub-upload-${planTask.id}`}
                                              className="hidden"
                                              onChange={(e) => handleSubmissionFileChange(planTask.id, e)}
                                            />
                                            <Upload size={18} className="text-slate-400 mx-auto mb-1" />
                                            {submissionFiles[planTask.id] ? (
                                              <div className="space-y-2">
                                                <p className="text-xs font-bold text-natural-dark truncate max-w-xs mx-auto">{submissionFiles[planTask.id].name}</p>
                                                <p className="text-[10px] text-slate-400 font-mono">{submissionFiles[planTask.id].size}</p>
                                                <button
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setPreviewFile(submissionFiles[planTask.id]);
                                                  }}
                                                  className="bg-natural-accent hover:bg-natural-light text-natural-dark border border-natural-border text-[11px] font-bold px-3 py-1 rounded-lg inline-flex items-center gap-1 transition-colors cursor-pointer shadow-3xs"
                                                >
                                                  <Eye size={12} /> Pratinjau File
                                                </button>
                                              </div>
                                            ) : (
                                              <div>
                                                <p className="text-xs font-bold text-slate-600">Klik atau seret file ke sini</p>
                                                <p className="text-[9px] text-slate-400">PDF, ZIP, Word atau Gambar (Maks 10MB)</p>
                                              </div>
                                            )}
                                          </div>
                                        </div>

                                        <button
                                          onClick={() => submitAssignment(planTask.id)}
                                          className="bg-natural-mid hover:bg-natural-dark text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer transition-colors w-full sm:w-auto"
                                        >
                                          Kumpulkan Tugas
                                        </button>
                                      </div>
                                    </div>
                                  ) : submission.status === "Menunggu Penilaian" ? (
                                    <div className="space-y-3 bg-amber-50/80 border border-amber-200 p-4 rounded-xl">
                                      <div className="flex items-center justify-between gap-2 flex-wrap">
                                        <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs">
                                          <Clock size={16} className="text-amber-600" />
                                          <span>Tugas Sudah Dikumpulkan</span>
                                        </div>
                                        <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-300">
                                          🟡 Menunggu Penilaian Guru
                                        </span>
                                      </div>
                                      <div className="text-xs text-slate-600 bg-white p-3 rounded-lg border border-amber-100">
                                        <p className="font-semibold text-natural-dark">Jawaban Anda:</p>
                                        <p className="mt-1 font-mono text-[11px] bg-slate-50 p-2 rounded border text-slate-500 overflow-x-auto">{submission.studentAnswerText || "(Tidak ada jawaban tertulis)"}</p>
                                        {submission.studentAnswerFile && (
                                          <div className="mt-2.5 p-2.5 bg-[#FBFBFA] rounded-xl border border-natural-border/60 flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-1.5 min-w-0">
                                              <Paperclip size={12} className="text-natural-mid shrink-0" />
                                              <span className="text-[11px] font-bold text-natural-dark truncate">{submission.studentAnswerFile.name}</span>
                                              <span className="text-[10px] text-slate-400 font-mono">({submission.studentAnswerFile.size})</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 shrink-0">
                                              <button
                                                type="button"
                                                onClick={() => setPreviewFile(submission.studentAnswerFile!)}
                                                className="bg-natural-accent hover:bg-natural-light text-natural-dark border border-natural-border text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                                                title="Pratinjau File Modal"
                                              >
                                                <Eye size={12} /> Pratinjau
                                              </button>
                                              <a
                                                href={submission.studentAnswerFile.dataUrl}
                                                download={submission.studentAnswerFile.name}
                                                className="bg-natural-mid hover:bg-natural-dark text-white p-1 rounded-lg transition-colors cursor-pointer shrink-0"
                                                title="Unduh File"
                                              >
                                                <Download size={12} />
                                              </a>
                                            </div>
                                          </div>
                                        )}
                                        <span className="text-[9px] text-slate-400 font-mono block mt-3">Disubmit pada: {submission.submissionDate}</span>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="space-y-3 bg-emerald-50/80 border border-emerald-200 p-4 rounded-xl">
                                      <div className="flex items-center justify-between gap-2 flex-wrap">
                                        <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-xs">
                                          <CheckCircle2 size={16} className="text-emerald-600" />
                                          <span>Tugas Selesai & Dinilai</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="bg-emerald-100 text-emerald-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-300">
                                            🟢 Sudah Dikerjakan
                                          </span>
                                          <span className="bg-emerald-700 text-white font-extrabold px-3 py-1 rounded-lg text-xs shadow-3xs">
                                            Nilai: {submission.grade} / {planTask.maxPoints}
                                          </span>
                                        </div>
                                      </div>

                                      <div className="bg-white p-3 rounded-xl border border-natural-border/60 text-xs text-slate-600 space-y-2">
                                        <div>
                                          <p className="font-semibold text-natural-dark">Feedback Guru:</p>
                                          <p className="text-natural-dark mt-1 italic">
                                            "{submission.feedback || "Kerja bagus! Teruskan pertahankan kinerjanya."}"
                                          </p>
                                        </div>

                                        <div className="border-t border-slate-100 pt-2 text-[10px]">
                                          <p className="font-bold text-slate-500">Jawaban Disubmit:</p>
                                          <p className="text-slate-400 mt-0.5 truncate">{submission.studentAnswerText || "(Jawaban teks)"}</p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <p className="text-slate-400 italic text-xs">Tidak ada penugasan khusus pada pertemuan ini.</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white text-center py-16 rounded-2xl border border-natural-border flex flex-col items-center justify-center p-6 space-y-2">
                <AlertCircle size={32} className="text-slate-400" />
                <h5 className="font-bold text-natural-dark text-sm">Tidak Ada Rencana Pertemuan</h5>
                <p className="text-slate-400 text-xs">Jadwal mengajar kelas {loggedStudent.className} belum dibuat oleh guru.</p>
              </div>
            )}
          </div>
        )}


        {activeSubTab === "attitude" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Presence History */}
            <div className="bg-white rounded-2xl border border-natural-border p-4.5 shadow-3xs space-y-4">
              <h4 className="font-bold text-sm text-natural-dark flex items-center gap-1.5 border-b border-natural-border pb-2">
                <UserCheck size={16} className="text-natural-mid" /> Rekap Presensi Siswa
              </h4>
              
              {myAttendance.length > 0 ? (
                <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                  {myAttendance.map(att => (
                    <div 
                      key={att.id} 
                      className="flex items-center justify-between p-3 bg-[#FBFBFA] rounded-xl border border-natural-border text-xs"
                    >
                      <div className="space-y-0.5">
                        <p className="font-bold text-natural-dark">{att.date}</p>
                        {att.notes && <p className="text-[10px] text-slate-400">Ket: {att.notes}</p>}
                      </div>

                      <div>
                        <span className={`font-bold px-2.5 py-1 rounded-lg text-[10px] font-mono ${
                          att.status === "Hadir" ? "bg-natural-accent text-natural-sage" :
                          att.status === "Izin" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                          att.status === "Sakit" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                          "bg-rose-50 text-rose-700 border border-rose-100"
                        }`}>
                          {att.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 italic text-center py-10">Belum ada catatan presensi yang terdaftar.</p>
              )}
            </div>

            {/* Attitude Logs */}
            <div className="bg-white rounded-2xl border border-natural-border p-4.5 shadow-3xs space-y-4">
              <h4 className="font-bold text-sm text-natural-dark flex items-center gap-1.5 border-b border-natural-border pb-2">
                <ShieldCheck size={16} className="text-natural-mid" /> Jurnal Sikap & Kedisiplinan
              </h4>

              <div className="bg-[#FBFBFA] p-3 rounded-xl border border-natural-border/60 text-xs">
                <p className="font-bold text-natural-dark">Skor Kedisiplinan Saat Ini: {totalAttitudePoints}</p>
                <p className="text-slate-500 mt-1">Siswa memulai semester dengan 100 poin. Tindakan positif menambah poin, tindakan negatif/pelanggaran mengurangi poin.</p>
              </div>

              {myDisciplineLogs.length > 0 ? (
                <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1">
                  {myDisciplineLogs.map(log => (
                    <div 
                      key={log.id} 
                      className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                        log.type === "Positif" 
                          ? "bg-natural-accent/30 border-natural-border" 
                          : "bg-rose-50/40 border-rose-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-natural-dark">{log.category}</span>
                        <span className={`font-mono font-bold px-2 py-0.5 rounded text-[10px] ${
                          log.type === "Positif" ? "bg-natural-accent text-natural-sage" : "bg-rose-50 text-rose-700 border border-rose-100"
                        }`}>
                          {log.points > 0 ? `+${log.points}` : log.points} Pts
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] font-medium leading-relaxed">{log.notes}</p>
                      <p className="text-[10px] text-slate-400 font-mono">Tindakan: {log.actionTaken} • {log.date}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 italic text-center py-10">Belum ada catatan sikap khusus semester ini. Pertahankan perilaku baik!</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Global File Preview Modal for Student Portal */}
      <FilePreviewModal
        file={previewFile}
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </div>
  );
}
