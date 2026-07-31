import { useState, useEffect, useMemo } from "react";
import { 
  LayoutDashboard, 
  BookOpen, 
  UserCheck, 
  FileText, 
  Award, 
  ShieldAlert, 
  Percent, 
  HardDrive,
  Menu,
  X,
  User,
  GraduationCap,
  Users,
  LogOut,
  KeyRound
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Types
import { 
  Student, 
  LessonPlan, 
  Attendance, 
  Material, 
  Task, 
  TaskSubmission, 
  DevelopmentProgress, 
  DisciplineLog, 
  TeacherProfile,
  AttendanceStatus,
  UserAccount
} from "./types";

// Data & Helpers
import { 
  DEFAULT_TEACHER_PROFILE, 
  INITIAL_STUDENTS, 
  INITIAL_LESSON_PLANS, 
  INITIAL_ATTENDANCE, 
  INITIAL_MATERIALS, 
  INITIAL_TASKS, 
  INITIAL_TASK_SUBMISSIONS, 
  INITIAL_DEVELOPMENT_PROGRESS, 
  INITIAL_DISCIPLINE_LOGS,
  INITIAL_USER_ACCOUNTS,
  loadData,
  saveData
} from "./data";
import { fetchFromApiOrLocal, saveItemToApi, deleteItemFromApi } from "./lib/apiClient";

// Components
import Dashboard from "./components/Dashboard";
import LessonPlans from "./components/LessonPlans";
import AttendanceComponent from "./components/Attendance";
import StudentManagement from "./components/StudentManagement";
import StudentProgress from "./components/StudentProgress";
import Discipline from "./components/Discipline";
import GradeRecap from "./components/GradeRecap";
import BackupData from "./components/BackupData";
import StudentPortal from "./components/StudentPortal";
import LoginScreen from "./components/LoginScreen";
import UserManagement from "./components/UserManagement";
import PhotoModal from "./components/PhotoModal";
import Profile from "./components/Profile";

type TabID = "dashboard" | "rpp" | "attendance" | "students" | "progress" | "discipline" | "grades" | "users" | "profile" | "backup";

export default function App() {
  // --- AUTH SESSION STATE ---
  const [authSession, setAuthSession] = useState<{
    isAuthenticated: boolean;
    role: "guru" | "siswa";
    studentData?: Student;
  } | null>(() => loadData("app_auth_session", null));

  // --- USER ACCOUNTS STATE ---
  const [users, setUsers] = useState<UserAccount[]>(() => 
    loadData("user_accounts", INITIAL_USER_ACCOUNTS)
  );

  // --- LIGHTBOX PHOTO MODAL STATE ---
  const [selectedPhotoStudent, setSelectedPhotoStudent] = useState<any>(null);

  // --- DATABASE STATE CORE ---
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile>(() => 
    loadData("teacher_profile", DEFAULT_TEACHER_PROFILE)
  );
  const [students, setStudents] = useState<Student[]>(() => 
    loadData("students", INITIAL_STUDENTS)
  );
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>(() => 
    loadData("lesson_plans", INITIAL_LESSON_PLANS)
  );
  const [attendance, setAttendance] = useState<Attendance[]>(() => 
    loadData("attendance", INITIAL_ATTENDANCE)
  );
  const [materials, setMaterials] = useState<Material[]>(() => 
    loadData("materials", INITIAL_MATERIALS)
  );
  const [tasks, setTasks] = useState<Task[]>(() => 
    loadData("tasks", INITIAL_TASKS)
  );
  const [submissions, setSubmissions] = useState<TaskSubmission[]>(() => 
    loadData("task_submissions", INITIAL_TASK_SUBMISSIONS)
  );
  const [developmentLogs, setDevelopmentLogs] = useState<DevelopmentProgress[]>(() => 
    loadData("development_logs", INITIAL_DEVELOPMENT_PROGRESS)
  );
  const [disciplineLogs, setDisciplineLogs] = useState<DisciplineLog[]>(() => 
    loadData("discipline_logs", INITIAL_DISCIPLINE_LOGS)
  );
  
  // Custom states: Midterm & Final Exams state
  const [examGrades, setExamGrades] = useState<{ [studentId: string]: { uts: number; uas: number } }>(() => {
    // default exams to 80 for realistic presentation
    const defaultExams: { [studentId: string]: { uts: number; uas: number } } = {};
    INITIAL_STUDENTS.forEach(std => {
      defaultExams[std.id] = { uts: 80, uas: 82 };
    });
    return loadData("exam_grades", defaultExams);
  });

  // --- SAVE HOOKS / EVENTS ---
  useEffect(() => { saveData("teacher_profile", teacherProfile); }, [teacherProfile]);
  useEffect(() => { saveData("students", students); }, [students]);
  useEffect(() => { saveData("lesson_plans", lessonPlans); }, [lessonPlans]);
  useEffect(() => { saveData("attendance", attendance); }, [attendance]);
  useEffect(() => { saveData("materials", materials); }, [materials]);
  useEffect(() => { saveData("tasks", tasks); }, [tasks]);
  useEffect(() => { saveData("task_submissions", submissions); }, [submissions]);
  useEffect(() => { saveData("development_logs", developmentLogs); }, [developmentLogs]);
  useEffect(() => { saveData("discipline_logs", disciplineLogs); }, [disciplineLogs]);
  useEffect(() => { saveData("exam_grades", examGrades); }, [examGrades]);
  useEffect(() => { saveData("user_accounts", users); }, [users]);
  useEffect(() => { saveData("app_auth_session", authSession); }, [authSession]);

  // --- AUTH & USER HANDLERS ---
  const handleLoginSuccess = (role: "guru" | "siswa", studentData?: Student) => {
    const session = { isAuthenticated: true, role, studentData };
    setAuthSession(session);
    saveData("app_auth_session", session);
  };

  const handleLogout = () => {
    setAuthSession(null);
    localStorage.removeItem("app_auth_session");
  };

  const handleAddUser = (user: UserAccount) => {
    setUsers(prev => [user, ...prev]);
  };

  const handleUpdateUser = (updatedUser: UserAccount) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  // --- INITIAL & PERIODIC BACKEND SYNC (MULTI-DEVICE) ---
  useEffect(() => {
    async function loadFromBackend() {
      try {
        const profile = await fetchFromApiOrLocal("teacher-profile", "teacher_profile", DEFAULT_TEACHER_PROFILE);
        if (profile) setTeacherProfile(profile);

        const stds = await fetchFromApiOrLocal("students", "students", INITIAL_STUDENTS);
        if (stds && stds.length > 0) setStudents(stds);

        const lps = await fetchFromApiOrLocal("lesson-plans", "lesson_plans", INITIAL_LESSON_PLANS);
        if (lps && lps.length > 0) setLessonPlans(lps);

        const att = await fetchFromApiOrLocal("attendance", "attendance", INITIAL_ATTENDANCE);
        if (att && att.length > 0) setAttendance(att);

        const mats = await fetchFromApiOrLocal("materials", "materials", INITIAL_MATERIALS);
        if (mats && mats.length > 0) setMaterials(mats);

        const tsks = await fetchFromApiOrLocal("tasks", "tasks", INITIAL_TASKS);
        if (tsks && tsks.length > 0) setTasks(tsks);

        const subs = await fetchFromApiOrLocal("task-submissions", "task_submissions", INITIAL_TASK_SUBMISSIONS);
        if (subs && subs.length > 0) setSubmissions(subs);

        const devLogs = await fetchFromApiOrLocal("development-progress", "development_logs", INITIAL_DEVELOPMENT_PROGRESS);
        if (devLogs && devLogs.length > 0) setDevelopmentLogs(devLogs);

        const discLogs = await fetchFromApiOrLocal("discipline-logs", "discipline_logs", INITIAL_DISCIPLINE_LOGS);
        if (discLogs && discLogs.length > 0) setDisciplineLogs(discLogs);

        const exGrades = await fetchFromApiOrLocal("exam-grades", "exam_grades", {});
        if (exGrades && Object.keys(exGrades).length > 0) setExamGrades(exGrades);
      } catch (err) {
        console.log("Using LocalStorage fallback mode");
      }
    }
    loadFromBackend();

    // Auto-poll server every 10 seconds to sync data across devices in real time
    const pollInterval = setInterval(() => {
      loadFromBackend();
    }, 10000);

    return () => clearInterval(pollInterval);
  }, []);

  // --- USER ROLE STATES ---
  const [userRole, setUserRole] = useState<"guru" | "siswa">(() => {
    return (localStorage.getItem("active_user_role") as "guru" | "siswa") || "guru";
  });

  useEffect(() => {
    localStorage.setItem("active_user_role", userRole);
  }, [userRole]);

  // Navigation state for RPP to Attendance redirect
  const [initialLessonPlanId, setInitialLessonPlanId] = useState<string>("");

  const handleRecordAttendanceFromRPP = (plan: LessonPlan) => {
    setInitialLessonPlanId(plan.id);
    setActiveTab("attendance");
  };

  // Navigation state for RPP to Student Progress / Grading redirect
  const [initialProgressClass, setInitialProgressClass] = useState<string>("");
  const [initialProgressTaskId, setInitialProgressTaskId] = useState<string>("");

  const handleOpenGradingFromRPP = (plan: LessonPlan) => {
    setInitialProgressClass(plan.className);
    setInitialProgressTaskId(`task_${plan.id}`);
    setActiveTab("progress");
  };

  // --- AUTOMATIC SYNC: RPP to Materials, Tasks and Submissions ---
  useEffect(() => {
    const generatedMaterials: Material[] = [];
    const generatedTasks: Task[] = [];
    const generatedSubmissions: TaskSubmission[] = [];

    lessonPlans.forEach(plan => {
      // 1. If RPP has material text or file, map it to Materials
      if (plan.materialText || plan.materialFile) {
        generatedMaterials.push({
          id: `mat_${plan.id}`,
          className: plan.className,
          lessonPlanId: plan.id,
          title: `Materi Wk ${plan.week}: ${plan.topic}`,
          content: plan.materialText || "",
          category: "Teori",
          createdAt: new Date().toISOString().split("T")[0],
          file: plan.materialFile
        });
      }

      // 2. If RPP has task, map it to Tasks
      if (plan.taskTitle) {
        const taskId = `task_${plan.id}`;
        generatedTasks.push({
          id: taskId,
          className: plan.className,
          title: plan.taskTitle,
          description: plan.taskDescription || "",
          maxPoints: plan.taskMaxPoints || 100,
          deadline: plan.taskDeadline || "",
          createdAt: new Date().toISOString().split("T")[0],
          lessonPlanId: plan.id
        });

        // Sync empty submissions for this auto task for all class students
        const classStudents = students.filter(s => s.className === plan.className);
        classStudents.forEach(student => {
          generatedSubmissions.push({
            id: `sub_${taskId}_${student.id}`,
            taskId,
            studentId: student.id,
            status: "Belum Mengumpulkan"
          });
        });
      }
    });

    // Merge manual items and auto items
    setMaterials(prev => {
      const manual = prev.filter(m => !m.lessonPlanId);
      const merged = [...manual, ...generatedMaterials];
      if (JSON.stringify(merged) !== JSON.stringify(prev)) {
        return merged;
      }
      return prev;
    });

    setTasks(prev => {
      // All tasks should be entered from the journal.
      // So we strictly use generatedTasks.
      const merged = generatedTasks;
      if (JSON.stringify(merged) !== JSON.stringify(prev)) {
        return merged;
      }
      return prev;
    });

    setSubmissions(prev => {
      // Migrate any existing submissions for 'task_1' to the journal-synced task 'task_lp_01'
      const migrated = prev.map(sub => {
        if (sub && sub.taskId === "task_1") {
          return {
            ...sub,
            id: (sub.id || "").replace("task_1", "task_lp_01"),
            taskId: "task_lp_01"
          };
        }
        return sub;
      }).filter(sub => sub && sub.taskId !== "task_2"); // clean up obsolete task_2

      const activeAutoTaskIds = generatedTasks.map(t => t.id);
      
      // Filter out auto-submissions that are for stale tasks
      const keptPrev = migrated.filter(sub => {
        if (!sub) return false;
        const subId = sub.id || "";
        const taskId = sub.taskId || "";
        const isAutoTask = subId.startsWith("sub_task_lp_") || subId.includes("_lp_") || taskId.startsWith("task_lp_");
        if (isAutoTask) {
          return activeAutoTaskIds.includes(taskId);
        }
        return true;
      });

      const merged = [...keptPrev];
      generatedSubmissions.forEach(gen => {
        const exists = merged.find(m => m.taskId === gen.taskId && m.studentId === gen.studentId);
        if (!exists) {
          merged.push(gen);
        }
      });

      if (JSON.stringify(merged) !== JSON.stringify(prev)) {
        return merged;
      }
      return prev;
    });

  }, [lessonPlans, students]);

  // --- CLASSES DATABASE STATE ---
  const [classes, setClasses] = useState<string[]>(() => {
    const saved = localStorage.getItem("rpl_classes");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    const fromStudents = Array.from(new Set(INITIAL_STUDENTS.map(s => s.className))).sort();
    return fromStudents.length > 0 ? fromStudents : ["XI RPL 1", "XI RPL 2", "XII RPL 1"];
  });

  useEffect(() => {
    localStorage.setItem("rpl_classes", JSON.stringify(classes));
  }, [classes]);

  const handleAddClass = (newClass: string) => {
    const cleanName = newClass.trim();
    if (!cleanName) return;
    setClasses(prev => {
      if (prev.includes(cleanName)) return prev;
      return [...prev, cleanName].sort();
    });
  };

  const handleUpdateClass = (oldClass: string, newClass: string) => {
    const cleanOld = oldClass.trim();
    const cleanNew = newClass.trim();
    if (!cleanOld || !cleanNew || cleanOld === cleanNew) return;

    setClasses(prev => prev.map(c => c === cleanOld ? cleanNew : c).sort());
    
    // Cascade update to students
    setStudents(prev => prev.map(s => s.className === cleanOld ? { ...s, className: cleanNew } : s));

    // Cascade update to lesson plans (RPP)
    setLessonPlans(prev => prev.map(p => p.className === cleanOld ? { ...p, className: cleanNew } : p));
  };

  const handleDeleteClass = (classToDelete: string) => {
    const cleanClass = classToDelete.trim();
    if (!cleanClass) return;

    setClasses(prev => prev.filter(c => c !== cleanClass));
    
    // Cascade: students in the deleted class will have their class set to empty string or "Belum Ditentukan"
    setStudents(prev => prev.map(s => s.className === cleanClass ? { ...s, className: "Belum Ditentukan" } : s));
  };


  // --- NAVIGATION STATE ---
  const [activeTab, setActiveTab] = useState<TabID>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- STATE MUTATORS FOR CHILDREN ---
  
  // Lesson Plans
  const handleAddPlan = (newPlan: LessonPlan) => {
    setLessonPlans(prev => [...prev, newPlan]);
    saveItemToApi("lesson-plans", newPlan);
  };
  const handleUpdatePlan = (updatedPlan: LessonPlan) => {
    setLessonPlans(prev => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p));
    saveItemToApi("lesson-plans", updatedPlan);
  };
  const handleDeletePlan = (id: string) => {
    setLessonPlans(prev => prev.filter(p => p.id !== id));
    deleteItemFromApi("lesson-plans", id);
  };

  // Attendance
  const handleSaveAttendance = (className: string, date: string, records: { studentId: string; status: AttendanceStatus; notes: string }[], lessonPlanId?: string) => {
    let newRecordsToSave: Attendance[] = [];
    setAttendance(prev => {
      // Remove any prior records matching this class & date, or matching the lessonPlanId if supplied
      const filtered = prev.filter(r => {
        if (lessonPlanId) {
          return r.lessonPlanId !== lessonPlanId;
        }
        return !(r.className === className && r.date === date);
      });
      // Map new ones
      newRecordsToSave = records.map((rec, i) => ({
        id: `att_${Date.now()}_${i}`,
        className,
        date,
        studentId: rec.studentId,
        status: rec.status,
        notes: rec.notes || undefined,
        lessonPlanId: lessonPlanId || undefined
      }));
      return [...filtered, ...newRecordsToSave];
    });
    saveItemToApi("attendance/bulk", newRecordsToSave);
  };

  // Student CRUD state updates
  const handleAddStudent = (newStudent: Student) => {
    setStudents(prev => [...prev, newStudent]);
    if (newStudent.className) {
      setClasses(prev => {
        if (prev.includes(newStudent.className)) return prev;
        return [...prev, newStudent.className].sort();
      });
    }
    saveItemToApi("students", newStudent);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    if (updatedStudent.className) {
      setClasses(prev => {
        if (prev.includes(updatedStudent.className)) return prev;
        return [...prev, updatedStudent.className].sort();
      });
    }
    saveItemToApi("students", updatedStudent);
  };

  const handleUpdateTeacherProfile = (updated: TeacherProfile) => {
    setTeacherProfile(updated);
    saveData("teacher_profile", updated);
    saveItemToApi("teacher-profile", updated);
  };

  const handleUpdateTeacherPassword = (newPassword: string) => {
    setUsers(prev => prev.map(u => u.username === "guru" ? { ...u, password: newPassword } : u));
  };

  const handleUpdateStudentPhoto = (studentId: string, photoUrl: string) => {
    let updatedStudentObj: Student | null = null;
    setStudents(prev => {
      const updated = prev.map(s => {
        if (s.id === studentId) {
          updatedStudentObj = { ...s, photoUrl };
          return updatedStudentObj;
        }
        return s;
      });
      saveData("students", updated);
      if (updatedStudentObj) {
        saveItemToApi("students", updatedStudentObj);
      }
      return updated;
    });

    if (authSession && authSession.studentData && authSession.studentData.id === studentId) {
      const updatedSession = {
        ...authSession,
        studentData: {
          ...authSession.studentData,
          photoUrl
        }
      };
      setAuthSession(updatedSession);
      saveData("app_auth_session", updatedSession);
    }
  };

  const handleUpdateStudentPassword = (studentId: string, newPassword: string) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return { ...s, password: newPassword, hasChangedPassword: true };
      }
      return s;
    }));

    if (authSession && authSession.studentData && authSession.studentData.id === studentId) {
      const updatedSession = {
        ...authSession,
        studentData: {
          ...authSession.studentData,
          password: newPassword,
          hasChangedPassword: true
        }
      };
      setAuthSession(updatedSession);
      saveData("app_auth_session", updatedSession);
    }
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    // Cascade delete logs and assignments for this student
    setAttendance(prev => prev.filter(a => a.studentId !== id));
    setSubmissions(prev => prev.filter(s => s.studentId !== id));
    setDevelopmentLogs(prev => prev.filter(d => d.studentId !== id));
    setDisciplineLogs(prev => prev.filter(d => d.studentId !== id));
    setExamGrades(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    deleteItemFromApi("students", id);
  };

  const handleBulkImportStudents = (newStudents: Student[]) => {
    setStudents(prev => {
      const existingNisns = new Set(prev.map(s => s.nisn));
      const filteredNew = newStudents.filter(s => !existingNisns.has(s.nisn));
      
      const newClassNames = Array.from(new Set(filteredNew.map(s => s.className)));
      setClasses(prevClasses => {
        const updated = [...prevClasses];
        newClassNames.forEach(cn => {
          if (cn && !updated.includes(cn)) {
            updated.push(cn);
          }
        });
        return updated.sort();
      });

      return [...prev, ...filteredNew];
    });
    saveItemToApi("students", newStudents);
  };


  // Materials
  const handleAddMaterial = (newMat: Material) => {
    setMaterials(prev => [...prev, newMat]);
    saveItemToApi("materials", newMat);
  };
  const handleDeleteMaterial = (id: string) => {
    setMaterials(prev => prev.filter(m => m.id !== id));
    deleteItemFromApi("materials", id);
  };

  // Tasks
  const handleAddTask = (newTask: Task) => {
    setTasks(prev => [...prev, newTask]);
    saveItemToApi("tasks", newTask);
  };
  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    setSubmissions(prev => prev.filter(s => s.taskId !== id)); // cascading delete submissions
    deleteItemFromApi("tasks", id);
  };

  // Submissions (Grades)
  const handleSaveSubmission = (updatedSub: TaskSubmission) => {
    setSubmissions(prev => {
      const exists = prev.some(s => s.id === updatedSub.id || (s.taskId === updatedSub.taskId && s.studentId === updatedSub.studentId));
      if (exists) {
        return prev.map(s => (s.id === updatedSub.id || (s.taskId === updatedSub.taskId && s.studentId === updatedSub.studentId)) ? updatedSub : s);
      }
      return [...prev, updatedSub];
    });
    saveItemToApi("task-submissions", updatedSub);
  };

  // Exams
  const handleSaveExamGrades = (studentId: string, uts: number, uas: number) => {
    setExamGrades(prev => ({
      ...prev,
      [studentId]: { uts, uas }
    }));
    saveItemToApi("exam-grades", { studentId, uts, uas });
  };

  // Student Development
  const handleAddDevLog = (newLog: DevelopmentProgress) => {
    setDevelopmentLogs(prev => [...prev, newLog]);
    saveItemToApi("development-progress", newLog);
  };
  const handleDeleteDevLog = (id: string) => {
    setDevelopmentLogs(prev => prev.filter(l => l.id !== id));
    deleteItemFromApi("development-progress", id);
  };

  // Discipline
  const handleAddDisciplineLog = (newLog: DisciplineLog) => {
    setDisciplineLogs(prev => [...prev, newLog]);
    saveItemToApi("discipline-logs", newLog);
  };
  const handleDeleteDisciplineLog = (id: string) => {
    setDisciplineLogs(prev => prev.filter(l => l.id !== id));
    deleteItemFromApi("discipline-logs", id);
  };

  // --- DATA EXPORT / IMPORT ENGINE ---
  const handleExportData = () => {
    const databaseDump = {
      teacherProfile,
      students,
      lessonPlans,
      attendance,
      materials,
      tasks,
      submissions,
      developmentLogs,
      disciplineLogs,
      examGrades
    };
    const jsonString = JSON.stringify(databaseDump, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `jurnal_guru_rpl_backup_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportData = (jsonData: string) => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.teacherProfile) setTeacherProfile(parsed.teacherProfile);
      if (parsed.students) setStudents(parsed.students);
      if (parsed.lessonPlans) setLessonPlans(parsed.lessonPlans);
      if (parsed.attendance) setAttendance(parsed.attendance);
      if (parsed.materials) setMaterials(parsed.materials);
      if (parsed.tasks) setTasks(parsed.tasks);
      if (parsed.submissions) setSubmissions(parsed.submissions);
      if (parsed.developmentLogs) setDevelopmentLogs(parsed.developmentLogs);
      if (parsed.disciplineLogs) setDisciplineLogs(parsed.disciplineLogs);
      if (parsed.examGrades) setExamGrades(parsed.examGrades);

      // Sync data snapshot to backend
      fetch("/api/sync-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: jsonData
      }).catch(() => {});
    } catch (e) {
      console.error("Error parsing backup string during import process", e);
    }
  };

  const handleResetData = () => {
    localStorage.clear();
    setTeacherProfile(DEFAULT_TEACHER_PROFILE);
    setStudents(INITIAL_STUDENTS);
    setLessonPlans(INITIAL_LESSON_PLANS);
    setAttendance(INITIAL_ATTENDANCE);
    setMaterials(INITIAL_MATERIALS);
    setTasks(INITIAL_TASKS);
    setSubmissions(INITIAL_TASK_SUBMISSIONS);
    setDevelopmentLogs(INITIAL_DEVELOPMENT_PROGRESS);
    setDisciplineLogs(INITIAL_DISCIPLINE_LOGS);

    const defaultExams: { [studentId: string]: { uts: number; uas: number } } = {};
    INITIAL_STUDENTS.forEach(std => {
      defaultExams[std.id] = { uts: 80, uas: 82 };
    });
    setExamGrades(defaultExams);

    // Sync default reset data to backend
    fetch("/api/sync-all", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teacherProfile: DEFAULT_TEACHER_PROFILE,
        students: INITIAL_STUDENTS,
        lessonPlans: INITIAL_LESSON_PLANS,
        attendance: INITIAL_ATTENDANCE,
        materials: INITIAL_MATERIALS,
        tasks: INITIAL_TASKS,
        taskSubmissions: INITIAL_TASK_SUBMISSIONS,
        developmentProgress: INITIAL_DEVELOPMENT_PROGRESS,
        disciplineLogs: INITIAL_DISCIPLINE_LOGS,
        examGrades: defaultExams
      })
    }).catch(() => {});
  };

  // Sidebar Menu configuration
  const menuItems = [
    { id: "dashboard", label: "Dashboard Analitik", icon: LayoutDashboard },
    { id: "rpp", label: "Rencana Semester (RPP)", icon: BookOpen },
    { id: "attendance", label: "Presensi & Keizinan", icon: UserCheck },
    { id: "students", label: "Kelola Data Siswa", icon: Users },
    { id: "progress", label: "Nilai & Progres Siswa", icon: Award },
    { id: "discipline", label: "Kedisiplinan & Sikap", icon: ShieldAlert },
    { id: "grades", label: "Rekap Nilai Akhir", icon: Percent },
    { id: "users", label: "Akses & User Accounts", icon: KeyRound },
    { id: "profile", label: "Profil Saya", icon: User },
    { id: "backup", label: "Backup & Hosting", icon: HardDrive }
  ] as const;

  // --- UNAUTHENTICATED ROUTE GUARD ---
  if (!authSession || !authSession.isAuthenticated) {
    return (
      <LoginScreen 
        students={students} 
        onLoginSuccess={handleLoginSuccess} 
      />
    );
  }

  const isTeacher = authSession.role === "guru";
  const loggedStudent = authSession.studentData || students[0];

  return (
    <div className="min-h-screen bg-natural-bg text-natural-text flex flex-col font-sans">
      
      {/* Upper Navigation Header (Visible on Screen only) */}
      <header className="bg-white border-b border-natural-border text-natural-text py-4 px-6 sticky top-0 z-50 flex items-center justify-between shadow-xs print:hidden">
        <div className="flex items-center gap-3">
          {isTeacher && (
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 hover:bg-natural-bg rounded-lg lg:hidden cursor-pointer text-natural-dark"
              title="Menu"
            >
              <Menu size={20} />
            </button>
          )}
          
          <div className="flex items-center gap-2">
            <div className="bg-natural-sage p-2 rounded-xl text-white">
              <GraduationCap size={22} />
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-tight sm:text-base text-natural-dark">Jurnal Mapel RPL</h1>
              <p className="text-[10px] text-natural-sage font-semibold tracking-wide font-mono">
                SMKN 6 JEMBER • {isTeacher ? "MODE GURU" : "PORTAL SISWA"}
              </p>
            </div>
          </div>
        </div>

        {/* User Badge & Logout Button */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => isTeacher && setActiveTab("profile")}
            className={`flex items-center gap-2.5 bg-natural-bg border border-natural-border px-3.5 py-1.5 rounded-xl text-xs transition-all ${isTeacher ? "hover:border-natural-sage cursor-pointer" : ""}`}
            title={isTeacher ? "Buka Profil Saya" : ""}
          >
            {isTeacher ? (
              <>
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (teacherProfile.photoUrl) {
                      setSelectedPhotoStudent({
                        name: teacherProfile.name,
                        subtitle: `NIP: ${teacherProfile.nip} • ${teacherProfile.school}`,
                        photoUrl: teacherProfile.photoUrl,
                        roleLabel: "Guru Pengajar"
                      });
                    } else {
                      setActiveTab("profile");
                    }
                  }}
                  className="shrink-0 cursor-pointer"
                  title="Klik untuk melihat foto profil guru"
                >
                  {teacherProfile.photoUrl ? (
                    <img src={teacherProfile.photoUrl} alt={teacherProfile.name} className="w-7 h-7 rounded-full object-cover border border-natural-border" />
                  ) : (
                    <div className="bg-natural-sage text-white p-1.5 rounded-lg">
                      <User size={15} />
                    </div>
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="font-bold text-natural-dark text-xs leading-none">{teacherProfile.name}</p>
                  <p className="text-[9px] text-slate-500 mt-1">NIP: {teacherProfile.nip}</p>
                </div>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setSelectedPhotoStudent(loggedStudent)}
                  className="cursor-pointer shrink-0"
                  title="Klik untuk lihat foto"
                >
                  {loggedStudent.photoUrl ? (
                    <img src={loggedStudent.photoUrl} alt={loggedStudent.name} className="w-7 h-7 rounded-full object-cover border border-natural-border" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-natural-sage text-white font-bold text-xs flex items-center justify-center">
                      {loggedStudent.name.charAt(0)}
                    </div>
                  )}
                </button>
                <div className="hidden sm:block text-left">
                  <p className="font-bold text-natural-dark text-xs leading-none">{loggedStudent.name}</p>
                  <p className="text-[9px] text-slate-500 mt-1">NISN: {loggedStudent.nisn} • {loggedStudent.className}</p>
                </div>
              </>
            )}
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-3xs"
            title="Keluar / Logout"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </header>

      {/* Main Body - Split Layout */}
      <div className="flex-1 flex relative">
        
        {/* Left Sidebar Navigation Drawer (Teacher Only) */}
        {isTeacher && (
          <aside className={`
            bg-natural-dark text-natural-light w-64 flex flex-col py-6 border-r border-natural-mid shrink-0
            absolute lg:relative top-0 bottom-0 left-0 z-40 transition-transform duration-300 lg:translate-x-0 print:hidden
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}>
            {/* Mobile close button inside sidebar */}
            <div className="flex justify-end px-4 lg:hidden">
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 text-natural-light/70 hover:text-white hover:bg-natural-mid rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-5 mb-6">
              <span className="text-[10px] uppercase tracking-wider text-natural-light/40 font-bold font-mono">Navigasi Utama</span>
            </div>

            {/* Nav links */}
            <nav className="flex-1 space-y-1 px-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsSidebarOpen(false); // Auto-close on mobile selection
                    }}
                    className={`
                      w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer
                      ${isActive 
                        ? "bg-natural-mid text-white shadow-xs font-semibold" 
                        : "text-natural-light/80 hover:text-white hover:bg-natural-mid"
                      }
                    `}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="px-5 mt-auto pt-6 border-t border-natural-mid/80">
              <div className="bg-natural-mid/40 p-3 rounded-xl border border-natural-mid/60 text-[10px] text-natural-light/60 font-mono space-y-1">
                <p>PROJEK JURNAL ELEKTRONIK</p>
                <p className="text-[9px] text-natural-light/40">SMKN 6 Jember v1.0</p>
              </div>
            </div>
          </aside>
        )}

        {/* Overlay background for mobile sidebar */}
        {isSidebarOpen && isTeacher && (
          <div 
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 z-30 lg:hidden print:hidden"
          ></div>
        )}

        {/* Right main workspace viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full transition-all print:p-0 print:max-w-none print:shadow-none print:bg-white overflow-hidden">
          {!isTeacher ? (
            <StudentPortal
              loggedStudent={loggedStudent}
              students={students}
              lessonPlans={lessonPlans}
              attendance={attendance}
              tasks={tasks}
              submissions={submissions}
              disciplineLogs={disciplineLogs}
              onSaveSubmission={handleSaveSubmission}
              onUpdateStudentPhoto={handleUpdateStudentPhoto}
              onUpdateStudentPassword={handleUpdateStudentPassword}
              onLogout={handleLogout}
              onSelectStudentPhoto={(student) => setSelectedPhotoStudent(student)}
            />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
              >
              {activeTab === "dashboard" && (
                <Dashboard 
                  students={students}
                  lessonPlans={lessonPlans}
                  attendance={attendance}
                  submissions={submissions}
                  disciplineLogs={disciplineLogs}
                />
              )}

              {activeTab === "rpp" && (
                <LessonPlans 
                  lessonPlans={lessonPlans}
                  onAddPlan={handleAddPlan}
                  onUpdatePlan={handleUpdatePlan}
                  onDeletePlan={handleDeletePlan}
                  classes={classes}
                  onRecordAttendance={handleRecordAttendanceFromRPP}
                  onOpenGrading={handleOpenGradingFromRPP}
                />
              )}

              {activeTab === "attendance" && (
                <AttendanceComponent 
                  students={students}
                  attendance={attendance}
                  onSaveAttendance={handleSaveAttendance}
                  classes={classes}
                  lessonPlans={lessonPlans}
                  initialLessonPlanId={initialLessonPlanId}
                  onClearInitialLessonPlanId={() => setInitialLessonPlanId("")}
                  onSelectStudentPhoto={(student) => setSelectedPhotoStudent(student)}
                />
              )}

              {activeTab === "students" && (
                <StudentManagement 
                  students={students}
                  classes={classes}
                  onAddStudent={handleAddStudent}
                  onUpdateStudent={handleUpdateStudent}
                  onDeleteStudent={handleDeleteStudent}
                  onBulkImport={handleBulkImportStudents}
                  onAddClass={handleAddClass}
                  onUpdateClass={handleUpdateClass}
                  onDeleteClass={handleDeleteClass}
                  onSelectStudentPhoto={(student) => setSelectedPhotoStudent(student)}
                />
              )}

              {activeTab === "progress" && (
                <StudentProgress 
                  students={students}
                  tasks={tasks}
                  submissions={submissions}
                  developmentLogs={developmentLogs}
                  onSaveSubmission={handleSaveSubmission}
                  onAddDevLog={handleAddDevLog}
                  onDeleteDevLog={handleDeleteDevLog}
                  classes={classes}
                  initialProgressClass={initialProgressClass}
                  initialProgressTaskId={initialProgressTaskId}
                  onClearInitialProgress={() => {
                    setInitialProgressClass("");
                    setInitialProgressTaskId("");
                  }}
                  onSelectStudentPhoto={(student) => setSelectedPhotoStudent(student)}
                />
              )}

              {activeTab === "discipline" && (
                <Discipline 
                  students={students}
                  disciplineLogs={disciplineLogs}
                  onAddLog={handleAddDisciplineLog}
                  onDeleteLog={handleDeleteDisciplineLog}
                  classes={classes}
                />
              )}

              {activeTab === "grades" && (
                <GradeRecap 
                  students={students}
                  tasks={tasks}
                  submissions={submissions}
                  disciplineLogs={disciplineLogs}
                  examGrades={examGrades}
                  onSaveExamGrades={handleSaveExamGrades}
                  classes={classes}
                  onSelectStudentPhoto={(student) => setSelectedPhotoStudent(student)}
                />
              )}

              {activeTab === "users" && (
                <UserManagement 
                  users={users}
                  students={students}
                  onAddUser={handleAddUser}
                  onUpdateUser={handleUpdateUser}
                  onDeleteUser={handleDeleteUser}
                />
              )}

              {activeTab === "profile" && (
                <Profile 
                  role="guru"
                  teacherProfile={teacherProfile}
                  onUpdateTeacherProfile={handleUpdateTeacherProfile}
                  onUpdateTeacherPassword={handleUpdateTeacherPassword}
                  onSelectPhotoPreview={(data) => setSelectedPhotoStudent(data)}
                />
              )}

              {activeTab === "backup" && (
                <BackupData 
                  onExport={handleExportData}
                  onImport={handleImportData}
                  onReset={handleResetData}
                />
              )}
            </motion.div>
          </AnimatePresence>
          )}
        </main>
      </div>

      {/* Global Student Photo Preview Lightbox Modal */}
      <PhotoModal 
        student={selectedPhotoStudent} 
        onClose={() => setSelectedPhotoStudent(null)} 
      />

      {/* Footer (Screen only) */}
      <footer className="bg-white border-t border-slate-100 py-3 px-6 text-center text-slate-400 text-[10px] print:hidden">
        © 2026 Jurnal Elektronik SMK Negeri 6 Jember • Jurusan Rekayasa Perangkat Lunak. All Rights Reserved.
      </footer>
    </div>
  );
}
