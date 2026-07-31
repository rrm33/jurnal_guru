import React, { useState, useMemo, useEffect } from "react";
import { Check, Edit, Star, TrendingUp, Filter, Award, Save, AlertCircle, Plus, Paperclip, X, Download, Eye, CheckCircle, Clock, XCircle } from "lucide-react";
import { Student, Task, TaskSubmission, DevelopmentProgress } from "../types";
import FilePreviewModal, { PreviewableFile } from "./FilePreviewModal";

interface StudentProgressProps {
  students: Student[];
  tasks: Task[];
  submissions: TaskSubmission[];
  developmentLogs: DevelopmentProgress[];
  onSaveSubmission: (sub: TaskSubmission) => void;
  onAddDevLog: (log: DevelopmentProgress) => void;
  onDeleteDevLog: (id: string) => void;
  classes: string[];
  initialProgressClass?: string;
  initialProgressTaskId?: string;
  onClearInitialProgress?: () => void;
  onSelectStudentPhoto?: (student: Student) => void;
}

export default function StudentProgress({
  students,
  tasks,
  submissions,
  developmentLogs,
  onSaveSubmission,
  onAddDevLog,
  onDeleteDevLog,
  classes,
  initialProgressClass,
  initialProgressTaskId,
  onClearInitialProgress,
  onSelectStudentPhoto
}: StudentProgressProps) {
  const [activeTab, setActiveTab] = useState<"tasks" | "development">("tasks");
  const [selectedClass, setSelectedClass] = useState<string>(classes[0] || "XI RPL 1");
  const [previewFile, setPreviewFile] = useState<PreviewableFile | null>(null);

  // --- SUB-TAB: TASK GRADING STATE ---
  const classTasks = useMemo(() => {
    return tasks.filter(t => t.className === selectedClass);
  }, [tasks, selectedClass]);

  const [selectedTaskId, setSelectedTaskId] = useState<string>("");

  useEffect(() => {
    if (initialProgressClass) {
      setSelectedClass(initialProgressClass);
    }
    if (initialProgressTaskId) {
      setSelectedTaskId(initialProgressTaskId);
    }
    if (initialProgressClass || initialProgressTaskId) {
      setActiveTab("tasks");
      onClearInitialProgress?.();
    }
  }, [initialProgressClass, initialProgressTaskId]);

  // Sync selected task when class changes
  const activeTaskId = useMemo(() => {
    if (selectedTaskId && classTasks.some(t => t.id === selectedTaskId)) {
      return selectedTaskId;
    }
    return classTasks[0]?.id || "";
  }, [classTasks, selectedTaskId]);

  const activeTaskObj = useMemo(() => {
    return tasks.find(t => t.id === activeTaskId);
  }, [tasks, activeTaskId]);

  const classStudents = useMemo(() => {
    return students.filter(s => s.className === selectedClass);
  }, [students, selectedClass]);

  // Map submissions for easy lookup
  const taskSubmissionsMap = useMemo(() => {
    const map: { [studentId: string]: TaskSubmission } = {};
    submissions.forEach(sub => {
      if (sub.taskId === activeTaskId) {
        map[sub.studentId] = sub;
      }
    });
    return map;
  }, [submissions, activeTaskId]);

  // Inline grading form state
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [grade, setGrade] = useState<number>(100);
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState<TaskSubmission["status"]>("Selesai");

  const startGrading = (stdId: string, currentSub?: TaskSubmission) => {
    setEditingStudentId(stdId);
    setGrade(currentSub?.grade ?? 100);
    setFeedback(currentSub?.feedback ?? "");
    setStatus(currentSub?.status ?? "Selesai");
  };

  const handleSaveGrade = (studentId: string) => {
    const existing = taskSubmissionsMap[studentId];
    const payload: TaskSubmission = {
      id: existing ? existing.id : `sub_${Date.now()}_${studentId}`,
      taskId: activeTaskId,
      studentId,
      submissionDate: existing?.submissionDate || new Date().toISOString().split("T")[0],
      status,
      grade: status === "Selesai" ? grade : undefined,
      feedback: feedback
    };

    onSaveSubmission(payload);
    setEditingStudentId(null);
  };

  // --- SUBMISSION DETAILED REVIEW MODAL STATE ---
  const [reviewingStudentId, setReviewingStudentId] = useState<string | null>(null);
  const [reviewGrade, setReviewGrade] = useState<number>(100);
  const [reviewFeedback, setReviewFeedback] = useState("");
  const [reviewStatus, setReviewStatus] = useState<TaskSubmission["status"]>("Selesai");

  const openReviewModal = (stdId: string, currentSub?: TaskSubmission) => {
    setReviewingStudentId(stdId);
    
    let defaultGrade = 0;
    if (currentSub?.status === "Selesai" && currentSub.grade !== undefined) {
      defaultGrade = currentSub.grade;
    }
    
    setReviewGrade(defaultGrade);
    setReviewFeedback(currentSub?.feedback ?? "");
    setReviewStatus(currentSub?.status ?? "Selesai");
  };

  // --- SUB-TAB: HOLISTIC DEVELOPMENT STATE ---
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");

  const activeStudentId = useMemo(() => {
    if (selectedStudentId && classStudents.some(s => s.id === selectedStudentId)) {
      return selectedStudentId;
    }
    return classStudents[0]?.id || "";
  }, [classStudents, selectedStudentId]);

  const activeStudentObj = useMemo(() => {
    return students.find(s => s.id === activeStudentId);
  }, [students, activeStudentId]);

  // Development logs for the active student
  const studentDevLogs = useMemo(() => {
    return developmentLogs
      .filter(l => l.studentId === activeStudentId)
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [developmentLogs, activeStudentId]);

  // New log form state
  const [newLogAspect, setNewLogAspect] = useState<DevelopmentProgress["aspect"]>("Logika Pemrograman");
  const [newLogStatus, setNewLogStatus] = useState<DevelopmentProgress["status"]>("Baik");
  const [newLogNotes, setNewLogNotes] = useState("");

  const handleAddLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogNotes) {
      alert("Harap tuliskan catatan observasi perkembangan.");
      return;
    }

    const payload: DevelopmentProgress = {
      id: `dev_${Date.now()}`,
      studentId: activeStudentId,
      date: new Date().toISOString().split("T")[0],
      aspect: newLogAspect,
      status: newLogStatus,
      notes: newLogNotes
    };

    onAddDevLog(payload);
    setNewLogNotes("");
    alert("Progres perkembangan siswa berhasil dicatat!");
  };

  return (
    <div id="progress-root" className="space-y-6">
      {/* Tab Select & Class Select Header */}
      <div className="bg-white p-4.5 rounded-2xl border border-natural-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("tasks")}
            className={`px-4.5 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === "tasks"
                ? "bg-natural-mid text-white shadow-sm"
                : "bg-natural-accent hover:bg-natural-light text-natural-dark border border-natural-border"
            }`}
          >
            Penilaian & Pengumpulan Tugas
          </button>
          <button
            onClick={() => setActiveTab("development")}
            className={`px-4.5 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === "development"
                ? "bg-natural-mid text-white shadow-sm"
                : "bg-natural-accent hover:bg-natural-light text-natural-dark border border-natural-border"
            }`}
          >
            Progres & Karakter Siswa
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
          <span className="text-xs text-slate-400 font-bold uppercase shrink-0">Kelas:</span>
          <div className="flex gap-2 overflow-x-auto pb-1 max-w-[250px] md:max-w-md no-scrollbar">
            {classes.map(c => (
              <button
                key={c}
                onClick={() => {
                  setSelectedClass(c);
                  setEditingStudentId(null);
                }}
                className={`shrink-0 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  selectedClass === c 
                    ? "bg-[#2C3E2D] text-white"
                    : "bg-natural-accent hover:bg-natural-light text-natural-dark border border-natural-border"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- CONTENT FOR TAB 1: TASK GRADING --- */}
      {activeTab === "tasks" && (
        <div className="space-y-6">
          
          {/* Stats Bar */}
          {activeTaskObj && (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-natural-border shadow-3xs flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Total Tugas Kelas</span>
                <span className="text-2xl font-black text-natural-dark">{classTasks.length}</span>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl shadow-3xs flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-emerald-600 uppercase font-bold">Mengerjakan (Selesai/Menunggu)</span>
                <span className="text-2xl font-black text-emerald-700">
                  {classStudents.filter(s => taskSubmissionsMap[s.id]?.status === "Selesai" || taskSubmissionsMap[s.id]?.status === "Menunggu Penilaian").length}
                </span>
              </div>
              <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl shadow-3xs flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-rose-600 uppercase font-bold">Belum Mengerjakan</span>
                <span className="text-2xl font-black text-rose-700">
                  {classStudents.filter(s => !taskSubmissionsMap[s.id] || taskSubmissionsMap[s.id]?.status === "Belum Mengumpulkan").length}
                </span>
              </div>
            </div>
          )}

          {/* Task picker */}
          <div className="bg-[#FBFBFA] border border-natural-border rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Pilih Tugas yang Akan Dinilai</span>
              {classTasks.length > 0 ? (
                <select
                  value={activeTaskId}
                  onChange={(e) => {
                    setSelectedTaskId(e.target.value);
                    setEditingStudentId(null);
                  }}
                  className="bg-white border border-natural-border text-natural-dark text-xs font-semibold rounded-xl px-4 py-2 focus:outline-none focus:ring-1 focus:ring-natural-sage cursor-pointer"
                >
                  {classTasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                </select>
              ) : (
                <p className="text-xs text-rose-600 font-bold flex items-center gap-1">
                  <AlertCircle size={14} /> Belum ada tugas untuk kelas ini. Buat terlebih dahulu di menu Bahan Ajar!
                </p>
              )}
            </div>

            {activeTaskObj && (
              <div className="text-xs space-y-1 text-natural-dark bg-white p-3 rounded-xl border border-natural-border">
                <p className="font-bold text-natural-dark">Detail Penugasan:</p>
                <p className="line-clamp-2">{activeTaskObj.description}</p>
                <div className="flex gap-4 pt-1 text-[10px] text-slate-400 font-mono">
                  <span>Maks Poin: {activeTaskObj.maxPoints}</span>
                  <span>Batas: {activeTaskObj.deadline}</span>
                </div>
              </div>
            )}
          </div>

          {/* Table list of students for this task */}
          {activeTaskId && (
            <div className="bg-white rounded-2xl border border-natural-border shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-natural-accent/60 border-b border-natural-border/70 text-natural-dark font-bold text-xs uppercase tracking-wider">
                      <th className="py-3 px-4.5">Nama Siswa</th>
                      <th className="py-3 px-4.5">Status Kirim</th>
                      <th className="py-3 px-4.5">Skor / Nilai</th>
                      <th className="py-3 px-4.5">Catatan Masukan (Feedback)</th>
                      <th className="py-3 px-4.5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-natural-border/40">
                    {classStudents.map((student) => {
                      const submission = taskSubmissionsMap[student.id];

                      let statusBadge = "bg-rose-100 text-rose-800 border border-rose-300 font-bold";
                      let statusText = "Belum Mengumpulkan";
                      if (submission?.status === "Selesai") {
                        statusBadge = "bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold";
                        statusText = "Sudah Dikerjakan (Dinilai)";
                      } else if (submission?.status === "Menunggu Penilaian") {
                        statusBadge = "bg-amber-100 text-amber-800 border border-amber-300 animate-pulse font-extrabold";
                        statusText = "Menunggu Penilaian";
                      }

                      return (
                        <tr key={student.id} className="hover:bg-[#FBFBFA]/30 transition-colors text-xs">
                          <td className="py-4 px-4.5">
                            <div className="flex items-center gap-2.5">
                              <button
                                onClick={() => onSelectStudentPhoto && onSelectStudentPhoto(student)}
                                className="shrink-0 cursor-pointer group"
                                title="Klik untuk lihat foto besar"
                              >
                                {student.photoUrl ? (
                                  <img src={student.photoUrl} alt={student.name} className="w-8 h-8 rounded-full object-cover border border-natural-border group-hover:scale-110 transition-transform" />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-natural-sage/20 text-natural-sage font-bold text-xs flex items-center justify-center group-hover:scale-110 transition-transform">
                                    {student.name.charAt(0)}
                                  </div>
                                )}
                              </button>
                              <div>
                                <span className="font-semibold text-natural-dark block">{student.name}</span>
                                <span className="text-[10px] text-slate-400 font-mono">NISN: {student.nisn}</span>
                              </div>
                            </div>
                            
                            {submission?.studentAnswerText && (
                              <div className="mt-1.5 p-2 bg-[#FBFBFA] rounded-lg border border-natural-border shadow-3xs max-w-xs">
                                <p className="text-[9px] font-bold text-natural-mid uppercase tracking-wide">Cuplikan Jawaban:</p>
                                <p className="text-[10px] text-slate-500 truncate">{submission.studentAnswerText}</p>
                              </div>
                            )}
                            {submission?.studentAnswerFile && (
                              <div className="mt-1.5 flex items-center justify-between gap-1.5 text-[10px] text-slate-500 bg-natural-accent/50 border border-natural-border/60 rounded-lg px-2 py-1 max-w-[200px]">
                                <div className="flex items-center gap-1 min-w-0">
                                  <Paperclip size={10} className="text-natural-mid shrink-0" />
                                  <span className="font-bold text-natural-dark truncate">{submission.studentAnswerFile.name}</span>
                                </div>
                                <button
                                  onClick={() => setPreviewFile(submission.studentAnswerFile!)}
                                  className="text-natural-mid hover:text-natural-dark font-bold p-0.5 hover:bg-natural-accent rounded transition-colors shrink-0 cursor-pointer flex items-center gap-0.5"
                                  title="Pratinjau File Tanpa Download"
                                >
                                  <Eye size={12} />
                                </button>
                              </div>
                            )}
                          </td>

                          {/* Status */}
                          <td className="py-4 px-4.5">
                            <span className={`px-2.5 py-1 rounded-lg text-[10px] inline-flex items-center gap-1.5 shadow-3xs ${statusBadge}`}>
                              {submission?.status === "Selesai" ? (
                                <CheckCircle size={12} className="text-emerald-700 shrink-0" />
                              ) : submission?.status === "Menunggu Penilaian" ? (
                                <Clock size={12} className="text-amber-700 shrink-0" />
                              ) : (
                                <XCircle size={12} className="text-rose-700 shrink-0" />
                              )}
                              <span>{statusText}</span>
                            </span>
                          </td>

                          {/* Grade */}
                          <td className="py-4 px-4.5">
                            <span className="font-mono font-bold text-sm text-natural-dark">
                              {submission?.status === "Selesai" ? submission.grade : (submission?.status === "Menunggu Penilaian" ? "0" : "-")}
                            </span>
                          </td>

                          {/* Feedback text */}
                          <td className="py-4 px-4.5 max-w-xs">
                            <p className="text-slate-500 italic line-clamp-2">
                              {submission?.feedback || "-"}
                            </p>
                          </td>

                          {/* Detailed Review Action */}
                          <td className="py-4 px-4.5 text-right shrink-0">
                            <button
                              onClick={() => openReviewModal(student.id, submission)}
                              className={`px-3 py-1.5 rounded-lg border text-xs font-bold inline-flex items-center gap-1 cursor-pointer transition-colors ${
                                submission?.status === "Menunggu Penilaian"
                                  ? "bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300 animate-pulse font-extrabold"
                                  : "bg-natural-accent hover:bg-natural-light text-natural-dark border-natural-border"
                              }`}
                              title="Review Jawaban & Beri Nilai"
                            >
                              <Eye size={13} />
                              <span>Review & Nilai</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- CONTENT FOR TAB 2: DEVELOPMENT LOGS --- */}
      {activeTab === "development" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left panel: student picker and new log entry */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-natural-border shadow-xs space-y-4">
              <h4 className="text-natural-dark font-bold text-sm">Catat Karakter & Progres</h4>
              
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Pilih Siswa RPL</span>
                <select
                  value={activeStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full bg-natural-accent border border-natural-border text-natural-dark text-xs font-semibold rounded-xl px-3.5 py-2 focus:outline-none cursor-pointer"
                >
                  {classStudents.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              {activeStudentObj && (
                <form onSubmit={handleAddLogSubmit} className="space-y-4 pt-3 border-t border-natural-border/40">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Aspek Penilaian</span>
                    <select
                      value={newLogAspect}
                      onChange={(e) => setNewLogAspect(e.target.value as any)}
                      className="w-full bg-white border border-natural-border text-natural-dark text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-natural-sage"
                    >
                      <option value="Logika Pemrograman">Logika Pemrograman (Algoritma)</option>
                      <option value="Kualitas Kode">Kualitas Kode (Indentasi & Keberlakuan)</option>
                      <option value="UI/UX & Desain">UI/UX & Desain Antarmuka</option>
                      <option value="Kolaborasi Tim">Kolaborasi Tim (Soft Skill)</option>
                      <option value="Inisiatif & Problem Solving">Inisiatif & Pemecahan Masalah</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Status Capaian</span>
                    <div className="grid grid-cols-2 gap-2">
                      {["Perlu Bimbingan", "Cukup", "Baik", "Sangat Baik"].map((capaian) => {
                        const isSel = newLogStatus === capaian;
                        return (
                          <button
                            key={capaian}
                            type="button"
                            onClick={() => setNewLogStatus(capaian as any)}
                            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              isSel 
                                ? "bg-natural-accent text-natural-dark border-natural-sage/50 shadow-2xs" 
                                : "bg-white text-slate-500 border border-natural-border hover:bg-[#FBFBFA]"
                            }`}
                          >
                            {capaian}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Catatan Guru (Observasi Nyata)</span>
                    <textarea
                      value={newLogNotes}
                      onChange={(e) => setNewLogNotes(e.target.value)}
                      placeholder="cth: Menguasai rekursif dengan sangat cepat dan sabar mengajari kawannya yang kesulitan..."
                      rows={3}
                      className="w-full bg-white border border-natural-border rounded-xl p-3 text-xs focus:outline-none focus:border-natural-sage font-medium text-natural-dark"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-natural-mid hover:bg-natural-dark text-white text-xs font-bold rounded-xl py-2.5 transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Plus size={15} /> Simpan Catatan Progres
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right panel: Timeline of logs for active student */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-natural-border shadow-xs">
              <h4 className="text-natural-dark font-bold text-sm mb-4">
                Timeline Perkembangan: {activeStudentObj?.name || "Pilih Siswa"}
              </h4>

              <div className="relative border-l border-natural-border/60 pl-4 space-y-6">
                {studentDevLogs.length > 0 ? (
                  studentDevLogs.map((log) => {
                    let statusColor = "bg-slate-100 text-slate-600";
                    if (log.status === "Sangat Baik") statusColor = "bg-[#8DA47E]/10 text-natural-dark border border-[#8DA47E]/20";
                    else if (log.status === "Baik") statusColor = "bg-[#E8EDDF] text-natural-mid border border-natural-border";
                    else if (log.status === "Cukup") statusColor = "bg-amber-50 text-amber-800 border border-amber-100";
                    else statusColor = "bg-rose-50 text-rose-800 border border-rose-100 animate-pulse";

                    return (
                      <div key={log.id} className="relative space-y-1.5">
                        {/* Dot on line */}
                        <span className="absolute -left-[21px] top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-natural-sage flex items-center justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-natural-mid"></span>
                        </span>

                        <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                          <span className="font-bold text-natural-dark">{log.aspect}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{log.date}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${statusColor}`}>
                            {log.status}
                          </span>
                        </div>

                        <p className="text-natural-dark text-xs bg-[#FBFBFA] p-3 rounded-xl border border-natural-border whitespace-pre-line font-medium leading-relaxed shadow-3xs">
                          {log.notes}
                        </p>

                        <div className="flex justify-end">
                          <button
                            onClick={() => {
                              if (confirm("Hapus catatan progres perkembangan ini?")) {
                                onDeleteDevLog(log.id);
                              }
                            }}
                            className="text-[10px] font-semibold text-slate-400 hover:text-rose-600 cursor-pointer"
                          >
                            Hapus Catatan
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    Belum ada observasi khusus tercatat untuk {activeStudentObj?.name}.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review & Grading Modal */}
      {reviewingStudentId && (() => {
        const student = students.find(s => s.id === reviewingStudentId);
        if (!student) return null;
        const submission = taskSubmissionsMap[reviewingStudentId];
        
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in">
            <div className="bg-white rounded-2xl border border-natural-border shadow-lg w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
              {/* Modal Header */}
              <div className="p-5 border-b border-natural-border flex items-center justify-between bg-natural-accent/50">
                <div>
                  <h3 className="font-bold text-natural-dark text-sm">Review & Penilaian Tugas</h3>
                  <p className="text-slate-400 text-[10px] font-mono mt-0.5">{student.name} • NISN {student.nisn}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setReviewingStudentId(null)}
                  className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
                {/* Task Context */}
                <div className="bg-slate-50 p-3 rounded-xl border border-natural-border space-y-1">
                  <span className="text-[9px] uppercase font-bold text-slate-400">Judul Penugasan Jurnal</span>
                  <p className="font-bold text-natural-dark">{activeTaskObj?.title}</p>
                  <p className="text-slate-500 leading-relaxed text-[11px]">{activeTaskObj?.description}</p>
                </div>

                {/* Student Submission Text/Answers */}
                <div className="space-y-1.5">
                  <h4 className="font-bold text-natural-dark">Hasil Kerja Siswa</h4>
                  
                  {submission?.studentAnswerText ? (
                    <div className="bg-[#FBFBFA] p-3.5 rounded-xl border border-natural-border space-y-1.5">
                      <p className="text-[9px] font-bold text-natural-mid uppercase tracking-wide">Jawaban Tulis / Link:</p>
                      <div className="text-xs text-slate-700 whitespace-pre-wrap font-mono break-all leading-relaxed bg-white p-3 rounded-lg border border-natural-border/60">
                        {(() => {
                          const urlRegex = /(https?:\/\/[^\s]+)/g;
                          const parts = submission.studentAnswerText.split(urlRegex);
                          return parts.map((part, index) => {
                            if (part.match(urlRegex)) {
                              return (
                                <a
                                  key={index}
                                  href={part}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-natural-mid hover:text-natural-dark underline font-bold"
                                >
                                  {part}
                                </a>
                              );
                            }
                            return part;
                          });
                        })()}
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-400 italic bg-[#FBFBFA] p-3 rounded-xl border border-dashed border-natural-border">
                      Tidak ada jawaban tertulis / link yang dikirimkan.
                    </p>
                  )}

                  {/* Student Attachment File */}
                  {submission?.studentAnswerFile ? (
                    <div className="bg-[#FBFBFA] p-3.5 rounded-xl border border-natural-border space-y-1.5">
                      <p className="text-[9px] font-bold text-natural-mid uppercase tracking-wide">Lampiran File Tugas:</p>
                      <div className="flex items-center justify-between bg-white border border-natural-border/60 rounded-xl p-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Paperclip size={16} className="text-natural-mid shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-natural-dark truncate max-w-[180px] sm:max-w-xs">{submission.studentAnswerFile.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{submission.studentAnswerFile.size}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => setPreviewFile(submission.studentAnswerFile!)}
                            className="bg-natural-accent hover:bg-natural-light text-natural-dark border border-natural-border font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                            title="Pratinjau File Modal"
                          >
                            <Eye size={13} />
                            <span>Pratinjau</span>
                          </button>
                          <a
                            href={submission.studentAnswerFile.dataUrl}
                            download={submission.studentAnswerFile.name}
                            className="bg-natural-mid hover:bg-natural-dark text-white p-2 rounded-lg transition-colors cursor-pointer shrink-0"
                            title="Unduh File"
                          >
                            <Download size={13} />
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-400 italic bg-[#FBFBFA] p-3 rounded-xl border border-dashed border-natural-border">
                      Tidak ada lampiran file dokumen.
                    </p>
                  )}
                </div>

                {/* Grading Form fields */}
                <div className="border-t border-natural-border/60 pt-4 space-y-3.5">
                  <h4 className="font-bold text-natural-dark flex items-center gap-1">
                    <Star size={14} className="text-natural-sage" /> Form Penilaian Guru
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-slate-600 font-bold block">Status Kelayakan</label>
                      <select
                        value={reviewStatus}
                        onChange={(e) => setReviewStatus(e.target.value as any)}
                        className="w-full bg-white border border-natural-border rounded-xl px-3 py-2 focus:outline-none focus:border-natural-sage cursor-pointer"
                      >
                        <option value="Belum Mengumpulkan">Belum Mengumpulkan</option>
                        <option value="Menunggu Penilaian">Menunggu Penilaian</option>
                        <option value="Selesai">Selesai (Sudah Dinilai)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-600 font-bold block">Skor Akhir (0 - {activeTaskObj?.maxPoints || 100})</label>
                      <input
                        type="number"
                        min={0}
                        max={activeTaskObj?.maxPoints || 100}
                        value={reviewGrade}
                        onChange={(e) => {
                          setReviewGrade(parseInt(e.target.value) || 0);
                          setReviewStatus("Selesai");
                        }}
                        className="w-full bg-white border border-natural-border rounded-xl px-3 py-2 font-mono text-center text-xs font-bold focus:outline-none focus:border-natural-sage"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-600 font-bold block">Catatan Masukan Guru (Feedback)</label>
                    <textarea
                      value={reviewFeedback}
                      onChange={(e) => setReviewFeedback(e.target.value)}
                      placeholder="Tulis saran koding, perbaikan, atau apresiasi..."
                      rows={2.5}
                      className="w-full bg-white border border-natural-border rounded-xl p-3 focus:outline-none focus:border-natural-sage font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-natural-border flex items-center justify-end gap-2 bg-[#FBFBFA]">
                <button
                  type="button"
                  onClick={() => setReviewingStudentId(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-4 py-2 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const existing = taskSubmissionsMap[student.id];
                    const payload: TaskSubmission = {
                      id: existing ? existing.id : `sub_${Date.now()}_${student.id}`,
                      taskId: activeTaskId,
                      studentId: student.id,
                      submissionDate: existing?.submissionDate || new Date().toISOString().split("T")[0],
                      status: reviewStatus,
                      grade: reviewStatus === "Selesai" ? reviewGrade : undefined,
                      feedback: reviewFeedback,
                      studentAnswerText: submission?.studentAnswerText,
                      studentAnswerFile: submission?.studentAnswerFile
                    };
                    onSaveSubmission(payload);
                    setReviewingStudentId(null);
                  }}
                  className="bg-natural-mid hover:bg-natural-dark text-white font-bold px-5 py-2 rounded-xl cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <Save size={13} /> Simpan Penilaian
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Global File Preview Modal for Student Progress */}
      <FilePreviewModal
        file={previewFile}
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </div>
  );
}
