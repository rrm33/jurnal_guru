import { Student, LessonPlan, Attendance, Material, Task, TaskSubmission, DevelopmentProgress, DisciplineLog, TeacherProfile, AttendanceStatus, UserAccount } from "./types";
import { createSampleExcelDataUrl, createSampleImageDataUrl, createSamplePdfDataUrl } from "./lib/fileSampleUtils";

export const DEFAULT_TEACHER_PROFILE: TeacherProfile = {
  name: "Ryan Maulana, S.Kom.",
  nip: "19940823 202112 1 002",
  school: "SMKN 6 Jember",
  subjectGroup: "Rekayasa Perangkat Lunak (RPL)"
};

export const INITIAL_STUDENTS: Student[] = [
  // XI RPL 1
  { id: "std_101", name: "Aditya Pratama Putra", nisn: "0074128910", className: "XI RPL 1", gender: "L" },
  { id: "std_102", name: "Ahmad Fauzi", nisn: "0075192831", className: "XI RPL 1", gender: "L" },
  { id: "std_103", name: "Bunga Lestari", nisn: "0081293847", className: "XI RPL 1", gender: "P" },
  { id: "std_104", name: "Dwi Wahyudi", nisn: "0072938471", className: "XI RPL 1", gender: "L" },
  { id: "std_105", name: "Eka Rahmawati", nisn: "0083102938", className: "XI RPL 1", gender: "P" },
  { id: "std_106", name: "Fajar Ramadhan", nisn: "0079301928", className: "XI RPL 1", gender: "L" },
  { id: "std_107", name: "Gita Cahyani", nisn: "0084920193", className: "XI RPL 1", gender: "P" },
  { id: "std_108", name: "Hendra Wijaya", nisn: "0071920394", className: "XI RPL 1", gender: "L" },
  { id: "std_109", name: "Indah Permatasari", nisn: "0083920194", className: "XI RPL 1", gender: "P" },
  { id: "std_110", name: "Muhammad Rizky", nisn: "0074920195", className: "XI RPL 1", gender: "L" },

  // XI RPL 2
  { id: "std_201", name: "Nabila Putri Salsabila", nisn: "0083920111", className: "XI RPL 2", gender: "P" },
  { id: "std_202", name: "Nurul Hidayah", nisn: "0072938422", className: "XI RPL 2", gender: "P" },
  { id: "std_203", name: "Pratama Yudha", nisn: "0073948273", className: "XI RPL 2", gender: "L" },
  { id: "std_204", name: "Rian Ardiansyah", nisn: "0082938411", className: "XI RPL 2", gender: "L" },
  { id: "std_205", name: "Siti Aminah", nisn: "0074829302", className: "XI RPL 2", gender: "P" },
  { id: "std_206", name: "Taufik Hidayat", nisn: "0072938403", className: "XI RPL 2", gender: "L" },
  { id: "std_207", name: "Vina Amelia", nisn: "0082910394", className: "XI RPL 2", gender: "P" },
  { id: "std_208", name: "Wahyu Saputra", nisn: "0073910293", className: "XI RPL 2", gender: "L" },
  { id: "std_209", name: "Yusuf Ibrahim", nisn: "0074910294", className: "XI RPL 2", gender: "L" },
  { id: "std_210", name: "Zahra Syafira", nisn: "0083910295", className: "XI RPL 2", gender: "P" }
];

