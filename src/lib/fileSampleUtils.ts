import * as XLSX from "xlsx";
import { PreviewableFile } from "../components/FilePreviewModal";

// Helper to generate a real sample Excel .xlsx base64 string
export function createSampleExcelDataUrl(): string {
  const wsData = [
    ["No", "Nama Siswa", "Kelas", "Nilai HTML", "Nilai CSS", "Nilai JS", "Rata-Rata", "Status"],
    [1, "Aditya Pratama", "XI RPL 1", 90, 88, 92, 90.0, "LULUS"],
    [2, "Ahmad Fauzi", "XI RPL 1", 85, 82, 88, 85.0, "LULUS"],
    [3, "Bunga Lestari", "XI RPL 1", 95, 96, 94, 95.0, "LULUS"],
    [4, "Dwi Wahyudi", "XI RPL 1", 78, 80, 76, 78.0, "LULUS"],
    [5, "Eka Rahmawati", "XI RPL 1", 88, 90, 89, 89.0, "LULUS"],
    [6, "Fajar Ramadhan", "XI RPL 1", 80, 85, 82, 82.3, "LULUS"],
    [7, "Gita Cahyani", "XI RPL 1", 92, 91, 93, 92.0, "LULUS"],
    [8, "Hendra Wijaya", "XI RPL 1", 84, 80, 85, 83.0, "LULUS"]
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  XLSX.utils.book_append_sheet(wb, ws, "Rekap Nilai Siswa");

  // Add second worksheet
  const wsData2 = [
    ["Bulan", "Kehadiran (%)", "Tugas Terkumpul", "Catatan Guru"],
    ["Juli 2026", "98.5%", 10, "Sangat baik"],
    ["Agustus 2026", "96.0%", 12, "Pertahankan kedisiplinan"]
  ];
  const ws2 = XLSX.utils.aoa_to_sheet(wsData2);
  XLSX.utils.book_append_sheet(wb, ws2, "Laporan Kehadiran");

  const b64 = XLSX.write(wb, { type: "base64", bookType: "xlsx" });
  return `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${b64}`;
}

// Helper to generate a sample clean Image data URL (SVG encoded as Data URL)
export function createSampleImageDataUrl(title: string = "Desain UI Web Portofolio Siswa"): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
    <rect width="800" height="500" fill="#1E293B"/>
    <rect x="20" y="20" width="760" height="460" rx="16" fill="#0F172A" stroke="#334155" stroke-width="2"/>
    <circle cx="50" cy="50" r="8" fill="#EF4444"/>
    <circle cx="75" cy="50" r="8" fill="#F59E0B"/>
    <circle cx="100" cy="50" r="8" fill="#10B981"/>
    <text x="400" y="55" fill="#94A3B8" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">${title}</text>
    <line x1="20" y1="80" x2="780" y2="80" stroke="#334155" stroke-width="1.5"/>
    
    <rect x="50" y="110" width="220" height="330" rx="12" fill="#1E293B" stroke="#475569"/>
    <circle cx="160" cy="180" r="40" fill="#3B82F6"/>
    <rect x="80" y="240" width="160" height="16" rx="4" fill="#E2E8F0"/>
    <rect x="100" y="268" width="120" height="12" rx="4" fill="#64748B"/>
    <rect x="70" y="310" width="180" height="36" rx="8" fill="#10B981"/>
    <text x="160" y="332" fill="#FFFFFF" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">Hubungi Saya</text>
    
    <rect x="290" y="110" width="460" height="150" rx="12" fill="#1E293B" stroke="#475569"/>
    <text x="320" y="150" fill="#38BDF8" font-family="sans-serif" font-size="20" font-weight="bold">Selamat Datang di Portofolio Saya</text>
    <text x="320" y="180" fill="#94A3B8" font-family="sans-serif" font-size="13">Saya adalah siswa SMK Rekayasa Perangkat Lunak yang berfokus</text>
    <text x="320" y="200" fill="#94A3B8" font-family="sans-serif" font-size="13">pada pengembangan Web Responsif dengan React & Tailwind CSS.</text>

    <rect x="290" y="280" width="220" height="160" rx="12" fill="#1E293B" stroke="#475569"/>
    <text x="310" y="315" fill="#F43F5E" font-family="sans-serif" font-size="15" font-weight="bold">Keahlian HTML & CSS</text>
    <rect x="310" y="340" width="180" height="10" rx="5" fill="#334155"/>
    <rect x="310" y="340" width="160" height="10" rx="5" fill="#F43F5E"/>

    <rect x="530" y="280" width="220" height="160" rx="12" fill="#1E293B" stroke="#475569"/>
    <text x="550" y="315" fill="#10B981" font-family="sans-serif" font-size="15" font-weight="bold">Keahlian JavaScript</text>
    <rect x="550" y="340" width="180" height="10" rx="5" fill="#334155"/>
    <rect x="550" y="340" width="145" height="10" rx="5" fill="#10B981"/>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Sample Word document HTML string representation (mammoth or previewable)
export function getSampleWordHtml(): string {
  return `
    <div style="font-family: sans-serif; color: #1e293b; line-height: 1.6;">
      <h1 style="color: #0f172a; font-size: 1.5rem; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem; margin-bottom: 1rem;">
        MODUL PEMBELAJARAN: PENGENALAN HTML5 & CSS3
      </h1>
      <p style="font-size: 0.9rem; color: #64748b; margin-bottom: 1.5rem;">
        <strong>Mata Pelajaran:</strong> Pemrograman Web dan Perangkat Bergerak | <strong>Kelas:</strong> XI RPL
      </p>

      <h2 style="color: #1e293b; font-size: 1.2rem; margin-top: 1.5rem; margin-bottom: 0.5rem;">1. Pendahuluan</h2>
      <p style="margin-bottom: 1rem;">
        HTML (HyperText Markup Language) adalah bahasa standar yang digunakan untuk membuat dan menyusun struktur halaman web. Versi terbaru HTML5 menyediakan tag semantik seperti <code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;section&gt;</code>, dan <code>&lt;footer&gt;</code>.
      </p>

      <h2 style="color: #1e293b; font-size: 1.2rem; margin-top: 1.5rem; margin-bottom: 0.5rem;">2. Struktur Dokumen HTML Base</h2>
      <pre style="background: #f1f5f9; padding: 1rem; border-radius: 0.5rem; font-family: monospace; font-size: 0.85rem; overflow-x: auto;">
&lt;!DOCTYPE html&gt;
&lt;html lang="id"&gt;
  &lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;title&gt;Biodata Diri&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;h1&gt;Halo, Dunia!&lt;/h1&gt;
  &lt;/body&gt;
&lt;/html&gt;
      </pre>

      <h2 style="color: #1e293b; font-size: 1.2rem; margin-top: 1.5rem; margin-bottom: 0.5rem;">3. Tugas Praktikum Mandiri</h2>
      <ol style="margin-left: 1.25rem; margin-bottom: 1rem;">
        <li>Buatlah file baru dengan nama <code>index.html</code> di VS Code.</li>
        <li>Lengkapi biodata diri yang mencakup Foto Profil, Riwayat Pendidikan, dan Keahlian.</li>
        <li>Gunakan CSS dasar untuk mengatur warna latar belakang dan tata letak font.</li>
      </ol>
    </div>
  `;
}

// Sample PDF Data URL (valid minimal 1-page PDF encoded in base64)
export function createSamplePdfDataUrl(): string {
  // Sample PDF data URI or SVG-rendered PDF representation
  const pdfBase64 = "JVBERi0xLjQKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDAKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPj4KZW5kb2JqCjMgMCBvYmoKPDAKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgotTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovUmVzb3VyY2VzIDQgMCBSCi9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKNCAwIG9iago8PAovRm9udCA8PAovRjEgPDAKL1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvSGVsdmV0aWNhCj4+Cj4+Cj4+CmVuZG9iago1IDAgb2JqCjw8IC9MZW5ndGggNzMgPj4Kc3RyZWFtCkJUMC4xIDAgMCAwLjEgNTAgNzAwIFRkCi9GMSAyNCBUZgooTW9kdWwgRGFzYXIgSFRNTCAmIENTUyAtIFNNS04gNiBKZW1iZXIpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjDAwDAwMDA1OCAwMDAwMCBuIAowMDAwMDAxMTUgMDAwMDAgbiAKMDAwMDAwMjE0IDAwMDAwIG4gCjDAwDAwMDAzMDkgMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSA2Ci9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgo0MzIKJSVFT0Y=";
  return `data:application/pdf;base64,${pdfBase64}`;
}
