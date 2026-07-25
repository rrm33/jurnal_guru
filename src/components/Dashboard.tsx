import { useMemo } from "react";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend,
  AreaChart,
  Area
} from "recharts";
import { 
  Users, 
  BookOpen, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  ShieldAlert,
  Award
} from "lucide-react";
import { Student, LessonPlan, Attendance, TaskSubmission, DisciplineLog, AttendanceStatus } from "../types";

interface DashboardProps {
  students: Student[];
  lessonPlans: LessonPlan[];
  attendance: Attendance[];
  submissions: TaskSubmission[];
  disciplineLogs: DisciplineLog[];
}

export default function Dashboard({
  students,
  lessonPlans,
  attendance,
  submissions,
  disciplineLogs
}: DashboardProps) {
  // 1. Metric Calculations
  const totalStudents = students.length;
  const totalClasses = useMemo(() => {
    const classes = new Set(students.map(s => s.className));
    return classes.size || 2;
  }, [students]);

  const completedLessons = useMemo(() => {
    return lessonPlans.filter(lp => lp.status === "Completed").length;
  }, [lessonPlans]);

  const totalLessons = lessonPlans.length;
  const lessonProgressPercent = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // 2. Attendance Stats
  const attendanceStats = useMemo(() => {
    if (!attendance.length) return { present: 100, sick: 0, izin: 0, alpa: 0, total: 0 };
    const counts = { Hadir: 0, Sakit: 0, Izin: 0, Alpa: 0 };
    attendance.forEach(att => {
      if (counts[att.status] !== undefined) {
        counts[att.status]++;
      }
    });
    const total = attendance.length;
    return {
      present: Math.round((counts[AttendanceStatus.HADIR] / total) * 100) || 0,
      sick: Math.round((counts[AttendanceStatus.SAKIT] / total) * 100) || 0,
      izin: Math.round((counts[AttendanceStatus.IZIN] / total) * 100) || 0,
      alpa: Math.round((counts[AttendanceStatus.ALPA] / total) * 100) || 0,
      total
    };
  }, [attendance]);

  const pieData = [
    { name: "Hadir", value: attendanceStats.present, color: "#8DA47E" },
    { name: "Sakit", value: attendanceStats.sick, color: "#3E5240" },
    { name: "Izin", value: attendanceStats.izin, color: "#E8A243" },
    { name: "Alpa", value: attendanceStats.alpa, color: "#C85C5C" }
  ].filter(d => d.value > 0);

  // 3. Task Submission Stats
  const submissionStats = useMemo(() => {
    if (!submissions.length) return { selesai: 0, pending: 0, belum: 0 };
    let selesai = 0;
    let pending = 0;
    let belum = 0;

    submissions.forEach(sub => {
      if (sub.status === "Selesai") selesai++;
      else if (sub.status === "Menunggu Penilaian") pending++;
      else belum++;
    });

    return { selesai, pending, belum };
  }, [submissions]);

  const submissionChartData = [
    { name: "Selesai", Jumlah: submissionStats.selesai, fill: "#8DA47E" },
    { name: "Menunggu", Jumlah: submissionStats.pending, fill: "#E8A243" },
    { name: "Belum", Jumlah: submissionStats.belum, fill: "#C85C5C" }
  ];

  // 4. Class Performance Distribution (Mock averages based on actual grades if available, or static averages for visual design)
  const classGradesData = useMemo(() => {
    const classMap: { [key: string]: { totalGrade: number; count: number } } = {};
    students.forEach(std => {
      // Get student submissions
      const stdSubs = submissions.filter(s => s.studentId === std.id && s.grade !== undefined);
      const avgGrade = stdSubs.length 
        ? stdSubs.reduce((acc, curr) => acc + (curr.grade || 0), 0) / stdSubs.length 
        : 82; // fallback average if no graded submissions yet

      if (!classMap[std.className]) {
        classMap[std.className] = { totalGrade: 0, count: 0 };
      }
      classMap[std.className].totalGrade += avgGrade;
      classMap[std.className].count++;
    });

    return Object.keys(classMap).map(cls => ({
      name: cls,
      "Rata-rata Nilai": Math.round((classMap[cls].totalGrade / classMap[cls].count) * 10) / 10
    }));
  }, [students, submissions]);

  // 5. Discipline Overview
  const disciplineStats = useMemo(() => {
    let positif = 0;
    let negatif = 0;
    disciplineLogs.forEach(log => {
      if (log.type === "Positif") positif += Math.abs(log.points);
      else negatif += Math.abs(log.points);
    });
    return { positif, negatif };
  }, [disciplineLogs]);

  const disciplineChartData = [
    { name: "Prestasi / Positif (+)", Poin: disciplineStats.positif, color: "#8DA47E" },
    { name: "Pelanggaran / Negatif (-)", Poin: disciplineStats.negatif, color: "#C85C5C" }
  ];

  // List recent incidents
  const recentLogs = useMemo(() => {
    return [...disciplineLogs]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 4);
  }, [disciplineLogs]);

  // Student list map for name search in recent logs
  const studentMap = useMemo(() => {
    const map: { [key: string]: Student } = {};
    students.forEach(s => {
      map[s.id] = s;
    });
    return map;
  }, [students]);

  return (
    <div id="dashboard-root" className="space-y-6">
      {/* Top Banner - Welcome */}
      <div className="bg-gradient-to-r from-natural-dark to-natural-mid rounded-2xl p-6 text-white shadow-sm border border-natural-mid/30">
        <h2 className="text-2xl font-bold tracking-tight">Selamat Datang di Jurnal Mengajar Guru</h2>
        <p className="text-natural-light/85 mt-2 text-sm max-w-2xl">
          SMKN 6 Jember • Kompetensi Keahlian Rekayasa Perangkat Lunak (RPL). Pantau kehadiran, perkembangan tugas, kedisiplinan, dan rekap nilai secara transparan dan terstruktur.
        </p>
        <div className="flex flex-wrap gap-4 mt-4 text-xs font-mono">
          <span className="bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-xs flex items-center gap-1.5 border border-white/5 text-natural-light">
            <Users size={14} /> {totalStudents} Siswa RPL Terdaftar
          </span>
          <span className="bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-xs flex items-center gap-1.5 border border-white/5 text-natural-light">
            <BookOpen size={14} /> {totalClasses} Kelas Bimbingan
          </span>
          <span className="bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-xs flex items-center gap-1.5 border border-white/5 text-natural-light">
            <Calendar size={14} /> Progres RPP: {lessonProgressPercent}%
          </span>
        </div>
      </div>

      {/* Grid Quick Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Attendance Rate */}
        <div className="bg-white p-5 rounded-2xl border border-natural-border shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Persentase Hadir</p>
            <h3 className="text-2xl font-bold text-natural-dark">{attendanceStats.present}%</h3>
            <p className="text-natural-sage text-xs flex items-center gap-1 font-medium">
              <TrendingUp size={12} /> Target Sekolah: &gt;90%
            </p>
          </div>
          <div className="bg-natural-accent text-natural-dark p-3.5 rounded-xl">
            <Calendar size={22} />
          </div>
        </div>

        {/* Card 2: Syllabus Progress */}
        <div className="bg-white p-5 rounded-2xl border border-natural-border shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Rencana Semester</p>
            <h3 className="text-2xl font-bold text-natural-dark">{completedLessons} / {totalLessons}</h3>
            <div className="w-24 bg-natural-accent h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div 
                className="bg-natural-sage h-full rounded-full transition-all duration-500"
                style={{ width: `${lessonProgressPercent}%` }}
              ></div>
            </div>
          </div>
          <div className="bg-natural-accent text-natural-dark p-3.5 rounded-xl">
            <BookOpen size={22} />
          </div>
        </div>

        {/* Card 3: Pending Tasks */}
        <div className="bg-white p-5 rounded-2xl border border-natural-border shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Tugas Menunggu Dinilai</p>
            <h3 className="text-2xl font-bold text-amber-600">{submissionStats.pending}</h3>
            <p className="text-slate-500 text-xs">
              Dari {submissions.length} entri pengumpulan
            </p>
          </div>
          <div className="bg-amber-50 text-amber-600 p-3.5 rounded-xl">
            <CheckCircle size={22} />
          </div>
        </div>

        {/* Card 4: Action Points */}
        <div className="bg-white p-5 rounded-2xl border border-natural-border shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Log Kedisiplinan</p>
            <h3 className="text-2xl font-bold text-natural-dark">{disciplineLogs.length}</h3>
            <p className="text-rose-600 text-xs flex items-center gap-1">
              <AlertCircle size={12} /> Total {disciplineLogs.filter(d => d.type === "Negatif").length} pelanggaran tercatat
            </p>
          </div>
          <div className="bg-natural-accent text-natural-dark p-3.5 rounded-xl">
            <ShieldAlert size={22} />
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Chart: Attendance Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-natural-border shadow-xs lg:col-span-1">
          <h4 className="text-natural-dark font-bold text-sm mb-4">Grafik Kehadiran Semester Ini</h4>
          <div className="h-64 flex flex-col justify-between">
            {pieData.length > 0 ? (
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-44 w-full flex items-center justify-center text-slate-400 text-xs">
                Tidak ada data kehadiran
              </div>
            )}
            
            {/* Pie Legend custom */}
            <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-600 px-2">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#8DA47E] inline-block"></span>
                <span>Hadir ({attendanceStats.present}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#3E5240] inline-block"></span>
                <span>Sakit ({attendanceStats.sick}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#E8A243] inline-block"></span>
                <span>Izin ({attendanceStats.izin}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#C85C5C] inline-block"></span>
                <span>Alpa ({attendanceStats.alpa}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Chart: Class Performance (Average Grades) */}
        <div className="bg-white p-5 rounded-2xl border border-natural-border shadow-xs lg:col-span-1">
          <h4 className="text-natural-dark font-bold text-sm mb-4">Rata-rata Nilai Tugas per Kelas</h4>
          <div className="h-64 flex items-center justify-center">
            {classGradesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={classGradesData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94A3B8" />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="#94A3B8" />
                  <Tooltip formatter={(value) => [`${value} Poin`, "Rata-rata"]} />
                  <Bar dataKey="Rata-rata Nilai" radius={[6, 6, 0, 0]}>
                    {classGradesData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={idx % 2 === 0 ? "#8DA47E" : "#2C3E2D"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-slate-400 text-xs">Tidak ada data nilai bimbingan</div>
            )}
          </div>
        </div>

        {/* Right Chart: Tasks Completion Rate */}
        <div className="bg-white p-5 rounded-2xl border border-natural-border shadow-xs lg:col-span-1">
          <h4 className="text-natural-dark font-bold text-sm mb-4">Status Pengumpulan Tugas Siswa</h4>
          <div className="h-64 flex items-center justify-center">
            {submissions.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={submissionChartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94A3B8" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#94A3B8" />
                  <Tooltip />
                  <Bar dataKey="Jumlah" radius={[6, 6, 0, 0]}>
                    {submissionChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-slate-400 text-xs">Belum ada tugas atau pengumpulan yang diinput</div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Discipline Violations and Positive Points */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Discipline Points Chart */}
        <div className="bg-white p-5 rounded-2xl border border-natural-border shadow-xs lg:col-span-1">
          <h4 className="text-natural-dark font-bold text-sm mb-4">Akumulasi Poin Kedisiplinan</h4>
          <div className="h-56 flex flex-col justify-between">
            {disciplineStats.positif > 0 || disciplineStats.negatif > 0 ? (
              <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={disciplineChartData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                    <XAxis type="number" stroke="#94A3B8" tick={{ fontSize: 10 }} />
                    <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 10 }} stroke="#94A3B8" />
                    <Tooltip />
                    <Bar dataKey="Poin" radius={[0, 6, 6, 0]}>
                      {disciplineChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-40 w-full flex items-center justify-center text-slate-400 text-xs">
                Tidak ada log kedisiplinan semester ini
              </div>
            )}
            <p className="text-[11px] text-slate-400 leading-relaxed text-center italic">
              *Poin positif diperoleh dari kontribusi/bantuan, negatif diperoleh dari pelanggaran peraturan lab.
            </p>
          </div>
        </div>

        {/* Recent logs table/cards */}
        <div className="bg-white p-5 rounded-2xl border border-natural-border shadow-xs lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-natural-dark font-bold text-sm">Aktivitas & Kedisiplinan Terbaru</h4>
            <span className="text-[11px] font-mono text-natural-sage bg-natural-accent px-2 py-1 rounded">Real-time</span>
          </div>
          <div className="space-y-3">
            {recentLogs.length > 0 ? (
              recentLogs.map((log) => {
                const stdName = studentMap[log.studentId]?.name || "Siswa Tidak Dikenal";
                const stdClass = studentMap[log.studentId]?.className || "";
                const isPositif = log.type === "Positif";

                return (
                  <div 
                    key={log.id} 
                    className={`p-3 rounded-xl border flex items-start gap-3 transition-colors ${
                      isPositif ? "bg-natural-accent/30 border-natural-border/80" : "bg-rose-50/45 border-rose-100"
                    }`}
                  >
                    <div className={`p-2 rounded-lg mt-0.5 ${
                      isPositif ? "bg-natural-sage/20 text-natural-dark" : "bg-rose-100 text-rose-700"
                    }`}>
                      {isPositif ? <Award size={16} /> : <ShieldAlert size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-xs text-natural-dark truncate">{stdName} ({stdClass})</span>
                        <span className="text-[10px] text-slate-400 shrink-0">{log.date}</span>
                      </div>
                      <p className="text-slate-700 text-xs font-medium mt-1">
                        {log.category}
                      </p>
                      {log.notes && (
                        <p className="text-slate-500 text-[11px] mt-0.5 line-clamp-1 italic">
                          "{log.notes}"
                        </p>
                      )}
                    </div>
                    <div className={`font-mono text-xs font-bold ${
                      isPositif ? "text-natural-sage" : "text-rose-600"
                    }`}>
                      {isPositif ? `+${log.points}` : `${log.points}`}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10 text-slate-400 text-xs">
                Belum ada catatan pelanggaran atau apresiasi siswa.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