export const INITIAL_LESSON_PLANS: LessonPlan[] = [
  {
    id: "lp_01",
    week: 1,
    semester: 1,
    subject: "Pemrograman Web & Perangkat Bergerak",
    className: "XI RPL 1",
    topic: "Pengenalan HTML & CSS Dasar",
    competency: "Siswa memahami struktur dasar dokumen HTML dan pemformatan teks menggunakan CSS dasar untuk merancang halaman web sederhana.",
    activities: "1. Pendahuluan & Motivasi karir Web Developer\n2. Demonstrasi pembuatan HTML dasar menggunakan VS Code\n3. Praktikum mandiri membuat layout biodata diri dengan HTML & CSS\n4. Review hasil praktikum siswa",
    resources: "Slide Presentasi HTML, Cheat Sheet CSS, E-Book Pemrograman Web XI",
    status: "Completed",
    taskTitle: "Tugas Mandiri 1: Biodata Diri HTML & CSS",
    taskDescription: "Buatlah halaman biodata diri dengan HTML terstruktur yang mencakup Foto, Profil Singkat, Pendidikan, Keahlian, dan Kontak. Hias semenarik mungkin menggunakan CSS dasar. Simpan dengan nama index.html dan kumpulkan tautan file GitHub.",
    taskMaxPoints: 100,
    taskDeadline: "2026-07-18"
  },
  {
    id: "lp_02",
    week: 2,
    semester: 1,
    subject: "Pemrograman Web & Perangkat Bergerak",
    className: "XI RPL 1",
    topic: "Tailwind CSS & Responsive Design",
    competency: "Siswa mampu menerapkan Utility-first CSS framework (Tailwind CSS) untuk merancang antarmuka web yang responsif di mobile dan desktop.",
    activities: "1. Penjelasan konsep Responsive Design & Grid Layout\n2. Pengenalan instalasi Tailwind CSS via Play CDN & Vite\n3. Praktikum terpandu membuat Landing Page Portofolio\n4. Pengumpulan tugas ke repositori GitHub masing-masing",
    resources: "Dokumentasi Tailwind CSS, Repositori Starter, Tutorial Video",
    status: "Completed"
  },
  {
    id: "lp_03",
    week: 3,
    semester: 1,
    subject: "Pemrograman Web & Perangkat Bergerak",
    className: "XI RPL 1",
    topic: "Dasar JavaScript & DOM Manipulation",
    competency: "Siswa memahami sintaks dasar JavaScript (variabel, fungsi, percabangan) dan mampu memanipulasi elemen HTML secara dinamis (DOM).",
    activities: "1. Teori dasar variabel, tipe data, dan control flow\n2. Demo mengambil element dengan document.getElementById & querySelector\n3. Praktikum membuat kalkulator mini interaktif\n4. Evaluasi logika percabangan siswa",
    resources: "MDN Web Docs JavaScript, JSFiddle Playground",
    status: "Completed"
  },
  {
    id: "lp_04",
    week: 4,
    semester: 1,
    subject: "Pemrograman Web & Perangkat Bergerak",
    className: "XI RPL 1",
    topic: "Pengenalan React JS & State Management",
    competency: "Siswa memahami konsep Component-Based Architecture pada React JS, JSX syntax, serta penggunaan useState hook untuk reaktivitas.",
    activities: "1. Konsep SPA vs Multi Page Application\n2. Penjelasan React components, props, dan State\n3. Membuat aplikasi Counter dan To-Do List interaktif\n4. Sesi tanya jawab & debugging error bersama",
    resources: "Dokumentasi React Baru, CodeSandbox React Starter",
    status: "Scheduled"
  },
  {
    id: "lp_05",
    week: 5,
    semester: 1,
    subject: "Pemrograman Web & Perangkat Bergerak",
    className: "XI RPL 1",
    topic: "CRUD Data Menggunakan React & LocalStorage",
    competency: "Siswa mampu merancang aplikasi CRUD lengkap (Create, Read, Update, Delete) sederhana yang menyimpan data di browser LocalStorage.",
    activities: "1. Review konsep data array of objects\n2. Menulis fungsi tambah, edit, hapus data di React state\n3. Menyimpan dan mengambil JSON data dengan LocalStorage\n4. Penugasan proyek mandiri: Aplikasi Manajemen Buku Kas Mandiri",
    resources: "Repositori GitHub Rujukan, Panduan Langkah Demi Langkah",
    status: "Scheduled"
  },
  {
    id: "lp_06",
    week: 1,
    semester: 1,
    subject: "Pemrograman Web & Perangkat Bergerak",
    className: "XI RPL 2",
    topic: "Pengenalan HTML & CSS Dasar",
    competency: "Siswa memahami struktur dasar dokumen HTML dan pemformatan teks menggunakan CSS dasar untuk merancang halaman web sederhana.",
    activities: "1. Pendahuluan & Motivasi karir Web Developer\n2. Demonstrasi pembuatan HTML dasar menggunakan VS Code\n3. Praktikum mandiri membuat layout biodata diri dengan HTML & CSS\n4. Review hasil praktikum siswa",
    resources: "Slide Presentasi HTML, Cheat Sheet CSS, E-Book Pemrograman Web XI",
    status: "Completed"
  },
  {
    id: "lp_07",
    week: 2,
    semester: 1,
    subject: "Pemrograman Web & Perangkat Bergerak",
    className: "XI RPL 2",
    topic: "Tailwind CSS & Responsive Design",
    competency: "Siswa mampu menerapkan Utility-first CSS framework (Tailwind CSS) untuk merancang antarmuka web yang responsif di mobile dan desktop.",
    activities: "1. Penjelasan konsep Responsive Design & Grid Layout\n2. Pengenalan instalasi Tailwind CSS via Play CDN & Vite\n3. Praktikum terpandu membuat Landing Page Portofolio\n4. Pengumpulan tugas ke repositori GitHub masing-masing",
    resources: "Dokumentasi Tailwind CSS, Repositori Starter, Tutorial Video",
    status: "Completed"
  }
];

