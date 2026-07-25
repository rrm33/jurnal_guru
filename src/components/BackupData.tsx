import React, { useRef } from "react";
import { Download, Upload, RotateCcw, HelpCircle, HardDrive, ShieldCheck } from "lucide-react";

interface BackupDataProps {
  onExport: () => void;
  onImport: (jsonData: string) => void;
  onReset: () => void;
}

export default function BackupData({
  onExport,
  onImport,
  onReset
}: BackupDataProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === "string") {
        try {
          // Quick validation parse
          const parsed = JSON.parse(result);
          if (parsed.students && parsed.lessonPlans && parsed.attendance) {
            onImport(result);
            alert("Database Jurnal Guru RPL berhasil diimpor!");
          } else {
            alert("File backup tidak valid. Struktur data dalam file JSON tidak dikenali.");
          }
        } catch (err) {
          alert("Error membaca file JSON. Pastikan file tidak rusak.");
        }
      }
    };
    reader.readAsText(file);
    
    // Clear input so it triggers onChange even for same file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div id="backup-root" className="space-y-6">
      {/* Title */}
      <div className="bg-white p-5 rounded-2xl border border-natural-border shadow-xs flex items-center gap-3">
        <div className="bg-natural-accent text-natural-mid p-2 rounded-xl border border-natural-border/50">
          <HardDrive size={20} />
        </div>
        <div>
          <h3 className="font-bold text-natural-dark text-base">Manajemen Cadangan & Ekspor Data</h3>
          <p className="text-slate-400 text-xs">Simpan, pulihkan, dan amankan seluruh data jurnal pembelajaran Anda tanpa butuh server database terpisah.</p>
        </div>
      </div>

      {/* Backup Actions Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Export Data */}
        <div className="bg-white p-5 rounded-2xl border border-natural-border shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <h4 className="font-bold text-natural-dark text-sm flex items-center gap-2">
              <Download size={16} className="text-natural-mid" /> Ekspor Basis Data
            </h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              Unduh seluruh entri Anda (RPP, presensi harian, materi, nilai kuis, log sikap) dalam format berkas tunggal JSON yang ringkas. Simpan di komputer atau flashdisk sebagai cadangan berkala.
            </p>
          </div>
          <button
            type="button"
            onClick={onExport}
            className="w-full bg-natural-mid hover:bg-natural-dark text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-2 shadow-3xs text-center"
          >
            <Download size={14} /> Unduh File Backup (.json)
          </button>
        </div>

        {/* Card 2: Import Data */}
        <div className="bg-white p-5 rounded-2xl border border-natural-border shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <h4 className="font-bold text-natural-dark text-sm flex items-center gap-2">
              <Upload size={16} className="text-natural-mid" /> Impor Basis Data
            </h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              Unggah file backup `.json` yang telah Anda unduh sebelumnya untuk memulihkan seluruh data pembelajaran. Tindakan ini akan menimpa data yang ada di browser saat ini.
            </p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportFileChange}
            accept=".json"
            className="hidden"
          />
          <button
            type="button"
            onClick={triggerFileInput}
            className="w-full bg-natural-accent hover:bg-natural-light text-natural-dark font-bold text-xs py-2.5 rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-2 border border-natural-border"
          >
            <Upload size={14} /> Unggah File Backup (.json)
          </button>
        </div>

        {/* Card 3: Reset Default Templates */}
        <div className="bg-white p-5 rounded-2xl border border-natural-border shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <h4 className="font-bold text-natural-dark text-sm flex items-center gap-2 text-rose-600">
              <RotateCcw size={16} /> Setel Ulang Pabrik
            </h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              Bersihkan seluruh modifikasi pribadi Anda dan kembalikan struktur data ke kondisi bawaan (template kelas RPL SMKN 6 Jember). Gunakan jika ingin mencoba simulasi dari awal lagi.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (confirm("WARNING: Tindakan ini akan menghapus semua catatan presensi, materi, dan nilai tugas baru Anda secara permanen. Lanjutkan?")) {
                onReset();
                alert("Database berhasil dikembalikan ke template awal bawaan SMKN 6 Jember.");
              }
            }}
            className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs py-2.5 rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw size={14} /> Reset ke Template Awal
          </button>
        </div>
      </div>

      {/* Guide Card for Shared Hosting Upload */}
      <div className="bg-[#2C3E2D] p-6 rounded-2xl text-white space-y-4 shadow-md">
        <h4 className="font-bold text-sm flex items-center gap-2 text-[#E8EDDF]">
          <ShieldCheck size={18} className="text-[#8DA47E]" /> Panduan Hosting di Hostinger / Shared Hosting Lainnya
        </h4>
        
        <p className="text-slate-200 text-xs leading-relaxed">
          Aplikasi Jurnal Guru ini dirancang dengan pendekatan <strong>Static Single-Page Application (SPA)</strong> yang handal dengan penyimpanan klien terenkripsi. Keuntungan utama dari metode ini adalah <u>Anda tidak membutuhkan MySQL atau PHP backend yang rumit</u> untuk menjalankannya secara daring.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <p className="font-bold text-[#E8EDDF] font-mono text-[10px] uppercase mb-1">Langkah 1: Kompilasi</p>
            <p className="text-slate-200 leading-normal">
              Jalankan perintah pembangunan aplikasi di komputer lokal Anda: <br />
              <code className="bg-slate-900/60 px-1.5 py-0.5 rounded font-mono text-[10px] text-white mt-1.5 inline-block">npm run build</code>
            </p>
          </div>

          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <p className="font-bold text-[#E8EDDF] font-mono text-[10px] uppercase mb-1">Langkah 2: Ambil Output</p>
            <p className="text-slate-200 leading-normal">
              Buka direktori projek Anda, temukan folder bernama <strong><code className="text-[#E8EDDF]">dist/</code></strong>. Folder ini berisi file terkompresi HTML, CSS, dan JS yang siap disajikan secara global.
            </p>
          </div>

          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <p className="font-bold text-[#E8EDDF] font-mono text-[10px] uppercase mb-1">Langkah 3: Unggah</p>
            <p className="text-slate-200 leading-normal">
              Masuk ke hPanel Hostinger / cPanel Anda, buka File Manager, lalu seret dan unggah seluruh isi folder <strong>dist</strong> tadi langsung ke dalam folder <strong><code className="text-[#E8EDDF]">public_html</code></strong>. Selesai!
            </p>
          </div>
        </div>

        <div className="bg-white/5 px-4.5 py-3 rounded-xl border border-white/10 text-[11px] leading-relaxed text-slate-200 italic flex items-center gap-2">
          <HelpCircle size={16} className="text-[#8DA47E] shrink-0" />
          <span>Keamanan Data Terjamin: Karena seluruh data disimpan langsung di browser guru (atau diimpor/ekspor secara sadar via JSON), tidak ada risiko kebocoran database pusat dari server luar.</span>
        </div>
      </div>
    </div>
  );
}
