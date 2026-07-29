import React, { useRef, useState, useEffect } from "react";
import { Download, Upload, RotateCcw, HelpCircle, HardDrive, ShieldCheck, Database, CheckCircle2, XCircle, RefreshCw, Server } from "lucide-react";

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
  const [dbStatus, setDbStatus] = useState<"checking" | "connected" | "disconnected">("checking");
  const [dbConfig, setDbConfig] = useState<{ host?: string; database?: string; user?: string }>({});
  const [isInitializing, setIsInitializing] = useState(false);
  const [initMessage, setInitMessage] = useState<string | null>(null);

  const checkDbHealth = async () => {
    setDbStatus("checking");
    try {
      const res = await fetch("/api/health");
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        const data = await res.json();
        setDbStatus(data.database === "connected" ? "connected" : "disconnected");
        setDbConfig(data.config || {});
      } else {
        setDbStatus("disconnected");
      }
    } catch {
      setDbStatus("disconnected");
    }
  };

  useEffect(() => {
    checkDbHealth();
  }, []);

  const handleInitDb = async () => {
    setIsInitializing(true);
    setInitMessage(null);
    try {
      const res = await fetch("/api/init-db", { method: "POST" });
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        if (text.trim().startsWith("<!DOCTYPE") || text.includes("<html")) {
          throw new Error("Server cPanel mengembalikan halaman HTML. Pastikan aplikasi Node.js sudah di-restart dan cPanel mengarahkan request /api ke Node.js (bukan index.html statis).");
        }
        throw new Error(`Server mengembalikan respon tidak valid (${res.status}): ${text.slice(0, 80)}`);
      }
      const data = await res.json();
      if (res.ok && data.success) {
        setInitMessage("✅ Tabel MySQL berhasil dibuat dan disinkronkan!");
        checkDbHealth();
      } else {
        setInitMessage(`❌ Gagal: ${data.error || "Gagal menginisialisasi MySQL"}`);
      }
    } catch (err: any) {
      setInitMessage(`❌ Error: ${err.message}`);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === "string") {
        try {
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
      <div className="bg-white p-5 rounded-2xl border border-natural-border shadow-xs flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-natural-accent text-natural-mid p-2 rounded-xl border border-natural-border/50">
            <HardDrive size={20} />
          </div>
          <div>
            <h3 className="font-bold text-natural-dark text-base">Manajemen Database & Cadangan Data</h3>
            <p className="text-slate-400 text-xs">Aplikasi kini mendukung penyimpanan Database MySQL dan cadangan lokal JSON.</p>
          </div>
        </div>

        {/* DB Connection Badge */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-xl">
          <Database size={16} className="text-slate-600" />
          <span className="text-xs font-semibold text-slate-700">MySQL Status:</span>
          {dbStatus === "checking" && (
            <span className="text-xs text-amber-600 flex items-center gap-1 font-medium">
              <RefreshCw size={12} className="animate-spin" /> Memeriksa...
            </span>
          )}
          {dbStatus === "connected" && (
            <span className="text-xs text-emerald-600 flex items-center gap-1 font-bold">
              <CheckCircle2 size={14} /> Terhubung ({dbConfig.database || "MySQL"})
            </span>
          )}
          {dbStatus === "disconnected" && (
            <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
              <XCircle size={14} className="text-slate-400" /> Mode Lokal (LocalStorage)
            </span>
          )}
          <button 
            type="button"
            onClick={checkDbHealth} 
            className="ml-1 p-1 hover:bg-slate-200 rounded text-slate-500 transition-colors cursor-pointer"
            title="Cek Ulang Koneksi"
          >
            <RefreshCw size={12} />
          </button>
        </div>
      </div>

      {/* MySQL Control Box */}
      <div className="bg-white p-5 rounded-2xl border border-natural-border shadow-2xs space-y-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h4 className="font-bold text-natural-dark text-sm flex items-center gap-2">
              <Server size={18} className="text-emerald-600" /> Pengaturan Database MySQL (cPanel / Arenhost)
            </h4>
            <p className="text-slate-500 text-xs leading-relaxed mt-1">
              Data disimpan secara otomatis ke database MySQL jika variabel koneksi di file <code className="bg-slate-100 px-1 py-0.5 rounded text-emerald-800 font-mono text-[11px]">.env</code> sudah dikonfigurasi pada cPanel Node.js Selector.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleInitDb}
              disabled={isInitializing}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              {isInitializing ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  Menginisialisasi...
                </>
              ) : (
                <>
                  <Database size={14} />
                  Buat / Verifikasi Tabel MySQL
                </>
              )}
            </button>
          </div>
        </div>

        {initMessage && (
          <div className="text-xs p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono font-medium">
            {initMessage}
          </div>
        )}
      </div>

      {/* Backup Actions Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Export Data */}
        <div className="bg-white p-5 rounded-2xl border border-natural-border shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <h4 className="font-bold text-natural-dark text-sm flex items-center gap-2">
              <Download size={16} className="text-natural-mid" /> Ekspor Basis Data JSON
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
              <Upload size={16} className="text-natural-mid" /> Impor Basis Data JSON
            </h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              Unggah file backup `.json` yang telah Anda unduh sebelumnya untuk memulihkan seluruh data pembelajaran.
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
              Bersihkan seluruh modifikasi pribadi Anda dan kembalikan struktur data ke kondisi bawaan (template kelas RPL SMKN 6 Jember).
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

      {/* Guide Card for MySQL Hosting Setup */}
      <div className="bg-[#2C3E2D] p-6 rounded-2xl text-white space-y-4 shadow-md">
        <h4 className="font-bold text-sm flex items-center gap-2 text-[#E8EDDF]">
          <ShieldCheck size={18} className="text-[#8DA47E]" /> Cara Menghubungkan MySQL di cPanel / Arenhost
        </h4>
        
        <p className="text-slate-200 text-xs leading-relaxed">
          Berikut langkah singkat mengaktifkan MySQL di hosting cPanel / Arenhost Anda:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <p className="font-bold text-[#E8EDDF] font-mono text-[10px] uppercase mb-1">1. Buat Database MySQL</p>
            <p className="text-slate-200 leading-normal">
              Masuk ke cPanel ➔ menu <strong>MySQL® Databases</strong>. Buat database baru (misal: <code className="text-[#E8EDDF]">bisnisum_jurnal_guru</code>) dan user MySQL, lalu hubungkan dengan hak akses penuh (All Privileges).
            </p>
          </div>

          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <p className="font-bold text-[#E8EDDF] font-mono text-[10px] uppercase mb-1">2. Import schema.sql</p>
            <p className="text-slate-200 leading-normal">
              Buka menu <strong>phpMyAdmin</strong> di cPanel, pilih database Anda, klik tab <strong>Import</strong>, lalu pilih file <strong><code className="text-[#E8EDDF]">schema.sql</code></strong> yang ada di repository project ini.
            </p>
          </div>

          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <p className="font-bold text-[#E8EDDF] font-mono text-[10px] uppercase mb-1">3. Atur .env di Hosting</p>
            <p className="text-slate-200 leading-normal">
              Buka File Manager di cPanel, buat file <strong>.env</strong> di dalam folder project Anda, lalu masukkan kredensial MySQL: <br />
              <code className="text-[10px] font-mono text-emerald-300 block mt-1">DB_HOST=localhost<br />DB_USER=user_anda<br />DB_PASSWORD=password_anda<br />DB_NAME=db_anda</code>
            </p>
          </div>
        </div>

        <div className="bg-white/5 px-4.5 py-3 rounded-xl border border-white/10 text-[11px] leading-relaxed text-slate-200 flex items-center gap-2">
          <HelpCircle size={16} className="text-[#8DA47E] shrink-0" />
          <span>Jika MySQL belum diatur di server, aplikasi tetap berjalan lancar menggunakan mode penyimpanan lokal (LocalStorage browser).</span>
        </div>
      </div>
    </div>
  );
}