// Prepopulate attendance data for the last 3 active teaching days
export const INITIAL_ATTENDANCE: Attendance[] = [
  // 2026-07-13 - XI RPL 1 (Week 1 Lesson)
  { id: "att_1", date: "2026-07-13", className: "XI RPL 1", studentId: "std_101", status: AttendanceStatus.HADIR },
  { id: "att_2", date: "2026-07-13", className: "XI RPL 1", studentId: "std_102", status: AttendanceStatus.HADIR },
  { id: "att_3", date: "2026-07-13", className: "XI RPL 1", studentId: "std_103", status: AttendanceStatus.IZIN, notes: "Acara keluarga ke Surabaya" },
  { id: "att_4", date: "2026-07-13", className: "XI RPL 1", studentId: "std_104", status: AttendanceStatus.HADIR },
  { id: "att_5", date: "2026-07-13", className: "XI RPL 1", studentId: "std_105", status: AttendanceStatus.HADIR },
  { id: "att_6", date: "2026-07-13", className: "XI RPL 1", studentId: "std_106", status: AttendanceStatus.SAKIT, notes: "Surat sakit terlampir demam" },
  { id: "att_7", date: "2026-07-13", className: "XI RPL 1", studentId: "std_107", status: AttendanceStatus.HADIR },
  { id: "att_8", date: "2026-07-13", className: "XI RPL 1", studentId: "std_108", status: AttendanceStatus.HADIR },
  { id: "att_9", date: "2026-07-13", className: "XI RPL 1", studentId: "std_109", status: AttendanceStatus.HADIR },
  { id: "att_10", date: "2026-07-13", className: "XI RPL 1", studentId: "std_110", status: AttendanceStatus.ALPA, notes: "Tanpa keterangan" },

  // 2026-07-14 - XI RPL 2 (Week 1 Lesson)
  { id: "att_11", date: "2026-07-14", className: "XI RPL 2", studentId: "std_201", status: AttendanceStatus.HADIR },
  { id: "att_12", date: "2026-07-14", className: "XI RPL 2", studentId: "std_202", status: AttendanceStatus.HADIR },
  { id: "att_13", date: "2026-07-14", className: "XI RPL 2", studentId: "std_203", status: AttendanceStatus.HADIR },
  { id: "att_14", date: "2026-07-14", className: "XI RPL 2", studentId: "std_204", status: AttendanceStatus.HADIR },
  { id: "att_15", date: "2026-07-14", className: "XI RPL 2", studentId: "std_205", status: AttendanceStatus.HADIR },
  { id: "att_16", date: "2026-07-14", className: "XI RPL 2", studentId: "std_206", status: AttendanceStatus.SAKIT, notes: "Sakit pusing" },
  { id: "att_17", date: "2026-07-14", className: "XI RPL 2", studentId: "std_207", status: AttendanceStatus.HADIR },
  { id: "att_18", date: "2026-07-14", className: "XI RPL 2", studentId: "std_208", status: AttendanceStatus.HADIR },
  { id: "att_19", date: "2026-07-14", className: "XI RPL 2", studentId: "std_209", status: AttendanceStatus.HADIR },
  { id: "att_20", date: "2026-07-14", className: "XI RPL 2", studentId: "std_210", status: AttendanceStatus.HADIR },

  // 2026-07-16 - XI RPL 1 (Week 2 Lesson)
  { id: "att_21", date: "2026-07-16", className: "XI RPL 1", studentId: "std_101", status: AttendanceStatus.HADIR },
  { id: "att_22", date: "2026-07-16", className: "XI RPL 1", studentId: "std_102", status: AttendanceStatus.HADIR },
  { id: "att_23", date: "2026-07-16", className: "XI RPL 1", studentId: "std_103", status: AttendanceStatus.HADIR },
  { id: "att_24", date: "2026-07-16", className: "XI RPL 1", studentId: "std_104", status: AttendanceStatus.HADIR },
  { id: "att_25", date: "2026-07-16", className: "XI RPL 1", studentId: "std_105", status: AttendanceStatus.HADIR },
  { id: "att_26", date: "2026-07-16", className: "XI RPL 1", studentId: "std_106", status: AttendanceStatus.HADIR },
  { id: "att_27", date: "2026-07-16", className: "XI RPL 1", studentId: "std_107", status: AttendanceStatus.HADIR },
  { id: "att_28", date: "2026-07-16", className: "XI RPL 1", studentId: "std_108", status: AttendanceStatus.HADIR },
  { id: "att_29", date: "2026-07-16", className: "XI RPL 1", studentId: "std_109", status: AttendanceStatus.IZIN, notes: "Dispen lomba futsal HUT RI" },
  { id: "att_30", date: "2026-07-16", className: "XI RPL 1", studentId: "std_110", status: AttendanceStatus.HADIR }
];

