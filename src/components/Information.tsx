import React, { useState, useMemo } from "react";
import { 
  Info, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Image as ImageIcon,
  X,
  Upload,
  Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Information } from "../types";

interface InformationProps {
  informations: Information[];
  onAdd: (info: Information) => void;
  onUpdate: (info: Information) => void;
  onDelete: (id: string) => void;
  role: "guru" | "siswa";
}

export default function InformationTab({
  informations,
  onAdd,
  onUpdate,
  onDelete,
  role
}: InformationProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInfo, setEditingInfo] = useState<Information | null>(null);
  
  const [formData, setFormData] = useState({
    info: "",
    isi: "",
    gambar: ""
  });

  const filteredData = useMemo(() => {
    return informations.filter(i => 
      i.info.toLowerCase().includes(searchTerm.toLowerCase()) || 
      i.isi.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [informations, searchTerm]);

  const handleOpenAdd = () => {
    setEditingInfo(null);
    setFormData({ info: "", isi: "", gambar: "" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Information) => {
    setEditingInfo(item);
    setFormData({
      info: item.info,
      isi: item.isi,
      gambar: item.gambar || ""
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, gambar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.info.trim() || !formData.isi.trim()) return;

    if (editingInfo) {
      onUpdate({
        ...editingInfo,
        info: formData.info,
        isi: formData.isi,
        gambar: formData.gambar || undefined
      });
    } else {
      onAdd({
        id: "info_" + Date.now(),
        info: formData.info,
        isi: formData.isi,
        gambar: formData.gambar || undefined,
        createdAt: new Date().toISOString()
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Hapus informasi ini secara permanen?")) {
      onDelete(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="bg-white p-5 rounded-2xl border border-natural-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-natural-accent text-natural-mid p-3 rounded-xl border border-natural-border/50">
            <Info size={22} />
          </div>
          <div>
            <h3 className="font-bold text-natural-dark text-lg font-sans tracking-tight">Informasi Umum</h3>
            <p className="text-slate-500 text-xs font-medium mt-0.5">Papan pengumuman dan informasi seputar kegiatan akademik.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari informasi..."
              className="w-full pl-9 pr-4 py-2 bg-natural-bg border border-natural-border rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-natural-sage"
            />
          </div>
          
          {role === "guru" && (
            <button
              onClick={handleOpenAdd}
              className="bg-natural-dark hover:bg-natural-mid text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs whitespace-nowrap cursor-pointer"
            >
              <Plus size={15} />
              <span>Buat Info</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of Informations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredData.length > 0 ? (
          filteredData.map(item => (
            <div key={item.id} className="bg-white rounded-2xl border border-natural-border shadow-2xs overflow-hidden flex flex-col">
              {item.gambar ? (
                <div className="h-40 w-full overflow-hidden bg-natural-bg border-b border-natural-border">
                  <img src={item.gambar} alt={item.info} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="h-40 w-full bg-natural-bg border-b border-natural-border flex flex-col items-center justify-center text-slate-300 gap-2">
                  <ImageIcon size={32} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Tidak ada gambar</span>
                </div>
              )}
              
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-bold text-natural-dark text-sm leading-snug">{item.info}</h4>
                  {role === "guru" && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => handleOpenEdit(item)} className="p-1.5 text-slate-400 hover:text-natural-dark hover:bg-natural-accent rounded-lg transition-colors cursor-pointer">
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono mb-3">
                  <Calendar size={12} />
                  <span>{new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap flex-1">{item.isi}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center text-slate-400">
            <Info size={40} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm font-medium">Belum ada informasi tersedia.</p>
          </div>
        )}
      </div>

      {/* Modal CRUD */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-natural-border"
            >
              <div className="flex items-center justify-between pb-3 border-b border-natural-border mb-4">
                <h3 className="font-bold text-base text-natural-dark flex items-center gap-2">
                  <Info size={18} className="text-natural-sage" />
                  {editingInfo ? "Edit Informasi" : "Tambah Informasi"}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-natural-dark mb-1">Judul / Ringkasan (Info)</label>
                  <input
                    type="text"
                    value={formData.info}
                    onChange={(e) => setFormData(p => ({ ...p, info: e.target.value }))}
                    placeholder="Contoh: Pengumuman Ujian Tengah Semester"
                    className="w-full p-2.5 bg-natural-bg border border-natural-border rounded-xl focus:outline-none focus:border-natural-sage text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-natural-dark mb-1">Gambar Pendukung (Opsional)</label>
                  <div className="flex items-center gap-3">
                    {formData.gambar && (
                      <div className="w-16 h-16 rounded-xl border border-natural-border overflow-hidden shrink-0">
                        <img src={formData.gambar} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <label className="flex-1 flex flex-col items-center justify-center p-3 border-2 border-dashed border-natural-border rounded-xl hover:bg-natural-accent transition-colors cursor-pointer group">
                      <Upload size={16} className="text-slate-400 group-hover:text-natural-sage mb-1" />
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Upload Foto / Poster</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-natural-dark mb-1">Isi Detail</label>
                  <textarea
                    value={formData.isi}
                    onChange={(e) => setFormData(p => ({ ...p, isi: e.target.value }))}
                    placeholder="Ketikkan detail informasi di sini..."
                    rows={6}
                    className="w-full p-2.5 bg-natural-bg border border-natural-border rounded-xl focus:outline-none focus:border-natural-sage text-sm resize-none"
                    required
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl text-slate-600 hover:bg-natural-bg font-bold text-xs cursor-pointer">Batal</button>
                  <button type="submit" className="px-5 py-2 bg-natural-dark hover:bg-natural-mid text-white rounded-xl font-bold text-xs cursor-pointer">Simpan Informasi</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
