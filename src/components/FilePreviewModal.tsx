import React, { useState, useEffect, useMemo } from "react";
import { X, Download, ExternalLink, FileText, Image as ImageIcon, FileSpreadsheet, FileCode, ZoomIn, ZoomOut, RotateCcw, Search, Eye, AlertCircle, Loader2 } from "lucide-react";
import * as XLSX from "xlsx";
import mammoth from "mammoth";

export interface PreviewableFile {
  name: string;
  size?: string;
  dataUrl?: string;
  url?: string;
  type?: string;
}

interface FilePreviewModalProps {
  file: PreviewableFile | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function FilePreviewModal({ file, isOpen, onClose }: FilePreviewModalProps) {
  // Modal state
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Image controls
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);

  // Excel state
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [activeSheetName, setActiveSheetName] = useState<string>("");
  const [excelSearchQuery, setExcelSearchQuery] = useState<string>("");

  // Word state
  const [wordHtml, setWordHtml] = useState<string>("");

  // Text / Code state
  const [textContent, setTextContent] = useState<string>("");

  // Determine File Type Category
  const fileCategory = useMemo(() => {
    if (!file) return "unknown";
    const name = (file.name || "").toLowerCase();
    const dataUrl = (file.dataUrl || file.url || "").toLowerCase();

    if (
      name.endsWith(".png") || name.endsWith(".jpg") || name.endsWith(".jpeg") ||
      name.endsWith(".gif") || name.endsWith(".webp") || name.endsWith(".svg") ||
      dataUrl.startsWith("data:image/")
    ) {
      return "image";
    }

    if (
      name.endsWith(".pdf") || dataUrl.startsWith("data:application/pdf")
    ) {
      return "pdf";
    }

    if (
      name.endsWith(".xlsx") || name.endsWith(".xls") || name.endsWith(".csv") ||
      dataUrl.includes("spreadsheetml") || dataUrl.includes("excel") || dataUrl.includes("csv")
    ) {
      return "excel";
    }

    if (
      name.endsWith(".docx") || name.endsWith(".doc") ||
      dataUrl.includes("wordprocessingml") || dataUrl.includes("msword")
    ) {
      return "word";
    }

    if (
      name.endsWith(".txt") || name.endsWith(".json") || name.endsWith(".md") ||
      name.endsWith(".html") || name.endsWith(".css") || name.endsWith(".js") ||
      name.endsWith(".ts") || dataUrl.startsWith("data:text/")
    ) {
      return "text";
    }

    return "unknown";
  }, [file]);

  // Convert Data URL or URL to ArrayBuffer
  const getArrayBuffer = async (srcUrl: string): Promise<ArrayBuffer> => {
    if (!srcUrl) return new ArrayBuffer(0);
    if (srcUrl.startsWith("data:")) {
      const base64Parts = srcUrl.split(",");
      const base64Data = base64Parts[1] || "";
      const binaryString = atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.buffer;
    } else {
      const resp = await fetch(srcUrl);
      return await resp.arrayBuffer();
    }
  };

  // Convert Data URL or URL to Text
  const getTextFromSrc = async (srcUrl: string): Promise<string> => {
    if (!srcUrl) return "";
    if (srcUrl.startsWith("data:")) {
      const base64Parts = srcUrl.split(",");
      if (base64Parts[0].includes(";base64")) {
        return atob(base64Parts[1] || "");
      }
      return decodeURIComponent(base64Parts[1] || "");
    } else {
      const resp = await fetch(srcUrl);
      return await resp.text();
    }
  };

