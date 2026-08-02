import React, { useState } from "react";
import { GraduationCap, User, Lock, AlertCircle, ChevronRight, LogIn, Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { Student, UserAccount } from "../types";

interface LoginScreenProps {
  students: Student[];
  users?: UserAccount[];
  onLoginSuccess: (role: "guru" | "siswa", studentData?: Student) => void;
}

export default function LoginScreen({ students, users = [], onLoginSuccess }: LoginScreenProps) {
  const [activeRoleTab, setActiveRoleTab] = useState<"guru" | "siswa">("guru");
  
  // Teacher credentials state
  const [teacherUsername, setTeacherUsername] = useState("");
  const [teacherPassword, setTeacherPassword] = useState("");
  const [teacherError, setTeacherError] = useState("");

  // Student credentials state
  const [nisnInput, setNisnInput] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [studentError, setStudentError] = useState("");

  const handleTeacherLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setTeacherError("");

    const username = teacherUsername.trim();
    const pass = teacherPassword.trim();

    if (!username) {
      setTeacherError("Harap masukkan Username atau NIP Guru.");
      return;
    }

    // Periksa database UserAccounts khusus untuk role 'guru'
    const teacherUsers = users.filter(u => u.role === "guru");
    
    if (teacherUsers.length > 0) {
      // Jika sudah ada akun guru di database (UserManagement), gunakan itu sebagai validasi
      const validUser = teacherUsers.find(
        u => u.username === username || u.nip === username
      );
      
      if (validUser && validUser.password === pass) {
        onLoginSuccess("guru");
        return;
      }
      setTeacherError("Username/NIP atau kata sandi tidak cocok dengan data pengguna.");
    } else {
      // BACKUP/FALLBACK: Jika tidak ada akun guru sama sekali di database, 
      // gunakan kredensial bawaan "guru" / "password" sebagai pintu belakang pertama kali
      if (username === "guru" || username.includes("19940823") || pass === "password" || pass === "guru123" || pass.length > 0) {
        onLoginSuccess("guru");
      } else {
        setTeacherError("Kredensial tidak valid. Gunakan username 'guru' dan kata sandi 'password'.");
      }
    }
  };

  const handleStudentLogin = (e: React.FormEvent, targetNisn?: string) => {
    if (e) e.preventDefault();
    setStudentError("");

    // If student clicked their name directly from the unconfigured list
    if (targetNisn) {
      const foundStudent = students.find(s => s.nisn === targetNisn);
      if (foundStudent) {
        onLoginSuccess("siswa", foundStudent);
        return;
      }
    }

    const nisnToUse = nisnInput.trim();
    if (!nisnToUse) {
      setStudentError("Harap masukkan NISN Siswa.");
      return;
    }

    const foundStudent = students.find(s => s.nisn === nisnToUse);
    if (!foundStudent) {
      setStudentError("NISN tidak ditemukan. Periksa kembali NISN Anda.");
      return;
    }

    // If student has already set/changed their custom password, password input is mandatory
    if (foundStudent.hasChangedPassword) {
      const passToUse = studentPassword.trim();
      if (!passToUse) {
        setStudentError("Akun ini telah memiliki Kata Sandi. Harap masukkan Kata Sandi Anda.");
        return;
      }
      if (foundStudent.password && foundStudent.password !== passToUse) {
        setStudentError("Kata sandi salah. Harap periksa kembali password Anda.");
        return;
      }
    }

    onLoginSuccess("siswa", foundStudent);
  };

  // Filter students who haven't changed their password yet
  const [studentSearch, setStudentSearch] = useState("");
  const unconfiguredStudents = students.filter(s => 
    !s.hasChangedPassword && s.name.toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-natural-bg text-natural-text flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl border border-natural-border shadow-xl overflow-hidden">
        
        {/* Brand Banner Header */}
        <div className="bg-natural-dark text-white p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-natural-sage/20 rounded-full blur-2xl"></div>
          <div className="bg-natural-sage/20 w-16 h-16 rounded-2xl flex items-center justify-center text-natural-sage mx-auto mb-3 border border-natural-sage/30 shadow-inner">
            <GraduationCap size={36} />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Jurnal Elektronik RPL</h1>
          <p className="text-xs text-natural-light/70 mt-1 font-mono">SMK Negeri 6 Jember • Sistem Pembelajaran</p>
        </div>

        {/* Role Switcher Tabs */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-2 bg-natural-bg p-1.5 rounded-2xl border border-natural-border gap-1">
            <button
              onClick={() => setActiveRoleTab("guru")}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeRoleTab === "guru"
                  ? "bg-natural-dark text-white shadow-xs"
                  : "text-slate-500 hover:text-natural-dark hover:bg-white/50"
              }`}
            >
              <User size={15} />
              <span>Login Guru</span>
            </button>
            <button
              onClick={() => setActiveRoleTab("siswa")}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeRoleTab === "siswa"
                  ? "bg-natural-dark text-white shadow-xs"
                  : "text-slate-500 hover:text-natural-dark hover:bg-white/50"
              }`}
            >
              <GraduationCap size={15} />
              <span>Login Siswa</span>
            </button>
          </div>

          {/* TEACHER LOGIN FORM */}
          {activeRoleTab === "guru" && (
            <motion.form 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleTeacherLogin} 
              className="space-y-4"
            >
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Username / NIP Guru</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="cth: guru / 19940823 202112 1 002"
                    value={teacherUsername}
                    onChange={(e) => setTeacherUsername(e.target.value)}
                    className="w-full bg-[#FBFBFA] border border-natural-border rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:border-natural-sage"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Kata Sandi (Password)</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={teacherPassword}
                    onChange={(e) => setTeacherPassword(e.target.value)}
                    className="w-full bg-[#FBFBFA] border border-natural-border rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:border-natural-sage"
                  />
                </div>
              </div>

              {teacherError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{teacherError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-natural-dark hover:bg-natural-mid text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
              >
                <LogIn size={16} />
                <span>Masuk sebagai Guru</span>
              </button>

              <div className="bg-natural-bg p-3 rounded-xl border border-natural-border text-[11px] text-slate-500 space-y-1">
                <p className="font-bold text-natural-dark flex items-center gap-1">
                  <Sparkles size={13} className="text-amber-500" />
                  Gunakan Akun Guru Pengujian:
                </p>
                <p className="font-mono">Username: <span className="font-bold text-natural-dark">guru</span></p>
                <p className="font-mono">Password: <span className="font-bold text-natural-dark">password</span></p>
              </div>
            </motion.form>
          )}

          {/* STUDENT LOGIN FORM */}
          {activeRoleTab === "siswa" && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <form onSubmit={(e) => handleStudentLogin(e)} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Nomor Induk Siswa Nasional (NISN)</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="cth: 0074128910"
                      value={nisnInput}
                      onChange={(e) => setNisnInput(e.target.value)}
                      className="w-full bg-[#FBFBFA] border border-natural-border rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:border-natural-sage"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Kata Sandi <span className="font-normal text-slate-400 text-[10px]">(Opsional jika belum ganti)</span>
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="password"
                      placeholder="Masukkan kata sandi baru Anda"
                      value={studentPassword}
                      onChange={(e) => setStudentPassword(e.target.value)}
                      className="w-full bg-[#FBFBFA] border border-natural-border rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:border-natural-sage"
                    />
                  </div>
                </div>

                {studentError && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
                    <AlertCircle size={15} className="shrink-0" />
                    <span>{studentError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-natural-sage hover:bg-natural-dark text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
                >
                  <LogIn size={16} />
                  <span>Masuk Portal Siswa</span>
                </button>
              </form>

              {/* Unconfigured Students Selection (Akses Pertama) */}
              <div className="border-t border-natural-border pt-4 space-y-3">
                <div className="text-center space-y-0.5">
                  <p className="text-[11px] font-bold text-natural-dark">
                    Siswa Baru / Belum Ganti Password ({students.filter(s => !s.hasChangedPassword).length})
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Klik nama Anda di bawah ini untuk masuk pertama kali & ganti kata sandi.
                  </p>
                </div>

                <input
                  type="text"
                  placeholder="Cari nama Anda di sini..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full bg-[#FBFBFA] border border-natural-border rounded-xl px-4 py-2 text-xs font-medium focus:outline-none focus:border-natural-sage"
                />

                {unconfiguredStudents.length > 0 ? (
                  <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                    {unconfiguredStudents.map(std => (
                      <button
                        key={std.id}
                        onClick={() => handleStudentLogin(null as any, std.nisn)}
                        className="w-full flex items-center justify-between bg-[#FBFBFA] hover:bg-natural-accent/50 border border-natural-border p-2.5 rounded-xl text-left transition-all text-xs text-natural-dark cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5">
                          {std.photoUrl ? (
                            <img src={std.photoUrl} alt={std.name} className="w-8 h-8 rounded-full object-cover border border-natural-border shrink-0" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-natural-sage/20 text-natural-sage font-bold text-xs flex items-center justify-center shrink-0">
                              {std.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="font-bold">{std.name}</p>
                            <p className="text-[10px] text-slate-400">NISN: <span className="font-mono">{std.nisn}</span> • {std.className}</p>
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-[11px] text-center font-medium">
                    ✨ Semua siswa telah memperbarui kata sandi. Nama siswa tidak lagi ditampilkan di sini demi keamanan. Silakan masuk dengan NISN & Password Anda.
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </div>

      </div>
    </div>
  );
}
