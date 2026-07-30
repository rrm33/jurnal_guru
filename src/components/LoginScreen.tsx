import React, { useState } from "react";
import { 
  GraduationCap, 
  ShieldCheck, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Sparkles,
  ArrowRight,
  School,
  CheckCircle2,
  Users
} from "lucide-react";
import { motion } from "motion/react";
import { UserAccount, Student } from "../types";

interface LoginScreenProps {
  users: UserAccount[];
  students: Student[];
  onLoginSuccess: (session: { role: "guru" | "siswa"; userAccount?: UserAccount; student?: Student }) => void;
}

export default function LoginScreen({ users, students, onLoginSuccess }: LoginScreenProps) {
  const [loginRole, setLoginRole] = useState<"guru" | "siswa">("guru");

  // Form states
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const term = usernameInput.trim();
    const pass = passwordInput.trim();

    if (!term) {
      setErrorMessage(loginRole === "guru" ? "Harap masukkan Username atau NIP." : "Harap masukkan NISN Siswa.");
      return;
    }
    if (!pass) {
      setErrorMessage("Harap masukkan Kata Sandi.");
      return;
    }

    if (loginRole === "guru") {
      // Find matching guru in users or default teacher profile
      const user = users.find(
        u => u.role === "guru" && (u.username.toLowerCase() === term.toLowerCase() || (u.nip && u.nip.replace(/\s+/g, "") === term.replace(/\s+/g, "")))
      );

      // Also allow default teacher NIP or 'guru'
      if (user) {
        if (user.password && user.password !== pass && pass !== "password" && pass !== "guru123") {
          setErrorMessage("Kata sandi salah. Coba password default 'password' atau 'guru123'.");
          return;
        }
        onLoginSuccess({ role: "guru", userAccount: user });
      } else if (term === "guru" || term === "19940823 202112 1 002" || term.replace(/\s+/g, "") === "199408232021121002") {
        if (pass !== "password" && pass !== "guru123" && pass !== "123") {
          setErrorMessage("Kata sandi salah. (Default: password)");
          return;
        }
        const defaultGuruUser: UserAccount = {
          id: "usr_guru_default",
          username: "guru",
          name: "Ryan Maulana, S.Kom.",
          role: "guru",
          nip: "19940823 202112 1 002"
        };
        onLoginSuccess({ role: "guru", userAccount: defaultGuruUser });
      } else {
        setErrorMessage("Akun Guru tidak ditemukan. Gunakan Username 'guru' dan Password 'password'.");
      }
    } else {
      // Siswa Login
      // Match by NISN or Username
      const std = students.find(s => s.nisn === term || s.id === term);
      const userAcc = users.find(u => u.role === "siswa" && (u.username === term || u.studentId === std?.id));

      if (std) {
        // Verify password if userAcc exists or fallback to default siswa password
        const expectedPass = userAcc?.password || std.password || "siswa123";
        if (pass !== expectedPass && pass !== "siswa123" && pass !== "123" && pass !== std.nisn) {
          setErrorMessage("Kata sandi siswa salah. (Default: siswa123)");
          return;
        }
        onLoginSuccess({ role: "siswa", student: std, userAccount: userAcc });
      } else {
        setErrorMessage("NISN tidak terdaftar. Pilih dari daftar demo siswa di bawah atau hubungi Guru.");
      }
    }
  };

  const handleQuickDemoLogin = (student: Student) => {
    const userAcc = users.find(u => u.studentId === student.id || u.username === student.nisn);
    onLoginSuccess({ role: "siswa", student, userAccount: userAcc });
  };

  return (
    <div className="min-h-screen bg-natural-bg text-natural-dark flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
      {/* Background Subtle Accent */}
      <div className="w-full max-w-md space-y-6">
        
        {/* Top Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-natural-sage/15 text-natural-sage border border-natural-sage/30 px-3.5 py-1.5 rounded-full text-xs font-bold font-mono">
            <School size={15} />
            <span>SMKN 6 JEMBER • REKAYASA PERANGKAT LUNAK</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-natural-dark tracking-tight">
            Jurnal & Portofolio Siswa
          </h1>
          <p className="text-xs text-natural-text/75 max-w-sm mx-auto">
            Sistem Informasi Pembelajaran, Presensi, Rekap Nilai & Portofolio Proyek Siswa RPL
          </p>
        </div>

        {/* Main Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 sm:p-8 rounded-3xl border border-natural-border shadow-md space-y-6"
        >
          {/* Role Tabs */}
          <div className="grid grid-cols-2 p-1 bg-natural-bg rounded-2xl border border-natural-border text-xs font-bold">
            <button
              onClick={() => {
                setLoginRole("guru");
                setErrorMessage("");
                setUsernameInput("guru");
                setPasswordInput("password");
              }}
              className={`py-3 px-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                loginRole === "guru"
                  ? "bg-natural-dark text-white shadow-xs font-bold"
                  : "text-slate-600 hover:text-natural-dark"
              }`}
            >
              <ShieldCheck size={16} />
              <span>Login Guru</span>
            </button>

            <button
              onClick={() => {
                setLoginRole("siswa");
                setErrorMessage("");
                setUsernameInput("0074128910");
                setPasswordInput("siswa123");
              }}
              className={`py-3 px-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                loginRole === "siswa"
                  ? "bg-natural-dark text-white shadow-xs font-bold"
                  : "text-slate-600 hover:text-natural-dark"
              }`}
            >
              <GraduationCap size={16} />
              <span>Login Siswa</span>
            </button>
          </div>

          {/* Role Header Info */}
          <div className="text-left space-y-1">
            <h2 className="text-base font-bold text-natural-dark flex items-center gap-2">
              {loginRole === "guru" ? (
                <>
                  <ShieldCheck className="text-indigo-600" size={18} />
                  <span>Portal Akses Guru / Pengajar</span>
                </>
              ) : (
                <>
                  <GraduationCap className="text-emerald-600" size={18} />
                  <span>Portal Akses Siswa RPL</span>
                </>
              )}
            </h2>
            <p className="text-xs text-slate-500">
              {loginRole === "guru"
                ? "Masukkan Username/NIP dan Kata Sandi untuk mengelola jurnal dan nilai."
                : "Masukkan Nomor Induk Siswa Nasional (NISN) dan Kata Sandi Anda."}
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-xl text-xs flex items-center gap-2.5 font-medium"
            >
              <AlertCircle size={18} className="shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-natural-dark mb-1.5">
                {loginRole === "guru" ? "Username / NIP Guru" : "NISN Siswa"}
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder={loginRole === "guru" ? "guru atau NIP" : "0074128910"}
                  className="w-full pl-10 pr-4 py-3 bg-natural-bg border border-natural-border rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-natural-sage"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-natural-dark mb-1.5">Kata Sandi (Password)</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Kata sandi"
                  className="w-full pl-10 pr-10 py-3 bg-natural-bg border border-natural-border rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-natural-sage"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-natural-dark hover:bg-natural-mid text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer text-xs"
            >
              <span>Masuk Sekarang</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Demo Help Credentials */}
          <div className="pt-3 border-t border-natural-border text-left space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-600">Akun Demo Pengujian:</span>
              <span className="text-natural-sage font-mono text-[10px]">Auto Fill Available</span>
            </div>

            {loginRole === "guru" ? (
              <div className="bg-natural-bg p-3 rounded-xl border border-natural-border font-mono text-[11px] space-y-1 text-slate-700">
                <p><span className="font-bold text-natural-dark">Username:</span> guru</p>
                <p><span className="font-bold text-natural-dark">Password:</span> password</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-[10px] text-slate-500 font-medium">Klik salah satu siswa di bawah untuk login langsung:</p>
                <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {students.slice(0, 6).map((std) => (
                    <button
                      key={std.id}
                      type="button"
                      onClick={() => handleQuickDemoLogin(std)}
                      className="p-2 bg-natural-bg hover:bg-emerald-50 border border-natural-border hover:border-emerald-300 rounded-xl text-left transition-colors cursor-pointer group"
                    >
                      <p className="font-bold text-[11px] text-natural-dark group-hover:text-emerald-800 truncate">{std.name}</p>
                      <p className="text-[9px] text-slate-500 font-mono">NISN: {std.nisn}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Footer info */}
        <p className="text-[10px] text-slate-400 text-center font-mono">
          © 2026 SMKN 6 Jember • Jurnal Elektrikal XI RPL
        </p>
      </div>
    </div>
  );
}
