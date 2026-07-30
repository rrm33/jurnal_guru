import React from "react";
import { X, Download, User, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Student } from "../types";

interface PhotoModalProps {
  student: Student | null;
  onClose: () => void;
}

export default function PhotoModal({ student, onClose }: PhotoModalProps) {
  if (!student) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-natural-border p-6 space-y-4 text-center relative"
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-natural-bg hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>

          {/* Student Header */}
          <div className="space-y-1 pt-2">
            <h3 className="text-base font-extrabold text-natural-dark">{student.name}</h3>
            <p className="text-xs text-natural-sage font-mono font-bold">
              NISN: {student.nisn} • Kelas {student.className}
            </p>
          </div>

          {/* Large Photo Frame */}
          <div className="relative mx-auto w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-2 border-natural-border bg-natural-bg shadow-inner flex items-center justify-center">
            {student.photoUrl ? (
              <img 
                src={student.photoUrl} 
                alt={student.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-natural-sage space-y-2">
                <div className="w-20 h-20 rounded-full bg-natural-sage/20 flex items-center justify-center text-2xl font-bold">
                  {student.name.charAt(0)}
                </div>
                <span className="text-[11px] font-semibold text-slate-400">Belum ada foto profil</span>
              </div>
            )}
          </div>

          {/* Badges / Details */}
          <div className="flex items-center justify-center gap-2 text-xs">
            <span className="bg-natural-bg border border-natural-border px-3 py-1 rounded-full font-bold text-natural-dark flex items-center gap-1.5">
              <GraduationCap size={14} className="text-natural-sage" />
              <span>Siswa RPL</span>
            </span>
            <span className="bg-natural-bg border border-natural-border px-3 py-1 rounded-full font-bold text-natural-dark">
              {student.gender === "L" ? "Laki-laki" : "Perempuan"}
            </span>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-center gap-2">
            {student.photoUrl && (
              <a 
                href={student.photoUrl} 
                download={`Foto_${student.name.replace(/\s+/g, "_")}.jpg`}
                className="bg-natural-dark hover:bg-natural-mid text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Download size={15} />
                <span>Unduh Foto</span>
              </a>
            )}
            <button 
              onClick={onClose}
              className="bg-natural-bg hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