export const INITIAL_MATERIALS: Material[] = [
  {
    id: "mat_1",
    className: "XI RPL 1",
    lessonPlanId: "lp_01",
    title: "Modul Dasar HTML & CSS-1",
    content: "Membahas konsep tag, atribut, struktur dokumen HTML5, serta styling teks dasar menggunakan CSS internal dan inline.",
    category: "Teori",
    createdAt: "2026-07-13"
  },
  {
    id: "mat_2",
    className: "XI RPL 1",
    lessonPlanId: "lp_02",
    title: "Langkah Sederhana Slicing UI Figma ke Tailwind",
    content: "Latihan langsung merancang navigasi responsif, Hero Section, dan Grid Projects dengan custom Tailwind breakpoints.",
    category: "Praktikum",
    createdAt: "2026-07-16"
  }
];

export const INITIAL_TASKS: Task[] = [];

export const INITIAL_TASK_SUBMISSIONS: TaskSubmission[] = [
  // Submissions for Task 1 (Biodata Diri - XI RPL 1)
  { 
    id: "sub_1", 
    taskId: "task_lp_01", 
    studentId: "std_101", 
    submissionDate: "2026-07-17", 
    status: "Selesai", 
    grade: 90, 
    feedback: "Karya bagus, penataan CSS sangat baik dan warna berpadu selaras.",
    studentAnswerText: "https://github.com/adityapratama/biodata-html-css\n\nSelamat pagi Pak Ryan, ini link repositori github saya untuk tugas biodata. Saya menggunakan layout grid sederhana agar responsif.",
    studentAnswerFile: {
      name: "screenshot_desain_web.png",
      size: "340 KB",
      dataUrl: createSampleImageDataUrl("Tampilan Portofolio Web Aditya Pratama")
    }
  },
  { 
    id: "sub_2", 
    taskId: "task_lp_01", 
    studentId: "std_102", 
    submissionDate: "2026-07-18", 
    status: "Selesai", 
    grade: 85, 
    feedback: "HTML rapi, pertahankan kualitas semantiknya!",
    studentAnswerText: "Tugas Biodata Diri - Ahmad Fauzi\nLink: https://github.com/ahmadfauzi/html-css-biodata\n\nSaya telah melengkapi tag semantik seperti <header>, <main>, <section>, dan <footer> sesuai instruksi.",
    studentAnswerFile: {
      name: "laporan_praktikum_ahmad.docx",
      size: "180 KB",
      dataUrl: "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,UEsDBBQABgA="
    }
  },
  { 
    id: "sub_3", 
    taskId: "task_lp_01", 
    studentId: "std_103", 
    submissionDate: "2026-07-18", 
    status: "Selesai", 
    grade: 95, 
    feedback: "Luar biasa! Animasi hover CSS bekerja dengan sempurna.",
    studentAnswerText: "Tugas Portofolio Biodata Diri - Bunga Lestari\nhttps://github.com/bungalestari/my-biodata\n\nSaya berkreasi dengan menambahkan animasi hover lembut pada item keahlian dan link kontak.",
    studentAnswerFile: {
      name: "rekap_elemen_html.xlsx",
      size: "12 KB",
      dataUrl: createSampleExcelDataUrl()
    }
  },
  { 
    id: "sub_4", 
    taskId: "task_lp_01", 
    studentId: "std_104", 
    submissionDate: "2026-07-18", 
    status: "Selesai", 
    grade: 78, 
    feedback: "Bagus, tapi pastikan tag img memiliki atribut alt yang benar.",
    studentAnswerText: "Nama: Dwi Wahyudi\nGithub: https://github.com/dwiwahyudi/biodata-web\n\nSudah selesai saya kerjakan pak, mohon koreksinya jika ada kesalahan tag.",
    studentAnswerFile: {
      name: "tugas_biodata_dwi.pdf",
      size: "150 KB",
      dataUrl: createSamplePdfDataUrl()
    }
  },
  { 
    id: "sub_5", 
    taskId: "task_lp_01", 
    studentId: "std_105", 
    submissionDate: "2026-07-18", 
    status: "Menunggu Penilaian", 
    feedback: "",
    studentAnswerText: "Tugas Membuat Biodata Mandiri - Eka Rahmawati\n\nTautan Github: https://github.com/ekarahma/biodata-rpl\nLive Demo: https://ekarahma-biodata.vercel.app\n\nSaya menambahkan styling tambahan menggunakan beberapa CSS variabel untuk palette warna pastel agar terlihat lebih modern. Mohon bimbingannya Pak Ryan!",
    studentAnswerFile: {
      name: "laporan_tugas_eka.pdf",
      size: "245 KB",
      dataUrl: createSamplePdfDataUrl()
    }
  },
  { id: "sub_6", taskId: "task_lp_01", studentId: "std_106", status: "Belum Mengumpulkan" },
  { 
    id: "sub_7", 
    taskId: "task_lp_01", 
    studentId: "std_107", 
    submissionDate: "2026-07-17", 
    status: "Selesai", 
    grade: 88, 
    feedback: "Responsifnya bekerja di desktop maupun mobile.",
    studentAnswerText: "https://github.com/gitacahyani/biodata-html-css-responsive\n\nSaya menggunakan media queries CSS untuk memastikan layout terlihat rapi di ukuran layar handphone dan tablet.",
    studentAnswerFile: {
      name: "ui_responsive_mobile.png",
      size: "420 KB",
      dataUrl: createSampleImageDataUrl("Tampilan UI Responsif Mobile - Gita Cahyani")
    }
  },
  { 
    id: "sub_8", 
    taskId: "task_lp_01", 
    studentId: "std_108", 
    submissionDate: "2026-07-18", 
    status: "Selesai", 
    grade: 80, 
    feedback: "Kodingan bersih, tambahkan lebih banyak variasi warna.",
    studentAnswerText: "Hendra Wijaya - XI RPL 1\nLink Github: https://github.com/hendrawijaya/biodata-sederhana"
  },
  { id: "sub_9", taskId: "task_lp_01", studentId: "std_109", status: "Belum Mengumpulkan" },
  { 
    id: "sub_10", 
    taskId: "task_lp_01", 
    studentId: "std_110", 
    submissionDate: "2026-07-18", 
    status: "Selesai", 
    grade: 75, 
    feedback: "Gaya penataan CSS eksternal sudah bagus, tolong hindari inline CSS.",
    studentAnswerText: "Tugas Biodata - Muhammad Rizky\nLink: https://github.com/mrizky/biodata-diri"
  }
];

