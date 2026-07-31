import React, { useState } from "react";
import { Plus, Edit3, Check, Calendar, Trash2, BookOpen, AlertCircle, Paperclip, File, Download, Award, Clock, FileText, UserCheck, ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { LessonPlan } from "../types";

interface LessonPlansProps {
  lessonPlans: LessonPlan[];
  onAddPlan: (plan: LessonPlan) => void;
  onUpdatePlan: (plan: LessonPlan) => void;
  onDeletePlan: (id: string) => void;
  classes: string[];
  onRecordAttendance?: (plan: LessonPlan) => void;
  onOpenGrading?: (plan: LessonPlan) => void;
}

export default function LessonPlans({
  lessonPlans,
  onAddPlan,
  onUpdatePlan,
  onDeletePlan,
  classes,
  onRecordAttendance,
  onOpenGrading
}: LessonPlansProps) {
  const [selectedClass, setSelectedClass] = useState<string>("Semua Kelas");
  const [isAdding, setIsAdding] = useState(false);
  const [editingPlan, setEditingPlan] = useState<LessonPlan | null>(null);
  const [expandedPlanIds, setExpandedPlanIds] = useState<string[]>([]);

  // Toggle single plan expansion
  const toggleExpandPlan = (id: string) => {
    setExpandedPlanIds(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  // Form states
  const [week, setWeek] = useState<number>(1);
  const [semester, setSemester] = useState<1 | 2>(1);
  const [subject, setSubject] = useState("Pemrograman Web & Perangkat Bergerak");
  const [className, setClassName] = useState(classes[0] || "XI RPL 1");
  const [selectedClassesForNew, setSelectedClassesForNew] = useState<string[]>(classes.length > 0 ? [classes[0]] : []);
  const [topic, setTopic] = useState("");
  const [competency, setCompetency] = useState("");
  const [activities, setActivities] = useState("");
  const [resources, setResources] = useState("");
  const [status, setStatus] = useState<"Scheduled" | "Completed">("Scheduled");

  // Integrated Material & Task Form states
  const [materialText, setMaterialText] = useState("");
  const [materialFile, setMaterialFile] = useState<{ name: string; size: string; type: string; dataUrl: string } | null>(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskMaxPoints, setTaskMaxPoints] = useState<number>(100);
  const [taskDeadline, setTaskDeadline] = useState("");
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  const filteredPlans = lessonPlans.filter(p => 
    selectedClass === "Semua Kelas" || p.className === selectedClass
  ).sort((a, b) => a.week - b.week);

  const resetForm = () => {
    setWeek(lessonPlans.length + 1);
    setSemester(1);
    setSubject("Pemrograman Web & Perangkat Bergerak");
    setClassName(classes[0] || "XI RPL 1");
    setSelectedClassesForNew(classes.length > 0 ? [classes[0]] : []);
    setTopic("");
    setCompetency("");
    setActivities("");
    setResources("");
    setStatus("Scheduled");
    setMaterialText("");
    setMaterialFile(null);
    setTaskTitle("");
    setTaskDescription("");
    setTaskMaxPoints(100);
    setTaskDeadline("");
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAdding(true);
    setEditingPlan(null);
  };

  const handleOpenEdit = (plan: LessonPlan) => {
    setEditingPlan(plan);
    setWeek(plan.week);
    setSemester(plan.semester);
    setSubject(plan.subject);
    setClassName(plan.className);
    setSelectedClassesForNew([plan.className]);
    setTopic(plan.topic);
    setCompetency(plan.competency);
    setActivities(plan.activities);
    setResources(plan.resources);
    setStatus(plan.status);
    setMaterialText(plan.materialText || "");
    setMaterialFile(plan.materialFile || null);
    setTaskTitle(plan.taskTitle || "");
    setTaskDescription(plan.taskDescription || "");
    setTaskMaxPoints(plan.taskMaxPoints || 100);
    setTaskDeadline(plan.taskDeadline || "");
    setIsAdding(false);
  };

  // Helper to read file to base64
  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setMaterialFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        type: file.type,
        dataUrl: reader.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleDragLeave = () => {
    setIsDraggingFile(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !competency) {
      alert("Harap isi Judul Topik dan Alur Tujuan Pembelajaran (ATP).");
      return;
    }

    if (editingPlan) {
      const payload: LessonPlan = {
        id: editingPlan.id,
        week,
        semester,
        subject,
        className,
        topic,
        competency,
        activities,
        resources,
        status,
        materialText: materialText || undefined,
        materialFile: materialFile || undefined,
        taskTitle: taskTitle || undefined,
        taskDescription: taskDescription || undefined,
        taskMaxPoints: taskTitle ? taskMaxPoints : undefined,
        taskDeadline: taskTitle ? taskDeadline : undefined
      };
      onUpdatePlan(payload);
      setEditingPlan(null);
    } else {
      if (selectedClassesForNew.length === 0) {
        alert("Harap pilih minimal 1 kelas untuk RPP.");
        return;
      }

      // Generate an RPP for each selected class
      selectedClassesForNew.forEach((cls, idx) => {
        const payload: LessonPlan = {
          id: `lp_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`,
          week,
          semester,
          subject,
          className: cls,
          topic,
          competency,
          activities,
          resources,
          status,
          materialText: materialText || undefined,
          materialFile: materialFile || undefined,
          taskTitle: taskTitle || undefined,
          taskDescription: taskDescription || undefined,
          taskMaxPoints: taskTitle ? taskMaxPoints : undefined,
          taskDeadline: taskTitle ? taskDeadline : undefined
        };
        onAddPlan(payload);
      });
      setIsAdding(false);
    }
    resetForm();
  };

  const handleToggleStatus = (plan: LessonPlan) => {
    onUpdatePlan({
      ...plan,
      status: plan.status === "Completed" ? "Scheduled" : "Completed"
    });
  };

  return (
    <div id="lesson-plans-root" className="space-y-6">
      {/* Header and Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-natural-border shadow-xs">
        <div className="flex items-center gap-3">
          <div className="bg-natural-accent text-natural-dark p-2 rounded-xl">
            <BookOpen size={20} />
          </div>
          <div>
            <h3 className="font-bold text-natural-dark text-base">Rencana Pelaksanaan Pembelajaran (RPP)</h3>
            <p className="text-slate-500 text-xs">Simpan silabus dan aktivitas pembelajaran per minggu selama 1 semester.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {filteredPlans.length > 0 && (
            <button
              onClick={() => {
                if (expandedPlanIds.length === filteredPlans.length) {
                  setExpandedPlanIds([]);
                } else {
                  setExpandedPlanIds(filteredPlans.map(p => p.id));
                }
              }}
              className="bg-natural-accent hover:bg-natural-light border border-natural-border text-natural-dark text-xs font-semibold rounded-xl px-3 py-2 flex items-center gap-1.5 transition-colors cursor-pointer"
              title={expandedPlanIds.length === filteredPlans.length ? "Tutup Semua Detail" : "Buka Semua Detail"}
            >
              <ChevronsUpDown size={14} className="text-natural-mid" />
              <span className="hidden sm:inline">
                {expandedPlanIds.length === filteredPlans.length ? "Tutup Semua" : "Buka Semua"}
              </span>
            </button>
          )}

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="bg-natural-accent border border-natural-border text-natural-dark text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-natural-sage"
          >
            <option value="Semua Kelas">Semua Kelas</option>
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          
          <button
            onClick={handleOpenAdd}
            className="bg-natural-mid hover:bg-natural-dark text-white text-xs font-bold rounded-xl px-4.5 py-2 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus size={16} /> RPP Baru
          </button>
        </div>
      </div>

      {/* Add / Edit Form Modal-like UI */}
      {(isAdding || editingPlan) && (
        <div className="bg-[#FBFBFA] border border-natural-border rounded-2xl p-5 space-y-4 shadow-inner">
          <div className="flex justify-between items-center pb-2 border-b border-natural-border">
            <h4 className="text-natural-dark font-bold text-sm flex items-center gap-2">
              <Calendar size={16} className="text-natural-sage" />
              {editingPlan ? "Ubah Rencana Pembelajaran" : "Tambah Rencana Pembelajaran Baru"}
            </h4>
            <button 
              onClick={() => { setIsAdding(false); setEditingPlan(null); }}
              className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
            >
              Batal
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Week & Semester */}
            <div className="space-y-1.5">
              <label className="text-slate-600 font-bold text-xs block">Pertemuan / Minggu Ke-</label>
              <input
                type="number"
                min={1}
                max={25}
                value={week}
                onChange={(e) => setWeek(parseInt(e.target.value) || 1)}
                className="w-full bg-white border border-natural-border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-natural-sage"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-600 font-bold text-xs block">Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(parseInt(e.target.value) as 1 | 2)}
                className="w-full bg-white border border-natural-border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-natural-sage"
              >
                <option value={1}>Ganjil (1)</option>
                <option value={2}>Genap (2)</option>
              </select>
            </div>

            {/* Subject & Class */}
            <div className={`space-y-1.5 ${!editingPlan ? 'md:col-span-1' : ''}`}>
              <label className="text-slate-600 font-bold text-xs block">Mata Pelajaran</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="cth: Pemrograman Web"
                className="w-full bg-white border border-natural-border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-natural-sage"
                required
              />
            </div>

            {editingPlan ? (
              <div className="space-y-1.5">
                <label className="text-slate-600 font-bold text-xs block">Kelas</label>
                <select
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full bg-white border border-natural-border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-natural-sage"
                >
                  {classes.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            ) : (
              <div className="space-y-2 md:col-span-2 bg-white p-3.5 rounded-xl border border-natural-border">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <label className="text-slate-700 font-bold text-xs flex items-center gap-1.5">
                    Target Kelas <span className="text-slate-400 font-normal text-[11px]">(Pilih satu atau beberapa kelas sekaligus)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedClassesForNew.length === classes.length) {
                        setSelectedClassesForNew([]);
                      } else {
                        setSelectedClassesForNew([...classes]);
                      }
                    }}
                    className="text-xs text-natural-mid font-semibold hover:underline cursor-pointer"
                  >
                    {selectedClassesForNew.length === classes.length ? "Batal Pilih Semua" : "Pilih Semua Kelas"}
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {classes.map(c => {
                    const isSelected = selectedClassesForNew.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setSelectedClassesForNew(prev => prev.filter(item => item !== c));
                          } else {
                            setSelectedClassesForNew(prev => [...prev, c]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                          isSelected 
                            ? "bg-natural-dark text-white border-natural-dark shadow-2xs" 
                            : "bg-natural-accent/50 text-natural-dark border-natural-border hover:bg-natural-accent"
                        }`}
                      >
                        <div className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] font-bold ${
                          isSelected ? "bg-white text-natural-dark" : "border border-natural-border/80 bg-white"
                        }`}>
                          {isSelected ? "✓" : ""}
                        </div>
                        {c}
                      </button>
                    );
                  })}
                </div>

                {selectedClassesForNew.length > 0 ? (
                  <p className="text-[11px] text-emerald-700 font-medium pt-1 flex items-center gap-1">
                    <span className="font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-[10px]">
                      {selectedClassesForNew.length} RPP
                    </span>
                    akan dibuat otomatis untuk: {selectedClassesForNew.join(", ")}
                  </p>
                ) : (
                  <p className="text-[11px] text-rose-500 font-medium pt-1">
                    ⚠️ Harap pilih minimal 1 kelas target.
                  </p>
                )}
              </div>
            )}

            {/* Topic title */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-slate-600 font-bold text-xs block">Judul Topik Pembelajaran</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="cth: Dasar-dasar React dan useState"
                className="w-full bg-white border border-natural-border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-natural-sage"
                required
              />
            </div>

            {/* Competency / CP / ATP */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-slate-600 font-bold text-xs block">Kompetensi Dasar / Tujuan Pembelajaran (TP)</label>
              <textarea
                value={competency}
                onChange={(e) => setCompetency(e.target.value)}
                placeholder="cth: Siswa memahami siklus hidup component dan mampu mengontrol reaktivitas menggunakan state React."
                rows={2}
                className="w-full bg-white border border-natural-border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-natural-sage resize-none"
                required
              />
            </div>

            {/* Activities */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-slate-600 font-bold text-xs block">Aktivitas Pembelajaran (Pisahkan per baris)</label>
              <textarea
                value={activities}
                onChange={(e) => setActivities(e.target.value)}
                placeholder="cth: 1. Guru mendemonstrasikan live koding&#10;2. Siswa praktikum membuat kalkulator&#10;3. Evaluasi akhir bimbingan"
                rows={3}
                className="w-full bg-white border border-natural-border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-natural-sage"
              />
            </div>

            {/* Resources & Status */}
            <div className="space-y-1.5">
              <label className="text-slate-600 font-bold text-xs block">Sumber Belajar & Alat / Bahan</label>
              <input
                type="text"
                value={resources}
                onChange={(e) => setResources(e.target.value)}
                placeholder="cth: Modul, VS Code, Video Tutorial"
                className="w-full bg-white border border-natural-border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-natural-sage"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-600 font-bold text-xs block">Status Keterlaksanaan</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "Scheduled" | "Completed")}
                className="w-full bg-white border border-natural-border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-natural-sage"
              >
                <option value="Scheduled">Direncanakan (Scheduled)</option>
                <option value="Completed">Selesai Terlaksana (Completed)</option>
              </select>
            </div>

            {/* Integrated Learning Materials Section */}
            <div className="md:col-span-2 border-t border-natural-border pt-4 mt-2">
              <h5 className="text-xs font-bold uppercase text-natural-dark tracking-wider mb-3 flex items-center gap-1.5">
                <FileText size={14} className="text-natural-mid" /> Bahan Ajar & Materi Terintegrasi
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4.5 rounded-2xl border border-natural-border shadow-3xs">
                <div className="space-y-1.5">
                  <label className="text-slate-600 font-bold text-xs block">Keterangan Awal / Ringkasan Materi</label>
                  <textarea
                    value={materialText}
                    onChange={(e) => setMaterialText(e.target.value)}
                    placeholder="cth: Masukkan pendahuluan materi, ringkasan teori, atau poin penting..."
                    rows={4}
                    className="w-full bg-[#FBFBFA] border border-natural-border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-natural-sage resize-none"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-slate-600 font-bold text-xs block">Lampiran File (PDF / Word / Slide)</label>
                  <div 
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-4.5 text-center transition-all flex flex-col items-center justify-center cursor-pointer min-h-[110px] ${
                      isDraggingFile 
                        ? "border-natural-mid bg-natural-accent" 
                        : "border-natural-border bg-[#FBFBFA] hover:bg-natural-accent/30"
                    }`}
                    onClick={() => document.getElementById("rpp-file-upload")?.click()}
                  >
                    <input 
                      type="file" 
                      id="rpp-file-upload"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.webp,image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Paperclip size={20} className="text-slate-400 mb-1" />
                    {materialFile ? (
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-natural-dark max-w-[200px] truncate mx-auto">{materialFile.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{materialFile.size}</p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setMaterialFile(null);
                          }}
                          className="text-rose-600 hover:text-rose-800 text-[10px] font-bold underline block mx-auto mt-1 cursor-pointer"
                        >
                          Hapus File
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs font-bold text-slate-600">Seret file di sini, atau <span className="text-natural-mid underline">klik untuk memilih</span></p>
                        <p className="text-[10px] text-slate-400 mt-1">Mendukung Gambar, PDF, Word, PPT (Maks 10MB)</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Integrated Task Section */}
            <div className="md:col-span-2 border-t border-natural-border pt-4 mt-2">
              <h5 className="text-xs font-bold uppercase text-natural-dark tracking-wider mb-3 flex items-center gap-1.5">
                <Award size={14} className="text-natural-mid" /> Penugasan Terintegrasi (Opsional)
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-white p-4.5 rounded-2xl border border-natural-border shadow-3xs">
                <div className="md:col-span-6 space-y-1.5">
                  <label className="text-slate-600 font-bold text-xs block">Judul Tugas</label>
                  <input
                    type="text"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="cth: Tugas Praktikum Membuat Biodata Diri"
                    className="w-full bg-[#FBFBFA] border border-natural-border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-natural-sage"
                  />
                </div>
                
                <div className="md:col-span-3 space-y-1.5">
                  <label className="text-slate-600 font-bold text-xs block">Tenggat Waktu (Deadline)</label>
                  <input
                    type="date"
                    value={taskDeadline}
                    onChange={(e) => setTaskDeadline(e.target.value)}
                    className="w-full bg-[#FBFBFA] border border-natural-border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-natural-sage"
                  />
                </div>

                <div className="md:col-span-3 space-y-1.5">
                  <label className="text-slate-600 font-bold text-xs block">Poin Maksimal</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={taskMaxPoints}
                    onChange={(e) => setTaskMaxPoints(parseInt(e.target.value) || 100)}
                    className="w-full bg-[#FBFBFA] border border-natural-border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-natural-sage"
                  />
                </div>

                <div className="md:col-span-12 space-y-1.5">
                  <label className="text-slate-600 font-bold text-xs block">Deskripsi / Petunjuk Tugas</label>
                  <textarea
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    placeholder="Tuliskan petunjuk pengerjaan tugas atau instruksi detail lainnya..."
                    rows={3}
                    className="w-full bg-[#FBFBFA] border border-natural-border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-natural-sage"
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => { setIsAdding(false); setEditingPlan(null); }}
                className="bg-natural-accent hover:bg-natural-light text-natural-dark text-xs font-bold rounded-xl px-4 py-2 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="bg-natural-mid hover:bg-natural-dark text-white text-xs font-bold rounded-xl px-5 py-2 cursor-pointer"
              >
                {editingPlan ? "Simpan Perubahan" : "Simpan Rencana"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* RPP List */}
      <div className="space-y-3">
        {filteredPlans.length > 0 ? (
          filteredPlans.map((plan) => {
            const isCompleted = plan.status === "Completed";
            const isExpanded = expandedPlanIds.includes(plan.id);

            return (
              <div 
                key={plan.id}
                className={`bg-white rounded-2xl border transition-all duration-200 shadow-2xs ${
                  isCompleted 
                    ? "border-natural-sage/40 hover:border-natural-sage" 
                    : "border-natural-border hover:border-natural-mid/40"
                }`}
              >
                {/* Header info bar - Clickable ListTile */}
                <div 
                  onClick={() => toggleExpandPlan(plan.id)}
                  className={`flex flex-col md:flex-row md:items-center justify-between p-3.5 sm:p-4 gap-3 cursor-pointer select-none transition-colors rounded-2xl ${
                    isExpanded 
                      ? "border-b border-natural-border/40 bg-natural-accent/20 rounded-b-none" 
                      : "hover:bg-natural-accent/30"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex flex-col items-center justify-center font-mono font-bold shrink-0 text-xs ${
                      isCompleted ? "bg-natural-accent text-natural-sage border border-natural-sage/30" : "bg-natural-light/80 text-natural-dark"
                    }`}>
                      <span className="text-[9px] uppercase font-semibold text-slate-400 leading-none">Wk</span>
                      <span className="text-xs sm:text-sm font-bold leading-tight">{plan.week}</span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <span className="bg-natural-accent text-natural-dark px-2 py-0.5 rounded text-[10px] font-mono font-bold">{plan.className}</span>
                        <span className="bg-natural-accent text-natural-dark px-2 py-0.5 rounded text-[10px] font-mono font-bold">Sem. {plan.semester}</span>
                        <span className="text-slate-500 text-xs font-medium truncate max-w-[150px] sm:max-w-xs">• {plan.subject}</span>
                        {plan.materialFile && (
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-1.5 py-0.5 rounded text-[9px] font-bold flex items-center gap-0.5" title="Materi File">
                            <Paperclip size={10} /> File
                          </span>
                        )}
                        {plan.taskTitle && (
                          <span className="bg-amber-50 text-amber-700 border border-amber-200/60 px-1.5 py-0.5 rounded text-[9px] font-bold flex items-center gap-0.5" title="Penugasan">
                            <Award size={10} /> Tugas
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-xs sm:text-sm text-natural-dark truncate">{plan.topic}</h4>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onRecordAttendance && onRecordAttendance(plan)}
                      className="text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer bg-natural-accent hover:bg-natural-light/80 text-natural-dark border border-natural-border transition-colors"
                      title="Presensi Siswa untuk Pertemuan ini"
                    >
                      <UserCheck size={14} className="text-natural-sage shrink-0" />
                      <span className="hidden sm:inline">Presensi</span>
                    </button>

                    {onOpenGrading && (
                      <button
                        onClick={() => onOpenGrading(plan)}
                        className="text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer bg-natural-accent hover:bg-natural-light/80 text-natural-dark border border-natural-border transition-colors"
                        title="Nilai Tugas & Review Jawaban Siswa"
                      >
                        <Award size={14} className="text-natural-mid shrink-0" />
                        <span className="hidden sm:inline">Penilaian</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleToggleStatus(plan)}
                      className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer border transition-colors ${
                        isCompleted 
                          ? "bg-natural-accent hover:bg-natural-light/80 text-natural-dark border-natural-border" 
                          : "bg-natural-accent hover:bg-natural-light text-natural-dark border-natural-border"
                      }`}
                    >
                      <Check size={14} className={isCompleted ? "text-natural-sage" : "text-slate-400"} />
                      <span className="hidden sm:inline">{isCompleted ? "Selesai" : "Mulai"}</span>
                    </button>

                    <button
                      onClick={() => handleOpenEdit(plan)}
                      className="p-1.5 text-slate-400 hover:text-natural-dark hover:bg-natural-accent rounded-lg transition-colors cursor-pointer"
                      title="Edit RPP"
                    >
                      <Edit3 size={15} />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm("Hapus RPP minggu ini?")) {
                          onDeletePlan(plan.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Hapus RPP"
                    >
                      <Trash2 size={15} />
                    </button>

                    <button
                      onClick={() => toggleExpandPlan(plan.id)}
                      className="p-1.5 text-slate-500 hover:text-natural-dark hover:bg-natural-accent rounded-lg transition-colors cursor-pointer ml-0.5"
                      title={isExpanded ? "Tutup Detail" : "Buka Detail"}
                    >
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details view */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 bg-[#FBFBFA]/80 rounded-b-2xl space-y-4 text-xs animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      {/* Competency Goals */}
                      <div className="md:col-span-4 space-y-1">
                        <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Tujuan Pembelajaran (ATP)</span>
                        <p className="text-natural-dark font-medium leading-relaxed bg-white p-3 rounded-xl border border-natural-border shadow-2xs">
                          {plan.competency}
                        </p>
                      </div>

                      {/* Activities */}
                      <div className="md:col-span-5 space-y-1">
                        <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Aktivitas Pembelajaran</span>
                        <div className="text-natural-dark font-medium leading-relaxed bg-white p-3 rounded-xl border border-natural-border shadow-2xs whitespace-pre-line">
                          {plan.activities || <span className="italic text-slate-400">Belum ada aktivitas yang didetailkan.</span>}
                        </div>
                      </div>

                      {/* Resources / Materials */}
                      <div className="md:col-span-3 space-y-1">
                        <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Alat, Bahan & Sumber</span>
                        <p className="text-natural-dark font-medium leading-relaxed bg-white p-3 rounded-xl border border-natural-border shadow-2xs">
                          {plan.resources || <span className="italic text-slate-400">Tidak dicantumkan khusus.</span>}
                        </p>
                      </div>
                    </div>

                    {/* Integrated Material & Tasks sub-sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-natural-border/40">
                      {/* Material Column */}
                      <div className="bg-white p-4 rounded-xl border border-natural-border space-y-2">
                        <h5 className="font-bold text-natural-dark text-xs flex items-center gap-1.5 border-b border-natural-border/60 pb-1.5">
                          <FileText size={14} className="text-natural-sage" /> Materi Terintegrasi
                        </h5>
                        {plan.materialText || plan.materialFile ? (
                          <div className="space-y-2.5">
                            {plan.materialText && (
                              <p className="text-slate-600 leading-relaxed font-medium whitespace-pre-line">
                                {plan.materialText}
                              </p>
                            )}
                            {plan.materialFile && (
                              <div className="bg-natural-accent border border-natural-border/60 rounded-xl p-3 flex items-center justify-between">
                                <div className="flex items-center gap-2 min-w-0">
                                  <File size={16} className="text-natural-sage shrink-0" />
                                  <div className="min-w-0">
                                    <p className="text-xs font-bold text-natural-dark truncate max-w-[150px] sm:max-w-xs">{plan.materialFile.name}</p>
                                    <p className="text-[10px] text-slate-400 font-mono">{plan.materialFile.size}</p>
                                  </div>
                                </div>
                                <a
                                  href={plan.materialFile.dataUrl}
                                  download={plan.materialFile.name}
                                  className="bg-natural-mid hover:bg-natural-dark text-white p-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
                                  title="Unduh File"
                                >
                                  <Download size={13} />
                                </a>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-slate-400 italic">Belum ada keterangan materi untuk pertemuan ini.</p>
                        )}
                      </div>

                      {/* Task Column */}
                      <div className="bg-white p-4 rounded-xl border border-natural-border space-y-2">
                        <h5 className="font-bold text-natural-dark text-xs flex items-center gap-1.5 border-b border-natural-border/60 pb-1.5">
                          <Award size={14} className="text-natural-sage" /> Penugasan Terintegrasi
                        </h5>
                        {plan.taskTitle ? (
                          <div className="space-y-2">
                            <div>
                              <span className="bg-[#E8EDDF] text-natural-dark px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider inline-block">
                                {plan.taskTitle}
                              </span>
                            </div>
                            {plan.taskDescription && (
                              <p className="text-slate-600 leading-relaxed font-medium whitespace-pre-line">
                                {plan.taskDescription}
                              </p>
                            )}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-slate-500 font-medium bg-natural-accent/40 px-2.5 py-1.5 rounded-lg border border-natural-border/40">
                              <span className="flex items-center gap-1">
                                <Award size={12} className="text-natural-mid" /> Nilai Maks: {plan.taskMaxPoints || 100}
                              </span>
                              {plan.taskDeadline && (
                                <span className="flex items-center gap-1">
                                  <Clock size={12} className="text-natural-mid" /> Batas: {plan.taskDeadline}
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <p className="text-slate-400 italic">Tidak ada penugasan khusus pada pertemuan ini.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-white text-center py-16 rounded-2xl border border-natural-border flex flex-col items-center justify-center p-6 space-y-2">
            <AlertCircle size={32} className="text-slate-400" />
            <h5 className="font-bold text-natural-dark text-sm">Tidak ada Rencana Pembelajaran</h5>
            <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
              Silakan buat RPP baru atau ubah filter kelas untuk melihat kurikulum yang dijadwalkan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
