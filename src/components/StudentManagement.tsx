import React, { useState, useMemo, useRef } from "react";
import { swalAlert, swalConfirm } from "../lib/swalUtils";
import { 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  Upload, 
  FileSpreadsheet, 
  Download, 
  Search, 
  Filter, 
  AlertCircle, 
  CheckCircle2, 
  UserPlus, 
  Info,
  X,
  GraduationCap
} from "lucide-react";
import * as XLSX from "xlsx";
import { Student } from "../types";

interface StudentManagementProps {
  students: Student[];
  classes: string[];
  subjects: string[];
  onAddStudent: (student: Student) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onBulkImport: (students: Student[]) => void;
  onAddClass: (className: string) => void;
  onUpdateClass: (oldClassName: string, newClassName: string) => void;
  onDeleteClass: (className: string) => void;
  onAddSubject: (subject: string) => void;
  onUpdateSubject: (oldSubject: string, newSubject: string) => void;
  onDeleteSubject: (subject: string) => void;
  onSelectStudentPhoto?: (student: Student) => void;
}

export default function StudentManagement({
  students,
  classes,
  subjects,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onBulkImport,
  onAddClass,
  onUpdateClass,
  onDeleteClass,
  onAddSubject,
  onUpdateSubject,
  onDeleteSubject,
  onSelectStudentPhoto
}: StudentManagementProps) {
  const [activeSubSection, setActiveSubSection] = useState<"siswa" | "kelas" | "mapel">("siswa");
  
  // Class Management form states
  const [newClassNameInput, setNewClassNameInput] = useState("");
  const [editingClassOld, setEditingClassOld] = useState<string | null>(null);
  const [editingClassNew, setEditingClassNew] = useState("");

  // Subject Management form states
  const [newSubjectInput, setNewSubjectInput] = useState("");
  const [editingSubjectOld, setEditingSubjectOld] = useState<string | null>(null);
  const [editingSubjectNew, setEditingSubjectNew] = useState("");

  const [selectedClass, setSelectedClass] = useState<string>("Semua Kelas");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal & Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [name, setName] = useState("");
  const [nisn, setNisn] = useState("");
  const [className, setClassName] = useState(classes[0] || "XI RPL 1");
  const [gender, setGender] = useState<"L" | "P">("L");
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [formError, setFormError] = useState("");

  // Excel / CSV Upload state
  const [isDragging, setIsDragging] = useState(false);
  const [importResults, setImportResults] = useState<{
    success: boolean;
    message: string;
    parsedCount?: number;
  } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Filtered and searched students
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesClass = selectedClass === "Semua Kelas" || student.className === selectedClass;
      const matchesSearch = (student.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (student.nisn || "").includes(searchQuery);
      return matchesClass && matchesSearch;
    });
  }, [students, selectedClass, searchQuery]);

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setName("");
    setNisn("");
    setClassName(classes[0] || "XI RPL 1");
    setGender("L");
    setPhotoUrl("");
    setFormError("");
    setIsFormOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setName(student.name);
    setNisn(student.nisn);
    setClassName(student.className);
    setGender(student.gender);
    setPhotoUrl(student.photoUrl || "");
    setFormError("");
    setIsFormOpen(true);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFormError("File foto harus berupa gambar (.jpg, .png, .webp).");
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
          setPhotoUrl(canvas.toDataURL("image/jpeg", 0.85));
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!name.trim()) {
      setFormError("Nama lengkap wajib diisi.");
      return;
    }
    if (!nisn.trim()) {
      setFormError("NISN wajib diisi.");
      return;
    }
    if (nisn.trim().length !== 10 || isNaN(Number(nisn))) {
      setFormError("NISN harus berupa 10 digit angka.");
      return;
    }

    // Check unique NISN, excluding current student if editing
    const nisnExists = students.some(s => s.nisn === nisn.trim() && (!editingStudent || s.id !== editingStudent.id));
    if (nisnExists) {
      setFormError("Siswa dengan NISN tersebut sudah terdaftar.");
      return;
    }

    const payload: Student = {
      id: editingStudent ? editingStudent.id : `std_${Date.now()}`,
      name: name.trim(),
      nisn: nisn.trim(),
      className,
      gender,
      photoUrl: photoUrl || editingStudent?.photoUrl
    };

    if (editingStudent) {
      onUpdateStudent(payload);
      swalAlert("Berhasil memperbarui data siswa.");
    } else {
      onAddStudent(payload);
      swalAlert("Berhasil menambahkan siswa baru.");
    }

    setIsFormOpen(false);
  };

  // Download Excel Template Helper
  const downloadTemplate = () => {
    const templateData = [
      { "Nama Lengkap": "Ahmad Dani", "NISN": "0081234567", "Kelas": "XI RPL 1", "Gender (L/P)": "L" },
      { "Nama Lengkap": "Siti Sarah", "NISN": "0087654321", "Kelas": "XI RPL 2", "Gender (L/P)": "P" }
    ];
    
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Siswa Baru");
    
    // Write and trigger download
    XLSX.writeFile(workbook, "template_import_siswa_smkn6.xlsx");
  };

  // Parsing Excel File
  const handleExcelImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) throw new Error("Gagal membaca file data.");

        const workbook = XLSX.read(data, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert sheet to JSON
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);
        
        if (jsonData.length === 0) {
          setImportResults({
            success: false,
            message: "File kosong atau tidak berisi baris data siswa."
          });
          return;
        }

        const importedStudents: Student[] = [];
        const errors: string[] = [];

        jsonData.forEach((row, index) => {
          // Normalize row key mappings
          const rawName = row["Nama Lengkap"] || row["Nama"] || row["name"] || row["Nama Siswa"];
          const rawNisn = String(row["NISN"] || row["nisn"] || row["Nomor Induk"] || "").trim();
          const rawClass = String(row["Kelas"] || row["kelas"] || row["className"] || "").trim();
          const rawGender = String(row["Gender (L/P)"] || row["Gender"] || row["L/P"] || row["gender"] || "L").toUpperCase().trim();

          if (!rawName) {
            errors.push(`Baris ${index + 2}: Nama lengkap kosong.`);
            return;
          }
          if (!rawNisn || rawNisn.length !== 10 || isNaN(Number(rawNisn))) {
            errors.push(`Baris ${index + 2}: NISN '${rawNisn}' harus 10 digit angka.`);
            return;
          }
          if (!rawClass) {
            errors.push(`Baris ${index + 2}: Kelas kosong.`);
            return;
          }

          const genderNorm: "L" | "P" = (rawGender === "P" || rawGender === "PEREMPUAN") ? "P" : "L";

          importedStudents.push({
            id: `std_${Date.now()}_${index}`,
            name: rawName,
            nisn: rawNisn,
            className: rawClass,
            gender: genderNorm
          });
        });

        if (errors.length > 0) {
          setImportResults({
            success: false,
            message: `Gagal mengimpor karena kesalahan validasi:\n${errors.slice(0, 3).join("\n")}${errors.length > 3 ? `\n...dan ${errors.length - 3} kesalahan lainnya.` : ""}`
          });
          return;
        }

        // Run bulk import
        onBulkImport(importedStudents);
        setImportResults({
          success: true,
          message: `Berhasil mengimpor ${importedStudents.length} siswa secara bulk!`,
          parsedCount: importedStudents.length
        });
        swalAlert(`Berhasil mengimpor ${importedStudents.length} siswa!`);
      } catch (err: any) {
        setImportResults({
          success: false,
          message: `Gagal memproses file Excel: ${err?.message || "Format tidak sesuai"}`
        });
      }
    };

    reader.onerror = () => {
      setImportResults({
        success: false,
        message: "Gagal membaca berkas file excel."
      });
    };

    reader.readAsBinaryString(file);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleExcelImport(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleExcelImport(file);
    }
  };

  return (
    <div id="student-management-root" className="space-y-6">
      {/* Upper Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4.5 rounded-2xl border border-natural-border shadow-xs">
        <div className="flex items-center gap-3">
          <div className="bg-natural-accent text-natural-dark p-2 rounded-xl">
            <Users size={20} />
          </div>
          <div>
            <h3 className="font-bold text-natural-dark text-base">Kelola Data Siswa & Kelas</h3>
            <p className="text-slate-500 text-xs">Kelola profil siswa bimbingan serta daftar kelas mandiri dan sinkronisasi relasi.</p>
          </div>
        </div>
        
        {activeSubSection === "siswa" && (
          <button
            onClick={handleOpenAdd}
            className="bg-natural-mid hover:bg-natural-dark text-white text-xs font-bold rounded-xl px-4.5 py-2.5 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus size={16} /> Siswa Baru
          </button>
        )}
      </div>

      {/* Subsection Tab Switcher: Siswa vs Kelas vs Mapel */}
      <div className="flex border-b border-natural-border gap-2 text-xs">
        <button
          onClick={() => setActiveSubSection("siswa")}
          className={`px-4 py-2.5 font-bold border-b-2 transition-all cursor-pointer ${
            activeSubSection === "siswa"
              ? "border-natural-mid text-natural-mid"
              : "border-transparent text-slate-400 hover:text-natural-dark"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Users size={14} /> Kelola Siswa & Dokumen Excel
          </span>
        </button>
        <button
          onClick={() => setActiveSubSection("kelas")}
          className={`px-4 py-2.5 font-bold border-b-2 transition-all cursor-pointer ${
            activeSubSection === "kelas"
              ? "border-natural-mid text-natural-mid"
              : "border-transparent text-slate-400 hover:text-natural-dark"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <GraduationCap size={14} /> Kelola Kelas (CRUD)
          </span>
        </button>
        <button
          onClick={() => setActiveSubSection("mapel")}
          className={`px-4 py-2.5 font-bold border-b-2 transition-all cursor-pointer ${
            activeSubSection === "mapel"
              ? "border-natural-mid text-natural-mid"
              : "border-transparent text-slate-400 hover:text-natural-dark"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <FileSpreadsheet size={14} /> Kelola Mata Pelajaran (CRUD)
          </span>
        </button>
      </div>

      {activeSubSection === "siswa" && (
        <>
          {/* Grid: Import Excel & Instructions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Bulk Upload Section */}
        <div className="bg-white p-5 rounded-2xl border border-natural-border shadow-3xs space-y-4 lg:col-span-2">
          <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
            <FileSpreadsheet size={15} className="text-natural-mid" /> Impor Siswa dari Excel / Spreadsheet
          </h4>
          
          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
              isDragging 
                ? "border-natural-mid bg-natural-accent" 
                : "border-natural-border bg-[#FBFBFA] hover:bg-natural-accent/30"
            }`}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".xlsx,.xls,.csv"
              className="hidden"
            />
            <Upload size={24} className="text-natural-sage mb-2 animate-pulse" />
            <p className="text-xs font-bold text-natural-dark">
              Seret & lepaskan file Excel (.xlsx / .xls) atau CSV di sini
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              Atau klik untuk menjelajahi folder berkas komputer Anda
            </p>
          </div>

          {importResults && (
            <div className={`p-3.5 rounded-xl border text-xs flex gap-2.5 items-start ${
              importResults.success 
                ? "bg-natural-accent/55 border-natural-border text-natural-dark" 
                : "bg-rose-50 border-rose-100 text-rose-800"
            }`}>
              {importResults.success ? (
                <CheckCircle2 size={16} className="text-natural-sage shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <p className="font-bold">{importResults.success ? "Berhasil Mengimpor!" : "Kesalahan Pengimporan"}</p>
                <p className="text-[11px] leading-relaxed whitespace-pre-wrap">{importResults.message}</p>
              </div>
            </div>
          )}
        </div>

        {/* Excel Instructions */}
        <div className="bg-white p-5 rounded-2xl border border-natural-border shadow-3xs space-y-4">
          <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
            <Info size={15} className="text-natural-mid" /> Panduan Excel
          </h4>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            Gunakan format Excel standar dengan header kolom yang sesuai agar sistem dapat menyinkronkan data presensi dan nilai secara otomatis.
          </p>
          
          <div className="bg-[#FBFBFA] p-3 rounded-xl border border-natural-border space-y-2 text-[10px]">
            <p className="font-bold text-natural-dark border-b border-natural-border/60 pb-1">Header Kolom Wajib:</p>
            <ul className="space-y-1 list-disc list-inside text-slate-500 font-medium">
              <li><strong className="text-natural-dark">Nama Lengkap</strong> (cth: Ahmad Dani)</li>
              <li><strong className="text-natural-dark">NISN</strong> (10 digit angka unik)</li>
              <li><strong className="text-natural-dark">Kelas</strong> (cth: XI RPL 1)</li>
              <li><strong className="text-natural-dark">Gender (L/P)</strong> (L untuk Laki, P untuk Perempuan)</li>
            </ul>
          </div>

          <button
            type="button"
            onClick={downloadTemplate}
            className="w-full bg-[#E8EDDF] hover:bg-natural-light text-natural-dark border border-natural-border font-bold text-xs rounded-xl px-4 py-2.5 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Download size={14} /> Unduh Contoh Excel
          </button>
        </div>
      </div>

      {/* Student List View */}
      <div className="bg-white rounded-2xl border border-natural-border shadow-xs overflow-hidden">
        
        {/* Table Controls */}
        <div className="p-4 bg-[#FBFBFA] border-b border-natural-border flex flex-col sm:flex-row gap-3 justify-between sm:items-center">
          <div className="flex flex-wrap items-center gap-2">
            {/* Class filter */}
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-white border border-natural-border text-natural-dark text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-natural-sage cursor-pointer"
            >
              <option value="Semua Kelas">Semua Kelas</option>
              {classes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama atau NISN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-natural-border rounded-xl pl-9 pr-3.5 py-2 text-xs focus:outline-none focus:border-natural-sage"
            />
          </div>
        </div>

        {/* Student Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-natural-accent/40 border-b border-natural-border text-natural-dark font-bold text-xs uppercase tracking-wider">
                <th className="py-3 px-4.5">No</th>
                <th className="py-3 px-4.5">Nama Siswa</th>
                <th className="py-3 px-4.5">NISN</th>
                <th className="py-3 px-4.5">Kelas</th>
                <th className="py-3 px-4.5">L/P</th>
                <th className="py-3 px-4.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-natural-border/40 text-xs">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, idx) => (
                  <tr key={student.id} className="hover:bg-[#FBFBFA]/40 transition-colors">
                    <td className="py-3 px-4.5 text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-3 px-4.5">
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => onSelectStudentPhoto && onSelectStudentPhoto(student)}
                          className="shrink-0 cursor-pointer group"
                          title="Klik untuk pratinjau foto siswa"
                        >
                          {student.photoUrl ? (
                            <img
                              src={student.photoUrl}
                              alt={student.name}
                              className="w-8 h-8 rounded-full object-cover border border-natural-border group-hover:scale-110 transition-transform"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-natural-sage/20 text-natural-sage font-bold text-xs flex items-center justify-center group-hover:scale-110 transition-transform">
                              {student.name.charAt(0)}
                            </div>
                          )}
                        </button>
                        <span className="font-semibold text-natural-dark text-xs">{student.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4.5 font-mono text-slate-500">{student.nisn}</td>
                    <td className="py-3 px-4.5">
                      <span className="bg-[#E8EDDF] text-natural-dark px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                        {student.className}
                      </span>
                    </td>
                    <td className="py-3 px-4.5">
                      <span className="bg-natural-accent text-natural-dark px-1.5 py-0.5 rounded text-[10px] font-bold">
                        {student.gender}
                      </span>
                    </td>
                    <td className="py-3 px-4.5 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(student)}
                          className="p-1.5 text-slate-400 hover:text-natural-dark hover:bg-natural-accent rounded-lg transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={async () => {
                            if (await swalConfirm(`Apakah Anda yakin ingin menghapus siswa ${student.name}? Semua data presensi dan tugas terkait akan terpengaruh.`)) {
                              onDeleteStudent(student.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Siswa tidak ditemukan untuk filter ini. Tambahkan siswa baru atau unggah template Excel.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer stat block */}
        <div className="bg-[#FBFBFA] p-4 border-t border-natural-border text-slate-400 text-[11px] italic">
          Menampilkan {filteredStudents.length} dari total {students.length} siswa bimbingan SMKN 6 Jember.
        </div>
      </div>
        </>
      )}

      {activeSubSection === "kelas" && (
        <div className="space-y-6 animate-fade-in">
          {/* Class CRUD Panel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Form Create/Edit Class */}
            <div className="bg-white p-5 rounded-2xl border border-natural-border shadow-3xs space-y-4 animate-fade-in">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                {editingClassOld ? "Edit Nama Kelas" : "Tambah Kelas Baru"}
              </h4>
              
              {editingClassOld ? (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-slate-600 font-bold text-xs block">Nama Kelas Sebelumnya</label>
                    <input
                      type="text"
                      className="w-full bg-[#FBFBFA] border border-natural-border rounded-xl px-3.5 py-2.5 text-xs text-slate-400 focus:outline-none"
                      value={editingClassOld}
                      disabled
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-slate-600 font-bold text-xs block">Nama Kelas Baru</label>
                    <input
                      type="text"
                      placeholder="cth: XI RPL 3"
                      className="w-full bg-white border border-natural-border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-natural-sage font-mono"
                      value={editingClassNew}
                      onChange={(e) => setEditingClassNew(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        if (!editingClassNew.trim()) {
                          swalAlert("Nama kelas baru tidak boleh kosong.");
                          return;
                        }
                        if (classes.includes(editingClassNew.trim()) && editingClassNew.trim() !== editingClassOld) {
                          swalAlert("Kelas tersebut sudah terdaftar.");
                          return;
                        }
                        onUpdateClass(editingClassOld, editingClassNew.trim());
                        swalAlert(`Berhasil memperbarui kelas dari '${editingClassOld}' menjadi '${editingClassNew.trim()}'. Relasi data siswa telah ter-update.`);
                        setEditingClassOld(null);
                        setEditingClassNew("");
                      }}
                      className="bg-natural-mid hover:bg-natural-dark text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer transition-colors flex-1"
                    >
                      Simpan
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        setEditingClassOld(null);
                        setEditingClassNew("");
                      }}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs px-3 py-2.5 rounded-xl cursor-pointer transition-colors"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-slate-600 font-bold text-xs block">Nama Kelas Baru</label>
                    <input
                      type="text"
                      placeholder="cth: XI RPL 3"
                      className="w-full bg-[#FBFBFA] border border-natural-border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-natural-sage font-mono"
                      value={newClassNameInput}
                      onChange={(e) => setNewClassNameInput(e.target.value)}
                    />
                  </div>
                  
                  <button
                    type="button"
                    onClick={async () => {
                      const clean = newClassNameInput.trim();
                      if (!clean) {
                        swalAlert("Nama kelas tidak boleh kosong.");
                        return;
                      }
                      if (classes.includes(clean)) {
                        swalAlert("Kelas tersebut sudah terdaftar.");
                        return;
                      }
                      onAddClass(clean);
                      swalAlert(`Berhasil menambahkan kelas '${clean}' ke dalam sistem.`);
                      setNewClassNameInput("");
                    }}
                    className="bg-natural-mid hover:bg-natural-dark text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer transition-colors w-full"
                  >
                    Tambah Kelas
                  </button>
                </div>
              )}
            </div>

            {/* List Classes Table */}
            <div className="bg-white p-5 rounded-2xl border border-natural-border shadow-3xs space-y-4 md:col-span-2">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Daftar Kelas Terdaftar ({classes.length})
              </h4>

              <div className="border border-natural-border rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#FBFBFA] border-b border-natural-border text-natural-dark font-bold text-xs">
                      <th className="p-3">No</th>
                      <th className="p-3">Nama Kelas</th>
                      <th className="p-3">Jumlah Siswa Berelasi</th>
                      <th className="p-3 text-center">Aksi Relasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-natural-border/40 text-xs">
                    {classes.map((cls, index) => {
                      const count = students.filter(s => s.className === cls).length;
                      return (
                        <tr key={cls} className="hover:bg-[#FBFBFA]/30 transition-colors">
                          <td className="p-3 text-slate-400 font-mono">{index + 1}</td>
                          <td className="p-3">
                            <span className="font-bold text-natural-dark font-mono bg-natural-accent/50 text-[10px] px-2 py-0.5 rounded-md border border-natural-border/30">
                              {cls}
                            </span>
                          </td>
                          <td className="p-3 font-medium text-slate-600">
                            <strong>{count}</strong> Siswa RPL
                          </td>
                          <td className="p-3 text-center">
                            <div className="inline-flex items-center gap-2">
                              <button
                                type="button"
                                onClick={async () => {
                                  setEditingClassOld(cls);
                                  setEditingClassNew(cls);
                                }}
                                className="p-1.5 text-slate-400 hover:text-natural-dark hover:bg-natural-accent rounded-lg transition-colors cursor-pointer"
                                title="Edit Nama Kelas"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={async () => {
                                  if (count > 0) {
                                    if (!await swalConfirm(`Peringatan! Ada ${count} siswa yang terdaftar di kelas ${cls}. Menghapus kelas ini akan mengubah status kelas mereka menjadi 'Belum Ditentukan'. Anda yakin ingin menghapusnya?`)) {
                                      return;
                                    }
                                  } else {
                                    if (!await swalConfirm(`Hapus kelas ${cls}?`)) {
                                      return;
                                    }
                                  }
                                  onDeleteClass(cls);
                                  swalAlert(`Kelas ${cls} telah berhasil dihapus.`);
                                }}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="Hapus Kelas"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubSection === "mapel" && (
        <div className="space-y-6 animate-fade-in">
          {/* Mapel CRUD Panel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Form Create/Edit Mapel */}
            <div className="bg-white p-5 rounded-2xl border border-natural-border shadow-3xs space-y-4 animate-fade-in">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                {editingSubjectOld ? "Edit Mata Pelajaran" : "Tambah Mata Pelajaran"}
              </h4>
              
              {editingSubjectOld ? (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-slate-600 font-bold text-xs block">Mapel Sebelumnya</label>
                    <input
                      type="text"
                      className="w-full bg-[#FBFBFA] border border-natural-border rounded-xl px-3.5 py-2.5 text-xs text-slate-400 focus:outline-none"
                      value={editingSubjectOld}
                      disabled
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-slate-600 font-bold text-xs block">Nama Mapel Baru</label>
                    <input
                      type="text"
                      placeholder="cth: Dasar Desain Grafis"
                      className="w-full bg-white border border-natural-border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-natural-sage font-mono"
                      value={editingSubjectNew}
                      onChange={(e) => setEditingSubjectNew(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        if (!editingSubjectNew.trim()) {
                          swalAlert("Nama mapel baru tidak boleh kosong.");
                          return;
                        }
                        if (subjects.includes(editingSubjectNew.trim()) && editingSubjectNew.trim() !== editingSubjectOld) {
                          swalAlert("Mata Pelajaran tersebut sudah terdaftar.");
                          return;
                        }
                        onUpdateSubject(editingSubjectOld, editingSubjectNew.trim());
                        swalAlert(`Berhasil memperbarui mapel dari '${editingSubjectOld}' menjadi '${editingSubjectNew.trim()}'.`);
                        setEditingSubjectOld(null);
                        setEditingSubjectNew("");
                      }}
                      className="bg-natural-mid hover:bg-natural-dark text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer transition-colors flex-1"
                    >
                      Simpan
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        setEditingSubjectOld(null);
                        setEditingSubjectNew("");
                      }}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs px-3 py-2.5 rounded-xl cursor-pointer transition-colors"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-slate-600 font-bold text-xs block">Nama Mapel Baru</label>
                    <input
                      type="text"
                      placeholder="cth: Pemrograman Berorientasi Objek"
                      className="w-full bg-[#FBFBFA] border border-natural-border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-natural-sage font-mono"
                      value={newSubjectInput}
                      onChange={(e) => setNewSubjectInput(e.target.value)}
                    />
                  </div>
                  
                  <button
                    type="button"
                    onClick={async () => {
                      const clean = newSubjectInput.trim();
                      if (!clean) {
                        swalAlert("Nama mata pelajaran tidak boleh kosong.");
                        return;
                      }
                      if (subjects.includes(clean)) {
                        swalAlert("Mata pelajaran tersebut sudah terdaftar.");
                        return;
                      }
                      onAddSubject(clean);
                      swalAlert(`Berhasil menambahkan mapel '${clean}' ke dalam sistem.`);
                      setNewSubjectInput("");
                    }}
                    className="bg-natural-mid hover:bg-natural-dark text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer transition-colors w-full"
                  >
                    Tambah Mapel
                  </button>
                </div>
              )}
            </div>

            {/* List Subjects Table */}
            <div className="bg-white p-5 rounded-2xl border border-natural-border shadow-3xs space-y-4 md:col-span-2">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Daftar Mata Pelajaran Terdaftar ({subjects.length})
              </h4>

              <div className="border border-natural-border rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#FBFBFA] border-b border-natural-border text-natural-dark font-bold text-xs">
                      <th className="p-3">No</th>
                      <th className="p-3">Nama Mata Pelajaran</th>
                      <th className="p-3 text-center">Aksi Relasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-natural-border/40 text-xs">
                    {subjects.map((sub, index) => {
                      return (
                        <tr key={sub} className="hover:bg-[#FBFBFA]/30 transition-colors">
                          <td className="p-3 text-slate-400 font-mono">{index + 1}</td>
                          <td className="p-3">
                            <span className="font-bold text-natural-dark font-mono bg-natural-accent/50 text-[10px] px-2 py-0.5 rounded-md border border-natural-border/30">
                              {sub}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <div className="inline-flex items-center gap-2">
                              <button
                                type="button"
                                onClick={async () => {
                                  setEditingSubjectOld(sub);
                                  setEditingSubjectNew(sub);
                                }}
                                className="p-1.5 text-slate-400 hover:text-natural-dark hover:bg-natural-accent rounded-lg transition-colors cursor-pointer"
                                title="Edit Nama Mapel"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={async () => {
                                  if (!await swalConfirm(`Hapus mata pelajaran ${sub}? Peringatan: ini mungkin mempengaruhi relasi RPP dan tugas.`)) {
                                    return;
                                  }
                                  onDeleteSubject(sub);
                                  swalAlert(`Mapel ${sub} telah berhasil dihapus.`);
                                }}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="Hapus Mapel"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Add / Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl border border-natural-border shadow-lg max-w-md w-full overflow-hidden p-6 relative space-y-4">
            <button 
              onClick={() => setIsFormOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="space-y-1">
              <h3 className="font-bold text-natural-dark text-sm flex items-center gap-1.5">
                <UserPlus size={16} className="text-natural-mid" />
                {editingStudent ? "Edit Profil Siswa" : "Tambah Siswa Baru"}
              </h3>
              <p className="text-[11px] text-slate-400">Silakan isi detail identitas siswa di bawah ini.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* Photo Upload Input */}
              <div className="space-y-1">
                <label className="text-slate-600 font-bold text-xs block">Foto Profil Siswa</label>
                <div className="flex items-center gap-3 bg-natural-bg p-2.5 rounded-xl border border-natural-border">
                  {photoUrl ? (
                    <img src={photoUrl} alt="Preview" className="w-12 h-12 rounded-xl object-cover border border-natural-border shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-natural-sage/20 text-natural-sage font-bold flex items-center justify-center shrink-0 text-sm">
                      {name ? name.charAt(0) : "S"}
                    </div>
                  )}
                  <div className="flex-1 space-y-1">
                    <input
                      type="file"
                      ref={photoInputRef}
                      onChange={handlePhotoUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="bg-white border border-natural-border hover:bg-natural-accent/30 text-natural-dark text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Upload size={13} />
                      <span>{photoUrl ? "Ganti Foto" : "Unggah Foto"}</span>
                    </button>
                    <p className="text-[9px] text-slate-400 font-mono">Format: JPG, PNG, WEBP</p>
                  </div>
                </div>
              </div>

              {/* Name */}
              <div className="space-y-1">
                <label className="text-slate-600 font-bold text-xs block">Nama Lengkap Siswa</label>
                <input
                  type="text"
                  placeholder="cth: Ahmad Dani"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-natural-border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-natural-sage"
                  required
                />
              </div>

              {/* NISN */}
              <div className="space-y-1">
                <label className="text-slate-600 font-bold text-xs block">NISN (10 Digit)</label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="cth: 0081234567"
                  value={nisn}
                  onChange={(e) => setNisn(e.target.value)}
                  className="w-full bg-white border border-natural-border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-natural-sage font-mono"
                  required
                />
              </div>

              {/* Class & Gender */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-600 font-bold text-xs block">Kelas</label>
                  <select
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full bg-white border border-natural-border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-natural-sage"
                  >
                    {classes.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-600 font-bold text-xs block">Jenis Kelamin (L/P)</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as "L" | "P")}
                    className="w-full bg-white border border-natural-border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-natural-sage"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
              </div>

              {formError && (
                <div className="p-2.5 bg-rose-50 border border-rose-100 text-rose-800 text-[10px] font-bold rounded-lg flex items-center gap-1.5">
                  <AlertCircle size={12} className="shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t border-natural-border/60">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl px-4 py-2 cursor-pointer transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-natural-mid hover:bg-natural-dark text-white text-xs font-bold rounded-xl px-5 py-2 cursor-pointer transition-colors"
                >
                  Simpan Data
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