export const INITIAL_DEVELOPMENT_PROGRESS: DevelopmentProgress[] = [
  {
    id: "dev_1",
    studentId: "std_101",
    date: "2026-07-15",
    aspect: "Logika Pemrograman",
    status: "Baik",
    notes: "Memiliki pemahaman alur data yang cepat, algoritma percabangan dipahami dengan cepat."
  },
  {
    id: "dev_2",
    studentId: "std_103",
    date: "2026-07-15",
    aspect: "UI/UX & Desain",
    status: "Sangat Baik",
    notes: "Kreatif dalam memadukan warna pada layout web. Sangat detail mengenai padding dan margin."
  },
  {
    id: "dev_3",
    studentId: "std_106",
    date: "2026-07-16",
    aspect: "Kualitas Kode",
    status: "Perlu Bimbingan",
    notes: "Kode masih berantakan dan belum menggunakan indentasi yang benar. Perlu bimbingan khusus instalasi ekstensi Prettier di VS Code."
  },
  {
    id: "dev_4",
    studentId: "std_110",
    date: "2026-07-16",
    aspect: "Inisiatif & Problem Solving",
    status: "Cukup",
    notes: "Suka mencoba hal baru, tapi cepat menyerah saat menemui pesan error merah. Perlu diajarkan cara membaca stack trace."
  }
];

