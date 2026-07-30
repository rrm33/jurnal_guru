import { useState, useMemo, useEffect } from "react";
import { Calendar, UserCheck, CheckCircle2, XCircle, AlertCircle, RefreshCw, HelpCircle, Link as LinkIcon } from "lucide-react";
import { Student, Attendance, AttendanceStatus, LessonPlan } from "../types";

interface AttendanceProps {
  students: Student[];
  attendance: Attendance[];
  onSaveAttendance: (
    className: string, 
    date: string, 
    records: { studentId: string; status: AttendanceStatus; notes: string }[],
    lessonPlanId?: string
  ) => void;
  classes: string[];
  lessonPlans: LessonPlan[];
  initialLessonPlanId?: string;
  onClearInitialLessonPlanId?: () => void;
  onSelectStudentPhoto?: (student: Student) => void;
}

export default function AttendanceTracker({
  students,
  attendance,
  onSaveAttendance,
  classes,
  lessonPlans,
  initialLessonPlanId,
  onClearInitialLessonPlanId,
  onSelectStudentPhoto
}: AttendanceProps) {
  const [selectedClass, setSelectedClass] = useState<string>(classes[0] || "XI RPL 1");
  // Set date default to today (YYYY-MM-DD)
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });

  const [selectedLessonPlanId, setSelectedLessonPlanId] = useState<string>("");

  // Sync state when redirected from RPP "Presensi" button
  useEffect(() => {
    if (initialLessonPlanId) {
      setSelectedLessonPlanId(initialLessonPlanId);
      const plan = lessonPlans.find(p => p.id === initialLessonPlanId);
      if (plan) {
        setSelectedClass(plan.className);
      }
    }
  }, [initialLessonPlanId, lessonPlans]);

  // Filter students belonging to the selected class
  const classStudents = useMemo(() => {
    return students.filter(s => s.className === selectedClass);
  }, [students, selectedClass]);

  // Find existing attendance records for this class & date, or specific RPP
  const existingRecordsMap = useMemo(() => {
    const map: { [studentId: string]: Attendance } = {};
    attendance.forEach(att => {
      if (selectedLessonPlanId) {
        if (att.lessonPlanId === selectedLessonPlanId) {
          map[att.studentId] = att;
        }
      } else {
        if (att.className === selectedClass && att.date === selectedDate && !att.lessonPlanId) {
          map[att.studentId] = att;
        }
      }
    });
    return map;
  }, [attendance, selectedClass, selectedDate, selectedLessonPlanId]);

  // Local editing state for student statuses and notes
  const [localRecords, setLocalRecords] = useState<any>({});

  // Sync / initialize local records when class, date, RPP or existing records change
  const currentRecords = useMemo(() => {
    const records: { [studentId: string]: { status: AttendanceStatus; notes: string } } = {};
    classStudents.forEach(student => {
      const existing = existingRecordsMap[student.id];
      const local = localRecords[student.id];
      
      const isSameContext = 
        local && 
        localRecords._metaClass === selectedClass && 
        localRecords._metaDate === selectedDate &&
        localRecords._metaLessonPlanId === selectedLessonPlanId;

      if (isSameContext) {
        // Use local changes if they belong to current class/date/RPP context
        records[student.id] = local;
      } else if (existing) {
        records[student.id] = { status: existing.status, notes: existing.notes || "" };
      } else {
        // Default to Hadir if no record exists yet
        records[student.id] = { status: AttendanceStatus.HADIR, notes: "" };
      }
    });
    return records;
  }, [classStudents, existingRecordsMap, localRecords, selectedClass, selectedDate, selectedLessonPlanId]);

  const handleClassChange = (newClass: string) => {
    setSelectedClass(newClass);
    setSelectedLessonPlanId(""); // clear selected lesson plan when class changes
    setLocalRecords({});
    if (onClearInitialLessonPlanId) {
      onClearInitialLessonPlanId();
    }
  };

  const handleLessonPlanChange = (planId: string) => {
    setSelectedLessonPlanId(planId);
    setLocalRecords({});
    if (onClearInitialLessonPlanId) {
      onClearInitialLessonPlanId();
    }
    const plan = lessonPlans.find(p => p.id === planId);
    if (plan) {
      setSelectedClass(plan.className);
    }
  };

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setLocalRecords((prev: any) => ({
      ...prev,
      _metaClass: selectedClass,
      _metaDate: selectedDate,
      _metaLessonPlanId: selectedLessonPlanId,
      [studentId]: {
        status,
        notes: prev[studentId]?.notes || ""
      }
    }));
  };

  const handleNotesChange = (studentId: string, notes: string) => {
    setLocalRecords((prev: any) => ({
      ...prev,
      _metaClass: selectedClass,
      _metaDate: selectedDate,
      _metaLessonPlanId: selectedLessonPlanId,
      [studentId]: {
        status: prev[studentId]?.status || AttendanceStatus.HADIR,
        notes
      }
    }));
  };

  const handleSetAllPresent = () => {
    const updated: any = {
      _metaClass: selectedClass,
      _metaDate: selectedDate,
      _metaLessonPlanId: selectedLessonPlanId
    };
    classStudents.forEach(std => {
      updated[std.id] = { status: AttendanceStatus.HADIR, notes: "" };
    });
    setLocalRecords(updated);
  };

  const handleSave = () => {
    const payload = classStudents.map(std => {
      const rec = currentRecords[std.id];
      return {
        studentId: std.id,
        status: rec.status,
        notes: rec.notes
      };
    });

    onSaveAttendance(selectedClass, selectedDate, payload, selectedLessonPlanId || undefined);
    
    const label = selectedLessonPlanId 
      ? `pertemuan RPP "${lessonPlans.find(p => p.id === selectedLessonPlanId)?.topic}"` 
      : `tanggal ${selectedDate}`;
    alert(`Berhasil menyimpan presensi kelas ${selectedClass} untuk ${label}!`);
  };

  // Stats for the currently viewed class + date + RPP
  const stats = useMemo(() => {
    let hadir = 0;
    let sakit = 0;
    let izin = 0;
    let alpa = 0;
    const total = classStudents.length;

    classStudents.forEach(std => {
      const rec = currentRecords[std.id] || { status: AttendanceStatus.HADIR, notes: "" };
      if (rec.status === AttendanceStatus.HADIR) hadir++;
      else if (rec.status === AttendanceStatus.SAKIT) sakit++;
      else if (rec.status === AttendanceStatus.IZIN) izin++;
      else if (rec.status === AttendanceStatus.ALPA) alpa++;
    });

    return { hadir, sakit, izin, alpa, total };
  }, [classStudents, currentRecords]);

  const isPreExisting = useMemo(() => {
    return Object.keys(existingRecordsMap).length > 0;
  }, [existingRecordsMap]);

  return (
    <div id="attendance-root" className="space-y-6">
      {/* Control panel & Date selection */}
      <div className="bg-white p-5 rounded-2xl border border-natural-border shadow-xs">
        <div className="flex flex-col xl:flex-row gap-4 justify-between xl:items-center">
          <div className="flex items-center gap-3">
            <div className="bg-natural-accent text-natural-dark p-2 rounded-xl">
              <UserCheck size={20} />
            </div>
            <div>
              <h3 className="font-bold text-natural-dark text-base">Presensi & Kehadiran Siswa</h3>
              <p className="text-slate-500 text-xs">Catat kehadiran harian kelas bimbingan secara cepat dan akurat.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Class select */}
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Kelas</span>
              <select
                value={selectedClass}
                onChange={(e) => handleClassChange(e.target.value)}
                className="bg-natural-accent border border-natural-border text-natural-dark text-xs font-semibold rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-natural-sage cursor-pointer"
              >
                {classes.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Lesson Plan / Pertemuan Select */}
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Hubungkan RPP / Pertemuan</span>
              <select
                value={selectedLessonPlanId}
                onChange={(e) => handleLessonPlanChange(e.target.value)}
                className="bg-natural-accent border border-natural-border text-natural-dark text-xs font-semibold rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-natural-sage cursor-pointer"
              >
                <option value="">-- Presensi Umum (Tanpa RPP) --</option>
                {lessonPlans
                  .filter(p => p.className === selectedClass)
                  .map(p => (
                    <option key={p.id} value={p.id}>
                      Wk {p.week}: {p.topic.slice(0, 30)}{p.topic.length > 30 ? "..." : ""}
                    </option>
                  ))}
              </select>
            </div>

            {/* Date Select */}
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Tanggal Presensi</span>
              <div className="relative">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setLocalRecords({}); // clear unsaved modifications on date change
                  }}
                  className="bg-natural-accent border border-natural-border text-natural-dark text-xs font-semibold rounded-xl pl-3.5 pr-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-natural-sage cursor-pointer"
                />
              </div>
            </div>

            {/* Quick action: Set all as present */}
            <div className="self-end pb-0.5">
              <button
                type="button"
                onClick={handleSetAllPresent}
                className="bg-natural-accent hover:bg-natural-light text-natural-dark font-bold text-xs rounded-xl px-4 py-2 flex items-center gap-1.5 transition-colors cursor-pointer border border-natural-border"
              >
                <RefreshCw size={14} /> Set Semua Hadir
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Summary Stat bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4.5 rounded-2xl border border-natural-border shadow-2xs">
        <div className="bg-[#8DA47E]/10 p-3 rounded-xl border border-[#8DA47E]/20 text-center">
          <span className="text-[10px] text-natural-dark uppercase font-bold block mb-0.5">Hadir</span>
          <span className="text-xl font-bold text-natural-dark">{stats.hadir}</span>
          <span className="text-[10px] text-natural-sage block font-medium">Siswa</span>
        </div>
        <div className="bg-[#3E5240]/10 p-3 rounded-xl border border-[#3E5240]/20 text-center">
          <span className="text-[10px] text-natural-mid uppercase font-bold block mb-0.5">Sakit</span>
          <span className="text-xl font-bold text-natural-mid">{stats.sakit}</span>
          <span className="text-[10px] text-natural-mid/85 block font-medium">Siswa</span>
        </div>
        <div className="bg-[#E8A243]/10 p-3 rounded-xl border border-[#E8A243]/20 text-center">
          <span className="text-[10px] text-[#E8A243] uppercase font-bold block mb-0.5">Izin</span>
          <span className="text-xl font-bold text-[#E8A243]">{stats.izin}</span>
          <span className="text-[10px] text-[#E8A243]/85 block font-medium">Siswa</span>
        </div>
        <div className="bg-[#C85C5C]/10 p-3 rounded-xl border border-[#C85C5C]/20 text-center">
          <span className="text-[10px] text-[#C85C5C] uppercase font-bold block mb-0.5">Alpa</span>
          <span className="text-xl font-bold text-[#C85C5C]">{stats.alpa}</span>
          <span className="text-[10px] text-[#C85C5C]/85 block font-medium">Siswa</span>
        </div>
      </div>

      {/* Status Warning Alert */}
      <div className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
        isPreExisting 
          ? "bg-amber-50/40 border-amber-100 text-amber-800" 
          : "bg-[#FBFBFA] border-natural-border text-natural-dark"
      }`}>
        <div className="flex items-center gap-2">
          {isPreExisting ? <CheckCircle2 size={16} className="text-amber-600 shrink-0" /> : <HelpCircle size={16} className="text-natural-sage shrink-0" />}
          <span>
            {selectedLessonPlanId ? (
              <span>
                <strong>Terkoneksi dengan RPP:</strong> Week {lessonPlans.find(p => p.id === selectedLessonPlanId)?.week} - {lessonPlans.find(p => p.id === selectedLessonPlanId)?.topic}.
                {isPreExisting 
                  ? " Data presensi untuk pertemuan ini sudah ada dan dapat diubah." 
                  : " Belum ada data presensi tersimpan untuk pertemuan ini."}
              </span>
            ) : (
              <span>
                {isPreExisting 
                  ? `Telah ditemukan data presensi tertulis pada tanggal ${selectedDate} untuk kelas ${selectedClass}. Anda bisa merubah dan menimpa kembali.` 
                  : `Belum ada data presensi tersimpan untuk kelas ${selectedClass} tanggal ${selectedDate}. Anda mengedit data baru.`}
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Student List Table */}
      <div className="bg-white rounded-2xl border border-natural-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-natural-accent/60 border-b border-natural-border/70 text-natural-dark font-bold text-xs uppercase tracking-wider">
                <th className="py-3 px-4.5">No</th>
                <th className="py-3 px-4.5">Nama Siswa</th>
                <th className="py-3 px-4.5">NISN / L/P</th>
                <th className="py-3 px-4.5 text-center">Status Kehadiran</th>
                <th className="py-3 px-4.5">Keterangan / Alasan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-natural-border/40">
              {classStudents.length > 0 ? (
                classStudents.map((student, idx) => {
                  const record = currentRecords[student.id] || { status: AttendanceStatus.HADIR, notes: "" };
                  return (
                    <tr key={student.id} className="hover:bg-[#FBFBFA]/50 transition-colors">
                      <td className="py-3.5 px-4.5 font-mono text-xs text-slate-400">{idx + 1}</td>
                      <td className="py-3.5 px-4.5">
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => onSelectStudentPhoto && onSelectStudentPhoto(student)}
                            className="shrink-0 cursor-pointer group"
                            title="Klik untuk pratinjau foto siswa"
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
                            <span className="font-semibold text-xs text-natural-dark block">{student.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">ID: {student.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4.5 font-mono text-[11px] text-slate-500 space-y-0.5">
                        <div>{student.nisn}</div>
                        <div><span className="bg-natural-accent text-natural-dark px-1 py-0.5 rounded text-[9px] font-bold">{student.gender}</span></div>
                      </td>
                      
                      {/* Interactive radio-like pills */}
                      <td className="py-3.5 px-4.5 text-center">
                        <div className="inline-flex rounded-xl p-1 bg-natural-accent/80 border border-natural-border">
                          {Object.values(AttendanceStatus).map((statusValue) => {
                            const isSelected = record.status === statusValue;
                            
                            // Style presets based on status type
                            let activeStyle = "";
                            if (statusValue === AttendanceStatus.HADIR) activeStyle = "bg-natural-sage text-white shadow-xs";
                            else if (statusValue === AttendanceStatus.SAKIT) activeStyle = "bg-natural-mid text-white shadow-xs";
                            else if (statusValue === AttendanceStatus.IZIN) activeStyle = "bg-[#E8A243] text-white shadow-xs";
                            else if (statusValue === AttendanceStatus.ALPA) activeStyle = "bg-[#C85C5C] text-white shadow-xs";

                            return (
                              <button
                                key={statusValue}
                                type="button"
                                onClick={() => handleStatusChange(student.id, statusValue)}
                                className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
                                  isSelected ? activeStyle : "text-[#3A4138]/60 hover:text-natural-dark"
                                }`}
                              >
                                {statusValue}
                              </button>
                            );
                          })}
                        </div>
                      </td>

                      {/* Notes / Reason */}
                      <td className="py-3.5 px-4.5">
                        <input
                          type="text"
                          value={record.notes}
                          onChange={(e) => handleNotesChange(student.id, e.target.value)}
                          placeholder={record.status === AttendanceStatus.HADIR ? "Hadir tepat waktu..." : "Sakit apa / surat izin..."}
                          className="w-full bg-[#FBFBFA] hover:bg-white border border-natural-border rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:bg-white focus:border-natural-sage transition-colors"
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 text-xs">
                    Siswa tidak ditemukan untuk kelas {selectedClass}. Silakan muat ulang data atau periksa konfigurasi siswa.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer save block */}
        <div className="bg-[#FBFBFA] p-4 flex justify-between items-center border-t border-natural-border">
          <span className="text-[11px] text-slate-400 italic">
            *Pastikan semua data kehadiran telah diperiksa sebelum menekan Simpan Presensi.
          </span>
          <button
            type="button"
            onClick={handleSave}
            className="bg-natural-mid hover:bg-natural-dark text-white text-xs font-bold rounded-xl px-6 py-2.5 flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <CheckCircle2 size={15} /> Simpan Presensi Kelas
          </button>
        </div>
      </div>
    </div>
  );
}