  // Process File when modal opens
  useEffect(() => {
    if (!isOpen || !file) return;

    setLoading(true);
    setErrorMsg(null);
    setZoomLevel(1);
    setRotation(0);
    setWorkbook(null);
    setActiveSheetName("");
    setWordHtml("");
    setTextContent("");
    setExcelSearchQuery("");

    const fileSrc = file.dataUrl || file.url || "";

    const parseFileContent = async () => {
      try {
        if (fileCategory === "excel") {
          if (!fileSrc) {
            setErrorMsg("Konten file Excel tidak ditemukan.");
            setLoading(false);
            return;
          }
          const arrayBuffer = await getArrayBuffer(fileSrc);
          const wb = XLSX.read(arrayBuffer, { type: "array" });
          setWorkbook(wb);
          if (wb.SheetNames.length > 0) {
            setActiveSheetName(wb.SheetNames[0]);
          }
        } else if (fileCategory === "word") {
          if (!fileSrc) {
            setErrorMsg("Konten file Word tidak ditemukan.");
            setLoading(false);
            return;
          }
          if (file.name.toLowerCase().endsWith(".docx") || fileSrc.includes("wordprocessingml")) {
            const arrayBuffer = await getArrayBuffer(fileSrc);
            const result = await mammoth.convertToHtml({ arrayBuffer });
            setWordHtml(result.value || "<p className='text-slate-400 italic'>Dokumen Word kosong.</p>");
          } else {
            // Fallback for older .doc binary files
            setWordHtml(`
              <div style="padding: 1rem; border: 1px solid #E2E8F0; border-radius: 0.75rem; background-color: #F8FAFC;">
                <h4 style="font-weight: bold; color: #1E293B; margin-bottom: 0.5rem;">Pratinjau Dokumen (.doc)</h4>
                <p style="color: #64748B; font-size: 0.875rem;">Dokumen format terdahulu (.doc). Untuk tampilan terbaik, simpan dokumen sebagai .docx. Anda tetap dapat mengunduh file ini kapan saja.</p>
              </div>
            `);
          }
        } else if (fileCategory === "text") {
          if (fileSrc) {
            const txt = await getTextFromSrc(fileSrc);
            setTextContent(txt);
          }
        }
      } catch (err: any) {
        console.error("Error parsing file:", err);
        setErrorMsg("Gagal memproses pratinjau file: " + (err.message || "Format tidak didukung."));
      } finally {
        setLoading(false);
      }
    };

    parseFileContent();
  }, [isOpen, file, fileCategory]);

  if (!isOpen || !file) return null;

  const fileSrc = file.dataUrl || file.url || "";