export const INITIAL_DISCIPLINE_LOGS: DisciplineLog[] = [
  {
    id: "dis_1",
    studentId: "std_101",
    date: "2026-07-13",
    type: "Positif",
    category: "Tutor Sebaya",
    points: 15,
    actionTaken: "Apresiasi verbal di depan kelas",
    notes: "Membantu menjelaskan sintaks tag media HTML kepada 3 rekannya dengan sabar saat praktikum."
  },
  {
    id: "dis_2",
    studentId: "std_106",
    date: "2026-07-13",
    type: "Negatif",
    category: "Terlambat Masuk Kelas",
    points: -10,
    actionTaken: "Teguran lisan & tugas kebersihan ringan di lab",
    notes: "Terlambat masuk lab komputer selama 20 menit tanpa surat keterangan dari piket."
  },
  {
    id: "dis_3",
    studentId: "std_110",
    date: "2026-07-16",
    type: "Negatif",
    category: "Membuka Game saat Pembelajaran",
    points: -15,
    actionTaken: "Pemberatan sanksi & pematikan koneksi internet PC",
    notes: "Kedapatan bermain game web Poki saat sesi praktikum mandiri Tailwind CSS sedang berlangsung."
  },
  {
    id: "dis_4",
    studentId: "std_103",
    date: "2026-07-16",
    type: "Positif",
    category: "Piket Kebersihan Lab",
    points: 10,
    actionTaken: "Pujian di rekap jurnal",
    notes: "Inisiatif merapikan kabel keyboard, mouse, dan kursi lab di baris belakang agar terlihat tertata rapi."
  }
];

export const INITIAL_USER_ACCOUNTS: UserAccount[] = [
  {
    id: "usr_guru_1",
    username: "guru",
    name: "Ryan Maulana, S.Kom.",
    role: "guru",
    nip: "19940823 202112 1 002",
    password: "password"
  },
  {
    id: "usr_std_101",
    username: "0074128910",
    name: "Aditya Pratama Putra",
    role: "siswa",
    studentId: "std_101",
    className: "XI RPL 1",
    password: "123"
  },
  {
    id: "usr_std_102",
    username: "0075192831",
    name: "Ahmad Fauzi",
    role: "siswa",
    studentId: "std_102",
    className: "XI RPL 1",
    password: "123"
  }
];

// LocalStorage helpers to allow state persistence across reloads
export const loadData = <T>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (e) {
    console.error("Error loading data from localStorage for key: " + key, e);
    return defaultValue;
  }
};

export const saveData = <T>(key: string, data: T): void => {
  try {
    let dataToSave = data;
    if (key === "students" && Array.isArray(data)) {
      // Strip large photoUrl base64 strings to prevent QuotaExceededError in localStorage
      dataToSave = data.map((s: any) => ({ ...s, photoUrl: undefined })) as unknown as T;
    }
    localStorage.setItem(key, JSON.stringify(dataToSave));
  } catch (e) {
    console.warn("Warning: Could not save data to localStorage for key: " + key + " (Quota might be exceeded)");
  }
};
