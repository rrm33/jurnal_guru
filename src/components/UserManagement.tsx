import React, { useState, useMemo } from "react";
import { swalAlert, swalConfirm } from "../lib/swalUtils";
import { 
  Users, 
  UserPlus, 
  Search, 
  Key, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  GraduationCap, 
  User, 
  CheckCircle2, 
  AlertCircle,
  X,
  Lock,
  RefreshCw,
  Eye,
  EyeOff
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserAccount, Student } from "../types";

interface UserManagementProps {
  users: UserAccount[];
  students: Student[];
  onAddUser: (user: UserAccount) => void;
  onUpdateUser: (user: UserAccount) => void;
  onDeleteUser: (userId: string) => void;
}

export default function UserManagement({
  users,
  students,
  onAddUser,
  onUpdateUser,
  onDeleteUser
}: UserManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"semua" | "guru" | "siswa">("semua");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  
  // Form fields
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    role: "siswa" as "guru" | "siswa",
    password: "",
    studentId: "",
    nip: "",
    className: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.nip && u.nip.includes(searchTerm));
      const matchesRole = roleFilter === "semua" || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      username: "",
      role: "siswa",
      password: "123",
      studentId: "",
      nip: "",
      className: ""
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: UserAccount) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      username: user.username,
      role: user.role,
      password: user.password || "123",
      studentId: user.studentId || "",
      nip: user.nip || "",
      className: user.className || ""
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSelectStudentForUser = (stdId: string) => {
    const std = students.find(s => s.id === stdId);
    if (std) {
      setFormData(prev => ({
        ...prev,
        studentId: std.id,
        name: std.name,
        username: std.nisn,
        className: std.className
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name.trim()) {
      setFormError("Nama lengkap wajib diisi.");
      return;
    }
    if (!formData.username.trim()) {
      setFormError("Username / NIP / NISN wajib diisi.");
      return;
    }
    if (!formData.password.trim()) {
      setFormError("Password wajib diisi.");
      return;
    }

    // Check duplicate username if adding or changing username
    const exists = users.find(u => u.username.toLowerCase() === formData.username.trim().toLowerCase() && u.id !== editingUser?.id);
    if (exists) {
      setFormError("Username / NIP / NISN ini sudah terdaftar.");
      return;
    }

    if (editingUser) {
      const updated: UserAccount = {
        ...editingUser,
        name: formData.name.trim(),
        username: formData.username.trim(),
        role: formData.role,
        password: formData.password,
        studentId: formData.role === "siswa" ? formData.studentId : undefined,
        nip: formData.role === "guru" ? formData.nip : undefined,
        className: formData.role === "siswa" ? formData.className : undefined
      };
      onUpdateUser(updated);
      setSuccessMsg("Pengguna berhasil diperbarui!");
    } else {
      const newUser: UserAccount = {
        id: "usr_" + Date.now(),
        name: formData.name.trim(),
        username: formData.username.trim(),
        role: formData.role,
        password: formData.password,
        studentId: formData.role === "siswa" ? formData.studentId : undefined,
        nip: formData.role === "guru" ? formData.nip : undefined,
        className: formData.role === "siswa" ? formData.className : undefined
      };
      onAddUser(newUser);
      setSuccessMsg("Pengguna baru berhasil ditambahkan!");
    }

    setIsModalOpen(false);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleDelete = async (user: UserAccount) => {
    if (await swalConfirm(`Apakah Anda yakin ingin menghapus akun pengguna "${user.name}"?`)) {
      onDeleteUser(user.id);
      setSuccessMsg(`Akun ${user.name} telah dihapus.`);
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-white p-6 rounded-2xl border border-natural-border shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-natural-dark text-white p-3.5 rounded-2xl shadow-xs">
            <Users size={26} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-natural-dark tracking-tight">Manajemen Akun Pengguna (CRUD User)</h2>
            <p className="text-xs text-natural-text/70 mt-0.5">Kelola akun akses login untuk Guru dan Siswa, atur username dan kata sandi.</p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-natural-dark hover:bg-natural-mid text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
        >
          <UserPlus size={16} />
          <span>Tambah Akun Baru</span>
        </button>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-3 text-xs font-semibold"
        >
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </motion.div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-natural-border shadow-2xs flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari berdasarkan nama, username, NIP, NISN..."
            className="w-full pl-9 pr-4 py-2 bg-natural-bg border border-natural-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-natural-sage"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Role:</span>
          <div className="flex bg-natural-bg p-1 rounded-xl border border-natural-border text-xs font-bold w-full md:w-auto">
            <button
              onClick={() => setRoleFilter("semua")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                roleFilter === "semua" ? "bg-white text-natural-dark shadow-2xs" : "text-slate-600 hover:text-natural-dark"
              }`}
            >
              Semua ({users.length})
            </button>
            <button
              onClick={() => setRoleFilter("guru")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                roleFilter === "guru" ? "bg-white text-natural-dark shadow-2xs" : "text-slate-600 hover:text-natural-dark"
              }`}
            >
              Guru ({users.filter(u => u.role === "guru").length})
            </button>
            <button
              onClick={() => setRoleFilter("siswa")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                roleFilter === "siswa" ? "bg-white text-natural-dark shadow-2xs" : "text-slate-600 hover:text-natural-dark"
              }`}
            >
              Siswa ({users.filter(u => u.role === "siswa").length})
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-natural-border shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-natural-bg border-b border-natural-border font-bold text-natural-dark text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Pengguna</th>
                <th className="py-3.5 px-4">Username / ID Login</th>
                <th className="py-3.5 px-4">Role Akses</th>
                <th className="py-3.5 px-4">Atribut Tambahan</th>
                <th className="py-3.5 px-4">Kata Sandi</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-natural-border/60 font-medium">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => {
                  const isGuru = u.role === "guru";
                  return (
                    <tr key={u.id} className="hover:bg-natural-bg/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-natural-dark">
                        <div className="flex items-center gap-2.5">
                          <div className={`p-2 rounded-xl text-white ${isGuru ? "bg-indigo-600" : "bg-natural-sage"}`}>
                            {isGuru ? <ShieldCheck size={16} /> : <GraduationCap size={16} />}
                          </div>
                          <div>
                            <p className="font-bold">{u.name}</p>
                            {u.className && <p className="text-[10px] text-slate-500 font-normal">Kelas: {u.className}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                        {u.username}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          isGuru ? "bg-indigo-50 text-indigo-700 border border-indigo-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}>
                          {isGuru ? "Guru / Pengajar" : "Siswa"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {isGuru ? (
                          <span className="text-[11px] font-mono">NIP: {u.nip || "-"}</span>
                        ) : (
                          <span className="text-[11px]">Kelas {u.className || "-"}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">
                        ••••••••
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(u)}
                            className="p-1.5 hover:bg-natural-accent text-natural-dark rounded-lg transition-colors cursor-pointer"
                            title="Edit User"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(u)}
                            className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors cursor-pointer"
                            title="Hapus User"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-normal">
                    Tidak ada akun pengguna yang sesuai dengan pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit User Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-natural-border space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-natural-border">
                <div className="flex items-center gap-2.5">
                  <div className="bg-natural-sage text-white p-2 rounded-xl">
                    <Users size={18} />
                  </div>
                  <h3 className="font-bold text-base text-natural-dark">
                    {editingUser ? "Edit Akun Pengguna" : "Tambah Akun Pengguna Baru"}
                  </h3>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>

              {formError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* Role selection */}
                <div>
                  <label className="block font-bold text-natural-dark mb-1">Peran Akses (Role)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, role: "siswa" }))}
                      className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                        formData.role === "siswa" 
                          ? "bg-emerald-50 border-emerald-500 text-emerald-800" 
                          : "bg-white border-natural-border text-slate-600 hover:bg-natural-bg"
                      }`}
                    >
                      <GraduationCap size={16} />
                      <span>Siswa</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, role: "guru" }))}
                      className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                        formData.role === "guru" 
                          ? "bg-indigo-50 border-indigo-500 text-indigo-800" 
                          : "bg-white border-natural-border text-slate-600 hover:bg-natural-bg"
                      }`}
                    >
                      <ShieldCheck size={16} />
                      <span>Guru / Pengajar</span>
                    </button>
                  </div>
                </div>

                {/* Auto select from student list if role === 'siswa' */}
                {formData.role === "siswa" && !editingUser && (
                  <div className="bg-natural-bg p-3 rounded-xl border border-natural-border space-y-1">
                    <label className="block font-bold text-slate-700">Pilih Siswa Terdaftar (Opsional):</label>
                    <select
                      value={formData.studentId}
                      onChange={(e) => handleSelectStudentForUser(e.target.value)}
                      className="w-full p-2 bg-white border border-natural-border rounded-lg focus:outline-none"
                    >
                      <option value="">-- Buat Siswa Baru / Pilih dari daftar --</option>
                      {students.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.className}) - NISN: {s.nisn}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block font-bold text-natural-dark mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                    placeholder="Contoh: Bunga Lestari"
                    className="w-full p-2.5 bg-white border border-natural-border rounded-xl focus:outline-none focus:ring-2 focus:ring-natural-sage"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-natural-dark mb-1">
                    {formData.role === "guru" ? "Username / NIP" : "Username / NISN Login"}
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData(p => ({ ...p, username: e.target.value }))}
                    placeholder={formData.role === "guru" ? "guru123 atau NIP" : "0074128910"}
                    className="w-full p-2.5 bg-white border border-natural-border rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-natural-sage"
                    required
                  />
                </div>

                {formData.role === "guru" ? (
                  <div>
                    <label className="block font-bold text-natural-dark mb-1">NIP (Nomor Induk Pegawai)</label>
                    <input
                      type="text"
                      value={formData.nip}
                      onChange={(e) => setFormData(p => ({ ...p, nip: e.target.value }))}
                      placeholder="19940823 202112 1 002"
                      className="w-full p-2.5 bg-white border border-natural-border rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-natural-sage"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block font-bold text-natural-dark mb-1">Kelas</label>
                    <input
                      type="text"
                      value={formData.className}
                      onChange={(e) => setFormData(p => ({ ...p, className: e.target.value }))}
                      placeholder="XI RPL 1"
                      className="w-full p-2.5 bg-white border border-natural-border rounded-xl focus:outline-none focus:ring-2 focus:ring-natural-sage"
                    />
                  </div>
                )}

                <div>
                  <label className="block font-bold text-natural-dark mb-1">Kata Sandi (Password)</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
                      placeholder="Masukkan kata sandi"
                      className="w-full p-2.5 pr-10 bg-white border border-natural-border rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-natural-sage"
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

                <div className="pt-3 flex items-center justify-end gap-2 border-t border-natural-border">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-natural-bg font-bold cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-natural-dark hover:bg-natural-mid text-white rounded-xl font-bold cursor-pointer shadow-xs"
                  >
                    {editingUser ? "Simpan Perubahan" : "Buat User"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