  // Render Excel Table View
  const renderExcelTable = () => {
    if (!workbook || !activeSheetName) return null;
    const sheet = workbook.Sheets[activeSheetName];
    if (!sheet) return null;

    // Convert sheet to JSON array of arrays
    const rawData = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1 });
    if (rawData.length === 0) {
      return (
        <div className="p-8 text-center text-slate-400 italic">
          Lembar kerja ini kosong.
        </div>
      );
    }

    const headers = rawData[0] || [];
    let rows = rawData.slice(1);

    if (excelSearchQuery.trim()) {
      const q = excelSearchQuery.toLowerCase();
      rows = rows.filter(row =>
        row.some((cell: any) => String(cell || "").toLowerCase().includes(q))
      );
    }

    return (
      <div className="flex flex-col h-full space-y-3">
        {/* Search & Sheet selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#FBFBFA] p-3 rounded-xl border border-natural-border">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {workbook.SheetNames.map((sName) => (
              <button
                key={sName}
                onClick={() => setActiveSheetName(sName)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer whitespace-nowrap transition-colors ${
                  activeSheetName === sName
                    ? "bg-natural-mid text-white shadow-2xs"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-natural-border"
                }`}
              >
                {sName}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari data dalam tabel..."
              value={excelSearchQuery}
              onChange={(e) => setExcelSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-natural-border rounded-lg text-xs focus:outline-none focus:border-natural-sage"
            />
          </div>
        </div>

        {/* Scrollable Table */}
        <div className="flex-1 overflow-auto border border-natural-border rounded-xl bg-white shadow-inner">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-natural-border">
                <th className="py-2 px-3 text-[10px] font-mono text-slate-400 border-r border-natural-border w-10 text-center">#</th>
                {headers.map((h: any, idx: number) => (
                  <th key={idx} className="py-2 px-3.5 text-left font-bold text-natural-dark border-r border-natural-border whitespace-nowrap">
                    {String(h ?? `Kolom ${idx + 1}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-natural-border/60">
              {rows.map((row: any[], rIdx: number) => (
                <tr key={rIdx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2 px-3 text-[10px] font-mono text-slate-400 border-r border-natural-border text-center bg-slate-50/50">
                    {rIdx + 1}
                  </td>
                  {headers.map((_, cIdx: number) => (
                    <td key={cIdx} className="py-2 px-3.5 text-slate-700 border-r border-natural-border/60 whitespace-nowrap">
                      {String(row[cIdx] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-5 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl border border-natural-border shadow-2xl w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-natural-border bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {fileCategory === "image" && <ImageIcon className="text-emerald-600 shrink-0" size={20} />}
            {fileCategory === "pdf" && <FileText className="text-rose-600 shrink-0" size={20} />}
            {fileCategory === "excel" && <FileSpreadsheet className="text-emerald-700 shrink-0" size={20} />}
            {fileCategory === "word" && <FileText className="text-blue-600 shrink-0" size={20} />}
            {fileCategory === "text" && <FileCode className="text-amber-600 shrink-0" size={20} />}
            {fileCategory === "unknown" && <FileText className="text-slate-500 shrink-0" size={20} />}

            <div className="min-w-0">
              <h3 className="font-bold text-natural-dark text-sm truncate max-w-md">{file.name}</h3>
              <p className="text-[10px] text-slate-400 font-mono flex items-center gap-2">
                <span>{file.size || "Ukuran tidak diketahui"}</span>
                <span>•</span>
                <span className="uppercase font-bold text-natural-mid">{fileCategory}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {fileSrc && (
              <a
                href={fileSrc}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-slate-100 text-slate-700 border border-natural-border text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                title="Buka di Tab Baru"
              >
                <ExternalLink size={13} />
                <span className="hidden sm:inline">Tab Baru</span>
              </a>
            )}

            {fileSrc && (
              <a
                href={fileSrc}
                download={file.name}
                className="bg-natural-mid hover:bg-natural-dark text-white text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                title="Unduh File"
              >
                <Download size={13} />
                <span className="hidden sm:inline">Unduh</span>
              </a>
            )}

            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-lg transition-colors cursor-pointer ml-1"
              title="Tutup Modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-hidden bg-slate-100/60 relative flex flex-col justify-center items-center">
          {loading ? (
            <div className="flex flex-col items-center gap-3 text-slate-500 py-12">
              <Loader2 size={32} className="animate-spin text-natural-mid" />
              <p className="text-xs font-semibold">Memuat pratinjau dokumen...</p>
            </div>
          ) : errorMsg ? (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-2xl max-w-md text-center space-y-3">
              <AlertCircle size={32} className="mx-auto text-rose-500" />
              <p className="font-bold text-xs">{errorMsg}</p>
              {fileSrc && (
                <a
                  href={fileSrc}
                  download={file.name}
                  className="inline-flex items-center gap-1.5 bg-rose-600 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-rose-700 transition-colors"
                >
                  <Download size={14} /> Unduh File Secara Langsung
                </a>
              )}
            </div>
          ) : (
            <>
              {/* IMAGE PREVIEW */}
              {fileCategory === "image" && (
                <div className="w-full h-full flex flex-col items-center justify-between relative overflow-hidden">
                  {/* Toolbar */}
                  <div className="absolute top-2 z-10 bg-white/90 backdrop-blur-xs border border-natural-border px-3 py-1.5 rounded-full shadow-md flex items-center gap-2">
                    <button
                      onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 3))}
                      className="p-1 hover:bg-slate-100 text-slate-600 rounded-md cursor-pointer"
                      title="Zoom In"
                    >
                      <ZoomIn size={15} />
                    </button>
                    <span className="text-[10px] font-mono font-bold text-slate-500 w-12 text-center">
                      {Math.round(zoomLevel * 100)}%
                    </span>
                    <button
                      onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.5))}
                      className="p-1 hover:bg-slate-100 text-slate-600 rounded-md cursor-pointer"
                      title="Zoom Out"
                    >
                      <ZoomOut size={15} />
                    </button>
                    <div className="w-px h-4 bg-slate-200 mx-1" />
                    <button
                      onClick={() => setRotation(prev => (prev + 90) % 360)}
                      className="p-1 hover:bg-slate-100 text-slate-600 rounded-md cursor-pointer"
                      title="Putar 90 Derajat"
                    >
                      <RotateCcw size={15} />
                    </button>
                    <button
                      onClick={() => { setZoomLevel(1); setRotation(0); }}
                      className="text-[10px] font-bold text-natural-mid hover:underline px-1 cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>

                  {/* Scrollable Canvas */}
                  <div className="w-full h-full overflow-auto flex items-center justify-center p-4">
                    <img
                      src={fileSrc}
                      alt={file.name}
                      style={{
                        transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                        transition: "transform 0.2s ease-out"
                      }}
                      className="max-w-full max-h-full object-contain rounded-lg shadow-lg border border-slate-200"
                    />
                  </div>
                </div>
              )}

              {/* PDF PREVIEW */}
              {fileCategory === "pdf" && (
                <div className="w-full h-full flex flex-col bg-white rounded-xl border border-natural-border overflow-hidden shadow-sm">
                  <iframe
                    src={`${fileSrc}#toolbar=1`}
                    title={file.name}
                    className="w-full h-full min-h-[500px] border-0"
                  />
                </div>
              )}

              {/* EXCEL PREVIEW */}
              {fileCategory === "excel" && (
                <div className="w-full h-full">
                  {renderExcelTable()}
                </div>
              )}

              {/* WORD DOCX PREVIEW */}
              {fileCategory === "word" && (
                <div className="w-full h-full overflow-y-auto p-4 sm:p-8 bg-slate-200/50 rounded-xl">
                  <div className="bg-white shadow-xl rounded-xl p-8 sm:p-12 max-w-3xl mx-auto border border-slate-200 min-h-[600px] text-slate-800 space-y-4">
                    <div className="border-b border-slate-100 pb-3 mb-4 flex items-center justify-between text-slate-400 text-[10px] font-mono">
                      <span>Dokumen Microsoft Word</span>
                      <span>{file.name}</span>
                    </div>

                    <div
                      className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: wordHtml }}
                    />
                  </div>
                </div>
              )}

              {/* PLAIN TEXT / CODE PREVIEW */}
              {fileCategory === "text" && (
                <div className="w-full h-full bg-slate-900 rounded-xl p-4 overflow-auto font-mono text-xs text-emerald-400 border border-slate-800 shadow-inner">
                  <pre className="whitespace-pre-wrap break-all leading-relaxed">
                    {textContent || "Teks kosong."}
                  </pre>
                </div>
              )}

              {/* UNKNOWN / OTHER FILE TYPES */}
              {fileCategory === "unknown" && (
                <div className="bg-white p-8 rounded-2xl border border-natural-border text-center space-y-4 max-w-md shadow-md">
                  <div className="w-16 h-16 rounded-2xl bg-natural-accent flex items-center justify-center mx-auto text-natural-dark">
                    <FileText size={32} />
                  </div>
                  <div>
                    <h4 className="font-bold text-natural-dark text-base">{file.name}</h4>
                    <p className="text-slate-400 text-xs mt-1">{file.size || "Ukuran file tertera"}</p>
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed bg-slate-50 p-3 rounded-xl border border-natural-border">
                    Pratinjau otomatis langsung tidak dapat merender ekstensi file ini secara langsung di browser. Anda dapat mengunduh atau membukanya di tab baru.
                  </p>
                  {fileSrc && (
                    <a
                      href={fileSrc}
                      download={file.name}
                      className="inline-flex items-center justify-center gap-2 bg-natural-mid hover:bg-natural-dark text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors w-full shadow-2xs"
                    >
                      <Download size={14} /> Unduh File Ini
                    </a>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
