import { useState, useMemo } from "react";
import { Download, Printer, Settings, CheckCircle, AlertTriangle, Search, Percent, RefreshCw } from "lucide-react";
import { Student, Task, TaskSubmission, DisciplineLog } from "../types";

interface GradeRecapProps {
  students: Student[];
  tasks: Task[];
  submissions: TaskSubmission[];
  disciplineLogs: DisciplineLog[];
  examGrades: { [studentId: string]: { uts: number; uas: number } };
  onSaveExamGrades: (studentId: string, uts: number, uas: number) => void;
  classes: string[];
}

export default function GradeRecap({
  students,
  tasks,
  submissions,
  disciplineLogs,
  examGrades,
  onSaveExamGrades,
  classes
}: GradeRecapProps) {
  const [selectedClass, setSelectedClass] = useState<string>(classes[0] || "XI RPL 1");
  const [searchTerm, setSearchTerm] = useState("");
  const [kkm, setKkm] = useState(75);

  // Formula Weighting Configurations
  const [showSettings, setShowSettings] = useState(false);
  const [wTasks, setWTasks] = useState(40);
  const [wAttitude, setWAttitude] = useState(20);
  const [wUts, setWUts] = useState(20);
  const [wUas, setWUas] = useState(20);

  // Inline exam editing states
  const [editingExamId, setEditingExamId] = useState<string | null>(null);
  const [localUts, setLocalUts] = useState<number>(0);
  const [localUas, setLocalUas] = useState<number>(0);

  const startEditingExams = (stdId: string, currentUts: number, currentUas: number) => {
    setEditingExamId(stdId);
    setLocalUts(currentUts);
    setLocalUas(currentUas);
  };

  const handleSaveExams = (stdId: string) => {
    onSaveExamGrades(stdId, localUts, localUas);
    setEditingExamId(null);
  };

  // 1. Calculate Attitude Scores (starts at 100, modified by logs)
  const attitudeScoresMap = useMemo(() => {
    const map: { [studentId: string]: number } = {};
    students.forEach(s => {
      map[s.id] = 100;
    });
    disciplineLogs.forEach(log => {
      if (map[log.studentId] !== undefined) {
        map[log.studentId] += log.points;
      }
    });
    return map;
  }, [students, disciplineLogs]);

  // 2. Calculate Task Averages per student
  const taskAveragesMap = useMemo(() => {
    const map: { [studentId: string]: { total: number; count: number } } = {};
    
    // Pre-populate with zeros
    students.forEach(s => {
      map[s.id] = { total: 0, count: 0 };
    });

    // Accumulate graded submissions
    submissions.forEach(sub => {
      if (sub.status === "Selesai" && sub.grade !== undefined) {
        if (map[sub.studentId]) {
          map[sub.studentId].total += sub.grade;
          map[sub.studentId].count++;
        }
      }
    });

    const averages: { [studentId: string]: number } = {};
    students.forEach(s => {
      const entry = map[s.id];
      // If student has no grades, fallback to 80 or 0. Let's fallback to 80 for realistic presentation, or 0 if preferred.
      averages[s.id] = entry.count > 0 ? Math.round(entry.total / entry.count) : 0;
    });

    return averages;
  }, [students, submissions]);

  // 3. Compile full grid data
  const classLedger = useMemo(() => {
    const items = students
      .filter(s => s.className === selectedClass)
      .map(student => {
        const avgTasks = taskAveragesMap[student.id] || 0;
        const attitudeScore = attitudeScoresMap[student.id] ?? 100;
        
        const exams = examGrades[student.id] || { uts: 80, uas: 80 }; // Default exams to 80 if not defined
        const uts = exams.uts;
        const uas = exams.uas;

        // Formula Calculation
        const totalWeight = wTasks + wAttitude + wUts + wUas;
        const finalGradeRaw = totalWeight > 0 
          ? (avgTasks * wTasks + attitudeScore * wAttitude + uts * wUts + uas * wUas) / totalWeight
          : 0;
        
        const finalGrade = Math.round(finalGradeRaw * 10) / 10;
        const isPassed = finalGrade >= kkm;

        return {
          ...student,
          avgTasks,
          attitudeScore,
          uts,
          uas,
          finalGrade,
          isPassed
        };
      });

    // Apply client-side search query
    if (!searchTerm) return items;
    return items.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.nisn.includes(searchTerm)
    );
  }, [students, selectedClass, taskAveragesMap, attitudeScoresMap, examGrades, wTasks, wAttitude, wUts, wUas, kkm, searchTerm]);

  // Summary Metrics
  const classStats = useMemo(() => {
    if (!classLedger.length) return { avgClass: 0, passedCount: 0, remedialCount: 0, passRate: 0 };
    const totalGrades = classLedger.reduce((acc, curr) => acc + curr.finalGrade, 0);
    const avgClass = Math.round((totalGrades / classLedger.length) * 10) / 10;
    const passedCount = classLedger.filter(item => item.isPassed).length;
    const remedialCount = classLedger.length - passedCount;
    const passRate = Math.round((passedCount / classLedger.length) * 100);

    return { avgClass, passedCount, remedialCount, passRate };
  }, [classLedger]);

  // --- ACTIONS: EXPORT CSV ---
  const handleExportCSV = () => {
    const headers = ["NISN", "Nama Siswa", "Kelas", "Rata-rata Tugas", "Nilai Sikap/Karakter", "UTS", "UAS", "Nilai Akhir", "Status Kelulusan"];
    const rows = classLedger.map(item => [
      item.nisn,
      item.name,
      item.className,
      item.avgTasks,
      item.attitudeScore,
      item.uts,
      item.uas,
      item.finalGrade,
      item.isPassed ? "LULUS" : "REMEDIAL"
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.map(val => `"${val}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Rekap_Nilai_${selectedClass}_KKM_${kkm}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- ACTIONS: PRINT ---
  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="grade-recap-root" className="space-y-6">
      {/* Header Panel */}
      <div className="bg-white p-5 rounded-2xl border border-natural-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <div className="bg-natural-accent text-natural-mid p-2.5 rounded-xl border border-natural-border/50">
            <Percent size={20} />
          </div>
          <div>
            <h3 className="font-bold text-natural-dark text-base font-sans">Rekapitulasi Nilai Akhir</h3>
            <p className="text-slate-400 text-xs font-medium">Buku nilai gabungan otomatis tugas, sikap kedisiplinan, uts, dan uas bimbingan.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Class selection */}
          <select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setEditingExamId(null);
            }}
            className="bg-natural-accent border border-natural-border text-natural-dark text-xs font-semibold rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-natural-sage cursor-pointer"
          >
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Settings Trigger */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              showSettings 
                ? "bg-[#8DA47E]/10 border-natural-sage text-natural-dark" 
                : "bg-natural-accent border border-natural-border hover:bg-natural-light text-natural-dark"
            }`}
            title="Pengaturan Bobot Nilai & KKM"
          >
            <Settings size={16} />
          </button>

          {/* Export Actions */}
          <button
            onClick={handleExportCSV}
            className="bg-natural-accent hover:bg-natural-light text-natural-dark font-bold text-xs rounded-xl px-4 py-2 flex items-center gap-1.5 transition-colors cursor-pointer border border-natural-border"
          >
            <Download size={14} /> Export CSV
          </button>

          <button
            onClick={handlePrint}
            className="bg-natural-mid hover:bg-natural-dark text-white font-bold text-xs rounded-xl px-4.5 py-2 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer size={14} /> Cetak Buku Nilai
          </button>
        </div>
      </div>

      {/* Weights settings drawer */}
      {showSettings && (
        <div className="bg-[#FBFBFA] border border-natural-border p-5 rounded-2xl shadow-inner space-y-4 print:hidden">
          <div className="flex justify-between items-center border-b border-natural-border/50 pb-1.5">
            <h4 className="font-bold text-xs uppercase text-natural-dark flex items-center gap-1.5">
              <Settings size={14} className="text-natural-mid" /> Pengaturan Formulir Penilaian & Standar KKM
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">Bobot harus berjumlah 100%</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">KKM Kelulusan</span>
              <input
                type="number"
                min={50}
                max={100}
                value={kkm}
                onChange={(e) => setKkm(parseInt(e.target.value) || 75)}
                className="w-full bg-white border border-natural-border rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-natural-sage text-natural-dark"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Bobot Tugas (%)</span>
              <input
                type="number"
                min={0}
                max={100}
                value={wTasks}
                onChange={(e) => setWTasks(parseInt(e.target.value) || 0)}
                className="w-full bg-white border border-natural-border rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-natural-sage text-natural-dark"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Bobot Sikap (%)</span>
              <input
                type="number"
                min={0}
                max={100}
                value={wAttitude}
                onChange={(e) => setWAttitude(parseInt(e.target.value) || 0)}
                className="w-full bg-white border border-natural-border rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-natural-sage text-natural-dark"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Bobot UTS (%)</span>
              <input
                type="number"
                min={0}
                max={100}
                value={wUts}
                onChange={(e) => setWUts(parseInt(e.target.value) || 0)}
                className="w-full bg-white border border-natural-border rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-natural-sage text-natural-dark"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Bobot UAS (%)</span>
              <input
                type="number"
                min={0}
                max={100}
                value={wUas}
                onChange={(e) => setWUas(parseInt(e.target.value) || 0)}
                className="w-full bg-white border border-natural-border rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-natural-sage text-natural-dark"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1.5">
            <span className={`font-bold ${wTasks + wAttitude + wUts + wUas === 100 ? "text-natural-mid" : "text-rose-600"}`}>
              Total Akumulasi Bobot: {wTasks + wAttitude + wUts + wUas}% 
              {wTasks + wAttitude + wUts + wUas !== 100 && " (Harus senilai 100% agar perhitungan valid!)"}
            </span>
            <button
              onClick={() => {
                setWTasks(40);
                setWAttitude(20);
                setWUts(20);
                setWUas(20);
                setKkm(75);
              }}
              className="text-slate-400 hover:text-natural-dark text-[10px] font-bold flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw size={10} /> Reset Default
            </button>
          </div>
        </div>
      )}

      {/* Printable Paper Header (hidden by default on screen) */}
      <div className="hidden print:block text-center border-b-4 border-double border-slate-800 pb-4 mb-6">
        <h2 className="text-xl font-bold uppercase tracking-wide">Pemerintah Provinsi Jawa Timur</h2>
        <h3 className="text-lg font-bold uppercase leading-snug">Dinas Pendidikan SMKN 6 Jember</h3>
        <p className="text-xs text-slate-500">Kompetensi Keahlian: Rekayasa Perangkat Lunak (RPL)</p>
        <p className="text-xs text-slate-500 italic">Jl. PB. Sudirman No. 110, Jember, Jawa Timur • Telp (0331) 486110</p>
        <h4 className="text-sm font-bold uppercase tracking-wide mt-4">Buku Rekap Nilai Hasil Belajar Siswa</h4>
        <div className="flex justify-center gap-8 mt-2 text-xs font-mono">
          <span>Kelas: {selectedClass}</span>
          <span>Semester: 1 (Ganjil)</span>
          <span>Tahun Ajaran: 2026/2027</span>
        </div>
      </div>      {/* Fast search bar */}
      <div className="flex items-center gap-2 bg-white px-3 py-1.5 border border-natural-border rounded-xl max-w-sm shadow-3xs print:hidden">
        <Search size={15} className="text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari siswa rpl atau NISN..."
          className="bg-transparent border-none text-xs w-full focus:outline-none font-medium text-natural-dark placeholder-slate-400"
        />
      </div>

      {/* Class Metrics overview bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 print:grid-cols-4">
        <div className="bg-white p-4 rounded-xl border border-natural-border text-center shadow-3xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">Rata-rata Kelas</span>
          <span className="text-lg font-bold text-natural-dark">{classStats.avgClass}</span>
          <span className="text-[10px] text-slate-500 block">Poin Gabungan</span>
        </div>
        <div className="bg-natural-accent/40 p-4 rounded-xl border border-natural-border text-center shadow-3xs">
          <span className="text-[10px] text-natural-mid uppercase font-bold block mb-0.5">Tingkat Kelulusan</span>
          <span className="text-lg font-bold text-natural-dark">{classStats.passRate}%</span>
          <span className="text-[10px] text-natural-mid/80 block">Diatas KKM ({kkm})</span>
        </div>
        <div className="bg-[#E8EDDF]/40 p-4 rounded-xl border border-natural-border text-center shadow-3xs">
          <span className="text-[10px] text-natural-mid uppercase font-bold block mb-0.5">Siswa Lulus</span>
          <span className="text-lg font-bold text-natural-dark">{classStats.passedCount}</span>
          <span className="text-[10px] text-natural-mid/80 block">Orang</span>
        </div>
        <div className="bg-rose-50/40 p-4 rounded-xl border border-rose-100 text-center shadow-3xs">
          <span className="text-[10px] text-rose-700 uppercase font-bold block mb-0.5">Remedial</span>
          <span className="text-lg font-bold text-rose-800">{classStats.remedialCount}</span>
          <span className="text-[10px] text-rose-600 block">Siswa Butuh Bimbingan</span>
        </div>
      </div>

      {/* Main Ledger Table */}
      <div className="bg-white rounded-2xl border border-natural-border shadow-xs overflow-hidden print:border-none print:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse print:text-[11px]">
            <thead>
              <tr className="bg-natural-accent/60 border-b border-natural-border/70 text-natural-dark font-bold text-[11px] uppercase tracking-wider print:bg-slate-100 print:text-slate-800">
                <th className="py-3 px-4">No</th>
                <th className="py-3 px-4">Nama Siswa</th>
                <th className="py-3 px-4 font-mono">NISN</th>
                <th className="py-3 px-4 text-center">Rata-rata Tugas ({wTasks}%)</th>
                <th className="py-3 px-4 text-center">Nilai Sikap ({wAttitude}%)</th>
                <th className="py-3 px-4 text-center">UTS ({wUts}%)</th>
                <th className="py-3 px-4 text-center">UAS ({wUas}%)</th>
                <th className="py-3 px-4 text-center font-bold">Nilai Akhir</th>
                <th className="py-3 px-4 text-center print:text-left">Status ({kkm})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-natural-border/40">
              {classLedger.length > 0 ? (
                classLedger.map((item, index) => {
                  const isEditing = editingExamId === item.id;
                  return (
                    <tr key={item.id} className="hover:bg-[#FBFBFA]/30 transition-colors text-xs print:hover:bg-transparent">
                      <td className="py-3.5 px-4 font-mono text-slate-400">{index + 1}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-natural-dark block">{item.name}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">{item.nisn}</td>
                      
                      {/* Calculated Task Average */}
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-natural-dark">{item.avgTasks}</td>

                      {/* Calculated Attitude Score */}
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-natural-dark">{item.attitudeScore}</td>

                      {/* UTS Exam Grade */}
                      <td className="py-3.5 px-4 text-center">
                        {isEditing ? (
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={localUts}
                            onChange={(e) => setLocalUts(parseInt(e.target.value) || 0)}
                            className="w-14 bg-white border border-natural-border rounded-lg p-1 text-center font-mono text-xs focus:outline-none focus:border-natural-sage text-natural-dark"
                          />
                        ) : (
                          <span className="font-mono text-slate-600">{item.uts}</span>
                        )}
                      </td>

                      {/* UAS Exam Grade */}
                      <td className="py-3.5 px-4 text-center">
                        {isEditing ? (
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={localUas}
                            onChange={(e) => setLocalUas(parseInt(e.target.value) || 0)}
                            className="w-14 bg-white border border-natural-border rounded-lg p-1 text-center font-mono text-xs focus:outline-none focus:border-natural-sage text-natural-dark"
                          />
                        ) : (
                          <span className="font-mono text-slate-600">{item.uas}</span>
                        )}
                      </td>

                      {/* FINAL GRADE */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-mono font-bold text-sm text-natural-dark bg-natural-accent border border-natural-border/50 px-2 py-1 rounded">
                          {item.finalGrade}
                        </span>
                      </td>

                      {/* Status graduation */}
                      <td className="py-3.5 px-4 text-center print:text-left">
                        {isEditing ? (
                          <button
                            type="button"
                            onClick={() => handleSaveExams(item.id)}
                            className="bg-natural-mid hover:bg-[#2C3E2D] text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg shadow-3xs cursor-pointer"
                          >
                            Simpan
                          </button>
                        ) : (
                          <div className="flex items-center justify-center gap-1.5 print:justify-start">
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase inline-flex items-center gap-1 ${
                              item.isPassed 
                                ? "bg-[#8DA47E]/15 text-natural-dark border border-[#8DA47E]/30" 
                                : "bg-rose-100 text-rose-800 border border-rose-200"
                            }`}>
                              {item.isPassed ? <CheckCircle size={10} /> : <AlertTriangle size={10} />}
                              {item.isPassed ? "Lulus" : "Remedial"}
                            </span>

                            {/* Easy inline exam triggers */}
                            <button
                              onClick={() => startEditingExams(item.id, item.uts, item.uas)}
                              className="text-slate-400 hover:text-natural-dark p-1 rounded-md hover:bg-natural-accent transition-colors print:hidden cursor-pointer"
                              title="Edit Nilai Ujian"
                            >
                              <Settings size={11} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 text-xs">
                    Siswa tidak ditemukan. Silakan periksa pencarian Anda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Signature blocks (Visible only when printing) */}
      <div className="hidden print:grid grid-cols-2 gap-10 mt-16 text-center text-xs">
        <div>
          <p>Mengetahui,</p>
          <p>Kepala Sekolah SMKN 6 Jember</p>
          <div className="h-20"></div>
          <p className="font-bold underline">Drs. H. Priwahyu Hartono, M.Pd</p>
          <p className="text-[10px] text-slate-500">NIP. 19681124 199303 1 005</p>
        </div>
        <div>
          <p>Jember, {new Date().toLocaleDateString("id-ID", { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p>Guru Mata Pelajaran RPL</p>
          <div className="h-20"></div>
          <p className="font-bold underline">Ryan Maulana, S.Kom.</p>
          <p className="text-[10px] text-slate-500">NIP. 19940823 202112 1 002</p>
        </div>
      </div>
    </div>
  );
}
