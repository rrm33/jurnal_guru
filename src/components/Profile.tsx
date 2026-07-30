import React, { useState, useRef } from "react";
import { 
  User, 
  ShieldCheck, 
  KeyRound, 
  Camera, 
  CheckCircle2, 
  AlertCircle, 
  Mail, 
  Phone, 
  Building2, 
  GraduationCap, 
  Lock,
  Sparkles,
  ShieldAlert
} from "lucide-react";
import { motion } from "motion/react";
import { Student, TeacherProfile } from "../types";

interface ProfileProps {
  role: "guru" | "siswa";
  teacherProfile?: TeacherProfile;
  loggedStudent?: Student;
  onUpdateTeacherProfile?: (updated: TeacherProfile) => void;
  onUpdateTeacherPassword?: (newPassword: string) => void;
  onUpdateStudentPhoto?: (studentId: string, photoUrl: string) => void;
  onUpdateStudentPassword?: (studentId: string, newPassword: string) => void;
  onSelectPhotoPreview?: (data: any) => void;
}

export default function Profile({
  role,
  teacherProfile,
  loggedStudent,
  onUpdateTeacherProfile,
  onUpdateTeacherPassword,
  onUpdateStudentPhoto,
  onUpdateStudentPassword,
  onSelectPhotoPreview
}: ProfileProps) {
  const photoInputRef = useRef<HTMLInputElement>(null);

  // --- TEACHER EDIT FORM STATE ---
  const [teacherName, setTeacherName] = useState(teacherProfile?.name || "Ryan Maulana, S.Kom.");
  const [teacherNip, setTeacherNip] = useState(teacherProfile?.nip || "19940823 202112 1 002");
  const [teacherSchool, setTeacherSchool] = useState(teacherProfile?.school || "SMK Negeri 6 Jember");
  const [teacherEmail, setTeacherEmail] = useState(teacherProfile?.email || "ryanmaulana03@guru.smk.belajar.id");
  const [teacherPhone, setTeacherPhone] = useState(teacherProfile?.phone || "081234567890");
  const [teacherPhotoUrl, setTeacherPhotoUrl] = useState(teacherProfile?.photoUrl || "");

  const [teacherSaveMsg, setTeacherSaveMsg] = useState("");

  // --- PASSWORD CHANGE FORM STATE ---
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState("");

  // Handle Photo File Upload with Canvas Compression
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Harap pilih file gambar (.jpg, .png, .webp).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const maxSize = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.85);

          if (role === "guru") {
            setTeacherPhotoUrl(compressedDataUrl);
            if (onUpdateTeacherProfile && teacherProfile) {
              onUpdateTeacherProfile({ ...teacherProfile, photoUrl: compressedDataUrl });
            }
          } else if (role === "siswa" && loggedStudent && onUpdateStudentPhoto) {
            onUpdateStudentPhoto(loggedStudent.id, compressedDataUrl);
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handlePreviewPhoto = () => {
    if (!onSelectPhotoPreview) return;
    if (role === "guru") {
      onSelectPhotoPreview({
        name: teacherName,
        subtitle: `NIP: ${teacherNip} • ${teacherSchool}`,
        photoUrl: teacherPhotoUrl,
        roleLabel: "Guru Pengajar"
      });
    } else if (loggedStudent) {
      onSelectPhotoPreview(loggedStudent);
    }
  };

  // Handle Save Teacher Info
  const handleSaveTeacherInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setTeacherSaveMsg("");

    if (onUpdateTeacherProfile) {
      onUpdateTeacherProfile({
        name: teacherName,
        nip: teacherNip,
        school: teacherSchool,
        subjectGroup: teacherProfile?.subjectGroup || "Rekayasa Perangkat Lunak",
        email: teacherEmail,
        phone: teacherPhone,
        photoUrl: teacherPhotoUrl
      });
      setTeacherSaveMsg("Data profil guru berhasil diperbarui.");
      setTimeout(() => setTeacherSaveMsg(""), 4000);
    }
  };

  // Handle Change Password (Both Guru & Siswa)
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError("");
    setPassSuccess("");

    const pass = newPassword.trim();
    const conf = confirmPassword.trim();

    if (!pass || pass.length < 3) {
      setPassError("Kata sandi baru minimal 3 karakter.");
      return;
    }

    if (pass !== conf) {
      setPassError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    if (role === "guru") {
      if (onUpdateTeacherPassword) {
        onUpdateTeacherPassword(pass);
        setPassSuccess("Kata sandi Guru berhasil diperbarui.");
      }
    } else if (role === "siswa" && loggedStudent) {
      if (onUpdateStudentPassword) {
        onUpdateStudentPassword(loggedStudent.id, pass);
        setPassSuccess("Kata sandi Siswa berhasil diperbarui! Nama Anda kini disembunyikan dari halaman login awal.");
      }
    }

    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPassSuccess(""), 5000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-4xl mx-auto pb-10"
    >
      {/* Hidden File Input for Avatar */}
      <input 
        type="file" 
        ref={photoInputRef} 
        onChange={handlePhotoUpload} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Header Banner */}
      <div className="bg-white border border-natural-border p-6 rounded-3xl shadow-2xs relative overflow-hidden flex flex-col sm:flex-row items-center gap-6">
        <div className="relative group shrink-0">
          {role === "guru" ? (
            teacherPhotoUrl ? (
              <img 
                src={teacherPhotoUrl} 
                alt={teacherName} 
                className="w-24 h-24 rounded-3xl object-cover border-2 border-natural-border shadow-xs cursor-pointer hover:opacity-90 transition-opacity" 
                onClick={handlePreviewPhoto}
                title="Klik untuk melihat foto besar"
              />
            ) : (
              <div 
                onClick={handlePreviewPhoto}
                className="w-24 h-24 rounded-3xl bg-natural-dark text-white font-bold text-3xl flex items-center justify-center border-2 border-natural-border shadow-xs cursor-pointer hover:opacity-90 transition-opacity"
                title="Klik untuk melihat foto"
              >
                {teacherName.charAt(0)}
              </div>
            )
          ) : (
            loggedStudent?.photoUrl ? (
              <img 
                src={loggedStudent.photoUrl} 
                alt={loggedStudent.name} 
                className="w-24 h-24 rounded-3xl object-cover border-2 border-natural-border shadow-xs cursor-pointer hover:opacity-90 transition-opacity"
                onClick={handlePreviewPhoto}
                title="Klik untuk melihat foto besar"
              />
            ) : (
              <div 
                onClick={handlePreviewPhoto}
                className="w-24 h-24 rounded-3xl bg-natural-sage text-white font-bold text-3xl flex items-center justify-center border-2 border-natural-border shadow-xs cursor-pointer hover:opacity-90 transition-opacity"
                title="Klik untuk melihat foto"
              >
                {loggedStudent?.name.charAt(0) || "S"}
              </div>
            )
          )}

          <button
            onClick={() => photoInputRef.current?.click()}
            className="absolute -bottom-2 -right-2 bg-natural-sage hover:bg-natural-dark text-white p-2 rounded-2xl shadow-md border-2 border-white transition-all cursor-pointer"
            title="Ubah Foto Profil"
          >
            <Camera size={16} />
          </button>
        </div>

        <div className="text-center sm:text-left space-y-1.5 flex-1">
          <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
            <span className="bg-natural-bg border border-natural-border text-natural-dark font-bold text-[11px] px-3 py-1 rounded-full flex items-center gap-1.5">
              {role === "guru" ? <User size={13} className="text-natural-sage" /> : <GraduationCap size={13} className="text-natural-sage" />}
              <span>{role === "guru" ? "Akun Guru Pengajar" : "Akun Siswa RPL"}</span>
            </span>

            {role === "siswa" && (
              loggedStudent?.hasChangedPassword ? (
                <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-[11px] px-3 py-1 rounded-full flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-600" />
                  <span>Password Diperbarui (Nama Disembunyikan)</span>
                </span>
              ) : (
                <span className="bg-amber-50 border border-amber-300 text-amber-900 font-bold text-[11px] px-3 py-1 rounded-full flex items-center gap-1.5">
                  <AlertCircle size={13} className="text-amber-600" />
                  <span>Akses Pertama (Nama Tampak di Login)</span>
                </span>
              )
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-natural-dark">
            {role === "guru" ? teacherName : loggedStudent?.name}
          </h2>
          <p className="text-xs text-natural-sage font-mono font-bold">
            {role === "guru" ? `NIP: ${teacherNip} • ${teacherSchool}` : `NISN: ${loggedStudent?.nisn} • Kelas ${loggedStudent?.className}`}
          </p>
        </div>
      </div>

      {/* Main Form Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* PROFILE DATA EDIT CARD */}
        <div className="bg-white border border-natural-border rounded-3xl p-6 shadow-2xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-natural-border">
            <div className="p-2 bg-natural-sage/20 text-natural-sage rounded-xl">
              <User size={18} />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-natural-dark">Informasi Data Diri</h3>
              <p className="text-[11px] text-slate-400">
                {role === "guru" ? "Kelola informasi data profil pengajar" : "Detail data pribadi siswa"}
              </p>
            </div>
          </div>

          {role === "guru" ? (
            <form onSubmit={handleSaveTeacherInfo} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Nama Lengkap & Gelar</label>
                <input 
                  type="text" 
                  value={teacherName} 
                  onChange={(e) => setTeacherName(e.target.value)} 
                  className="w-full bg-[#FBFBFA] border border-natural-border rounded-xl px-3.5 py-2 text-xs font-medium focus:outline-none focus:border-natural-sage" 
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">NIP (Nomor Induk Pegawai)</label>
                <input 
                  type="text" 
                  value={teacherNip} 
                  onChange={(e) => setTeacherNip(e.target.value)} 
                  className="w-full bg-[#FBFBFA] border border-natural-border rounded-xl px-3.5 py-2 text-xs font-medium focus:outline-none focus:border-natural-sage" 
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Unit Kerja / Sekolah</label>
                <div className="relative">
                  <Building2 size={15} className="absolute left-3 top-2.5 text-slate-400" />
                  <input 
                    type="text" 
                    value={teacherSchool} 
                    onChange={(e) => setTeacherSchool(e.target.value)} 
                    className="w-full bg-[#FBFBFA] border border-natural-border rounded-xl pl-9 pr-3.5 py-2 text-xs font-medium focus:outline-none focus:border-natural-sage" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Email</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-2.5 text-slate-400" />
                    <input 
                      type="email" 
                      value={teacherEmail} 
                      onChange={(e) => setTeacherEmail(e.target.value)} 
                      className="w-full bg-[#FBFBFA] border border-natural-border rounded-xl pl-9 pr-3.5 py-2 text-xs font-medium focus:outline-none focus:border-natural-sage" 
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">No. WhatsApp</label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3 top-2.5 text-slate-400" />
                    <input 
                      type="text" 
                      value={teacherPhone} 
                      onChange={(e) => setTeacherPhone(e.target.value)} 
                      className="w-full bg-[#FBFBFA] border border-natural-border rounded-xl pl-9 pr-3.5 py-2 text-xs font-medium focus:outline-none focus:border-natural-sage" 
                    />
                  </div>
                </div>
              </div>

              {teacherSaveMsg && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>{teacherSaveMsg}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-natural-dark hover:bg-natural-mid text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-3xs"
              >
                <ShieldCheck size={16} />
                <span>Simpan Perubahan Profil</span>
              </button>
            </form>
          ) : (
            <div className="space-y-4 text-xs">
              <div className="bg-natural-bg p-3.5 rounded-2xl border border-natural-border space-y-2">
                <div className="flex justify-between border-b border-natural-border/60 pb-1.5">
                  <span className="text-slate-400">Nama Siswa:</span>
                  <span className="font-bold text-natural-dark">{loggedStudent?.name}</span>
                </div>
                <div className="flex justify-between border-b border-natural-border/60 pb-1.5">
                  <span className="text-slate-400">NISN:</span>
                  <span className="font-mono font-bold text-natural-dark">{loggedStudent?.nisn}</span>
                </div>
                <div className="flex justify-between border-b border-natural-border/60 pb-1.5">
                  <span className="text-slate-400">Kelas:</span>
                  <span className="font-bold text-natural-dark">{loggedStudent?.className}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Jenis Kelamin:</span>
                  <span className="font-bold text-natural-dark">
                    {loggedStudent?.gender === "L" ? "Laki-laki" : "Perempuan"}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-[11px] text-slate-600 space-y-1">
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-500" />
                  Informasi Pasfoto:
                </p>
                <p>
                  Siswa dapat memperbarui foto profil menggunakan tombol kamera di samping foto profil atas.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* CHANGE PASSWORD CARD */}
        <div className="bg-white border border-natural-border rounded-3xl p-6 shadow-2xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-natural-border">
              <div className="p-2 bg-amber-500/10 text-amber-600 rounded-xl">
                <KeyRound size={18} />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-natural-dark">Keamanan & Kata Sandi</h3>
                <p className="text-[11px] text-slate-400">Ubah kata sandi untuk mengamankan akun Anda</p>
              </div>
            </div>

            {role === "siswa" && !loggedStudent?.hasChangedPassword && (
              <div className="bg-amber-50 border border-amber-300 text-amber-900 p-3.5 rounded-2xl text-xs space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <ShieldAlert size={16} className="text-amber-600 shrink-0" />
                  Akses Pertama Siswa
                </p>
                <p className="text-[11px] leading-relaxed opacity-90">
                  Segera ganti kata sandi Anda. Setelah disimpan, nama Anda akan <strong>otomatis disembunyikan</strong> dari daftar siswa di halaman login awal.
                </p>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Kata Sandi Baru</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3 text-slate-400" />
                  <input 
                    type="password" 
                    placeholder="Minimal 3 karakter" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    className="w-full bg-[#FBFBFA] border border-natural-border rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:border-natural-sage" 
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Konfirmasi Kata Sandi Baru</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3 text-slate-400" />
                  <input 
                    type="password" 
                    placeholder="Ulangi kata sandi baru" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    className="w-full bg-[#FBFBFA] border border-natural-border rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:border-natural-sage" 
                    required
                  />
                </div>
              </div>

              {passError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{passError}</span>
                </div>
              )}

              {passSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>{passSuccess}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-natural-sage hover:bg-natural-dark text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-3xs"
              >
                <KeyRound size={16} />
                <span>Simpan Kata Sandi Baru</span>
              </button>
            </form>
          </div>

          <div className="bg-natural-bg p-3.5 rounded-2xl border border-natural-border text-[11px] text-slate-500">
            💡 Pertahankan keamanan kata sandi Anda dan jangan berikan kepada orang lain.
          </div>
        </div>

      </div>
    </motion.div>
  );
}
