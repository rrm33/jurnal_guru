import React, { useState, useMemo } from "react";
import { Plus, Award, AlertTriangle, ShieldAlert, Check, Trash2, Calendar, ThumbsUp, AlertCircle } from "lucide-react";
import { Student, DisciplineLog } from "../types";

interface DisciplineProps {
  students: Student[];
  disciplineLogs: DisciplineLog[];
  onAddLog: (log: DisciplineLog) => void;
  onDeleteLog: (id: string) => void;
  classes: string[];
}

export default function Discipline({
  students,
  disciplineLogs,
  onAddLog,
  onDeleteLog,
  classes
}: DisciplineProps) {
  const [selectedClass, setSelectedClass] = useState<string>(classes[0] || "XI RPL 1");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");

  const classStudents = useMemo(() => {
    return students.filter(s => s.className === selectedClass);
  }, [students, selectedClass]);

  const activeStudentId = useMemo(() => {
    if (selectedStudentId && classStudents.some(s => s.id === selectedStudentId)) {
      return selectedStudentId;
    }
    return classStudents[0]?.id || "";
  }, [classStudents, selectedStudentId]);

  const activeStudentObj = useMemo(() => {
    return students.find(s => s.id === activeStudentId);
  }, [students, activeStudentId]);

  // Log creation states
  const [logType, setLogType] = useState<"Negatif" | "Positif">("Negatif");
  const [category, setCategory] = useState("Terlambat Masuk Kelas");
  const [points, setPoints] = useState(-10);
  const [actionTaken, setActionTaken] = useState("");
  const [notes, setNotes] = useState("");

  // Sync point defaults when type changes to maintain ease of entry
  const handleTypeChange = (type: "Negatif" | "Positif") => {
    setLogType(type);
    if (type === "Negatif") {
      setCategory("Terlambat Masuk Kelas");
      setPoints(-10);
    } else {
      setCategory("Tutor Sebaya");
      setPoints(15);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !actionTaken) {
      alert("Harap lengkapi Kategori dan Tindakan yang Diambil.");
      return;
    }

    const payload: DisciplineLog = {
      id: `dis_${Date.now()}`,
      studentId: activeStudentId,
      date: new Date().toISOString().split("T")[0],
      type: logType,
      category,
      points,
      actionTaken,
      notes: notes || undefined
    };

    onAddLog(payload);
    // Reset form fields
    setActionTaken("");
    setNotes("");
    alert("Log kedisiplinan berhasil tersimpan!");
  };

  // Student specific points calculation (Base score = 100)
  const studentDisciplineSummary = useMemo(() => {
    const summary: { [studentId: string]: { score: number; violationsCount: number; awardsCount: number } } = {};
    
    students.forEach(std => {
      summary[std.id] = { score: 100, violationsCount: 0, awardsCount: 0 };
    });

    disciplineLogs.forEach(log => {
      if (summary[log.studentId]) {
        summary[log.studentId].score += log.points;
        if (log.type === "Negatif") {
          summary[log.studentId].violationsCount++;
        } else {
          summary[log.studentId].awardsCount++;
        }
      }
    });

    return summary;
  }, [students, disciplineLogs]);

  const activeStudentStats = activeStudentId ? studentDisciplineSummary[activeStudentId] : { score: 100, violationsCount: 0, awardsCount: 0 };

  // Filter logs for table list view
  const filteredLogs = useMemo(() => {
    return disciplineLogs
      .filter(log => {
        const student = students.find(s => s.id === log.studentId);
        return student && student.className === selectedClass;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [disciplineLogs, students, selectedClass]);

  return (
    <div id="discipline-root" className="space-y-6">
      {/* Overview stats & selectors */}
      <div className="bg-white p-5 rounded-2xl border border-natural-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-natural-accent text-natural-mid p-2 rounded-xl border border-natural-border/50">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h3 className="font-bold text-natural-dark text-base">Log Kedisiplinan & Sikap Siswa</h3>
            <p className="text-slate-400 text-xs">Catat poin kepatuhan tata tertib laboratorium dan kontribusi positif siswa.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-bold uppercase">Kelas:</span>
          <select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setSelectedStudentId(""); // reset selected student when class changes
            }}
            className="bg-natural-accent border border-natural-border text-natural-dark text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-natural-sage cursor-pointer"
          >
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Main layout split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left side: Logging New Event */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-natural-border shadow-xs space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-natural-border/40">
              <h4 className="text-natural-dark font-bold text-sm">Input Log Sikap</h4>
              <div className="flex gap-1.5 p-1 bg-natural-accent rounded-lg border border-natural-border/40">
                <button
                  type="button"
                  onClick={() => handleTypeChange("Negatif")}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                    logType === "Negatif" ? "bg-rose-600 text-white shadow-3xs" : "text-slate-500"
                  }`}
                >
                  Pelanggaran
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange("Positif")}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                    logType === "Positif" ? "bg-natural-mid text-white shadow-3xs" : "text-slate-500"
                  }`}
                >
                  Apresiasi
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Nama Siswa</span>
                <select
                  value={activeStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full bg-natural-accent border border-natural-border text-natural-dark text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-natural-sage cursor-pointer"
                  required
                >
                  {classStudents.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} (Poin: {studentDisciplineSummary[s.id]?.score ?? 100})
                    </option>
                  ))}
                </select>
              </div>

              {/* Point modification card */}
              {activeStudentObj && (
                <div className={`p-4 rounded-xl border flex items-center justify-between ${
                  logType === "Negatif" ? "bg-rose-50/40 border-rose-100" : "bg-natural-accent/40 border-natural-border/60"
                }`}>
                  <div className="space-y-0.5 text-xs">
                    <p className="text-slate-500 font-medium">Skor Sikap Saat Ini:</p>
                    <p className="font-bold text-natural-dark text-base">{activeStudentStats.score} Poin</p>
                    <p className="text-[10px] text-slate-400">
                      {activeStudentStats.violationsCount} Pelanggaran • {activeStudentStats.awardsCount} Prestasi
                    </p>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Dampak Poin</span>
                    <select
                      value={points}
                      onChange={(e) => setPoints(parseInt(e.target.value))}
                      className={`font-mono text-xs font-bold rounded-lg border px-3 py-1 bg-white focus:outline-none focus:ring-1 ${
                        logType === "Negatif" ? "text-rose-600 border-rose-200 focus:ring-rose-500" : "text-natural-mid border-natural-border focus:ring-natural-sage"
                      }`}
                    >
                      {logType === "Negatif" ? (
                        <>
                          <option value={-5}>-5 Poin (Ringan)</option>
                          <option value={-10}>-10 Poin (Sedang)</option>
                          <option value={-15}>-15 Poin (Berat)</option>
                          <option value={-25}>-25 Poin (Kritikal)</option>
                        </>
                      ) : (
                        <>
                          <option value={5}>+5 Poin (Dasar)</option>
                          <option value={10}>+10 Poin (Menengah)</option>
                          <option value={15}>+15 Poin (Besar)</option>
                          <option value={25}>+25 Poin (Istimewa)</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
              )}

              {/* Category */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Kategori Tindakan / Peristiwa</span>
                {logType === "Negatif" ? (
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white border border-natural-border text-natural-dark text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-natural-sage"
                  >
                    <option value="Terlambat Masuk Kelas">Terlambat Masuk Kelas / Lab</option>
                    <option value="Bermain Game saat Pelajaran">Bermain Game saat Pelajaran Berlangsung</option>
                    <option value="Tidur / Tidak Memperhatikan">Tidur atau Mengabaikan Instruksi Guru</option>
                    <option value="Atribut Sekolah Tidak Lengkap">Atribut / Seragam Tidak Sesuai Aturan</option>
                    <option value="Membuat Gaduh di Lab">Membuat Kegaduhan / Mengganggu Teman</option>
                    <option value="Makan / Minum saat Praktikum">Makan atau Minum saat Praktikum Komputer</option>
                  </select>
                ) : (
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white border border-natural-border text-natural-dark text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-natural-sage"
                  >
                    <option value="Tutor Sebaya">Tutor Sebaya (Membantu Teman Koding)</option>
                    <option value="Piket Kebersihan Lab">Piket Kebersihan Lab Terpuji</option>
                    <option value="Menyelesaikan Tugas Pertama">Kecepatan & Kualitas Tugas Terbaik</option>
                    <option value="Mewakili Lomba / Event">Mewakili Kompetensi Keahlian di Event</option>
                    <option value="Inisiatif Merapikan Alat Lab">Inisiatif Merapikan Peralatan & PC Lab</option>
                  </select>
                )}
              </div>

              {/* Action Taken */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Tindakan / Sanksi / Apresiasi Guru</span>
                <input
                  type="text"
                  value={actionTaken}
                  onChange={(e) => setActionTaken(e.target.value)}
                  placeholder={logType === "Negatif" ? "cth: Teguran lisan & sanksi piket menyapu lab" : "cth: Pujian di depan kelas & sertifikasi internal"}
                  className="w-full bg-white border border-natural-border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-natural-sage font-medium text-natural-dark"
                  required
                />
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Catatan Tambahan (Kronologi)</span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ceritakan singkat rincian kejadian di lapangan..."
                  rows={2}
                  className="w-full bg-white border border-natural-border rounded-xl p-3 text-xs focus:outline-none focus:border-natural-sage font-medium text-natural-dark"
                />
              </div>

              <button
                type="submit"
                className={`w-full text-white text-xs font-bold rounded-xl py-2.5 transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer ${
                  logType === "Negatif" ? "bg-rose-600 hover:bg-rose-700" : "bg-natural-mid hover:bg-[#2C3E2D]"
                }`}
              >
                {logType === "Negatif" ? <AlertTriangle size={15} /> : <ThumbsUp size={15} />}
                {logType === "Negatif" ? "Kurangi Poin & Simpan" : "Berikan Poin & Simpan"}
              </button>
            </form>
          </div>
        </div>

        {/* Right side: History Table */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-natural-border shadow-xs">
            <h4 className="text-natural-dark font-bold text-sm mb-4">Riwayat Kejadian & Disiplin Kelas: {selectedClass}</h4>

            <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-2">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => {
                  const student = students.find(s => s.id === log.studentId);
                  const isPos = log.type === "Positif";
                  return (
                    <div 
                      key={log.id} 
                      className={`p-4 rounded-xl border flex gap-3 justify-between items-start transition-all ${
                        isPos ? "bg-natural-accent/30 border-natural-border/60" : "bg-rose-50/20 border-rose-100"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-xs text-natural-dark">{student?.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                            <Calendar size={10} /> {log.date}
                          </span>
                        </div>
                        <p className={`text-xs font-bold ${isPos ? "text-natural-mid" : "text-rose-700"}`}>
                          {log.category}
                        </p>
                        
                        <div className="text-[11px] text-slate-600 font-medium">
                          <span className="font-bold text-natural-dark">Tindakan:</span> {log.actionTaken}
                        </div>

                        {log.notes && (
                          <p className="text-natural-dark text-[11px] leading-relaxed italic bg-white/70 p-2 rounded-lg border border-natural-border/40 mt-1">
                            "{log.notes}"
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-3 shrink-0">
                        <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-lg border ${
                          isPos 
                            ? "bg-natural-accent text-natural-mid border-natural-border" 
                            : "bg-rose-100 text-rose-800 border-rose-200"
                        }`}>
                          {isPos ? `+${log.points}` : `${log.points}`}
                        </span>

                        <button
                          onClick={() => {
                            if (confirm("Hapus log kedisiplinan ini? Poin sikap siswa akan dikembalikan semula.")) {
                              onDeleteLog(log.id);
                            }
                          }}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1 rounded hover:bg-[#FBFBFA] cursor-pointer"
                          title="Hapus Log"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-16 text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
                  <AlertCircle size={28} className="text-slate-300" />
                  <span>Belum ada log pelanggaran maupun apresiasi tercatat untuk kelas {selectedClass}.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
