-- SQL Database Schema for Jurnal Guru App
-- Import file ini ke phpMyAdmin atau MySQL di cPanel / Arenhost

CREATE TABLE IF NOT EXISTS `teacher_profile` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `nip` VARCHAR(100) NOT NULL,
  `school` VARCHAR(255) NOT NULL,
  `subjectGroup` VARCHAR(255) NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO `teacher_profile` (`id`, `name`, `nip`, `school`, `subjectGroup`) 
VALUES (1, 'Guru Pengampu', '19850101 201001 1 001', 'SMK Negeri 1 Cendrawasih', 'Pengembangan Perangkat Lunak & Gim (PPLG)');

CREATE TABLE IF NOT EXISTS `students` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `nisn` VARCHAR(50) NOT NULL,
  `className` VARCHAR(100) NOT NULL,
  `gender` ENUM('L', 'P') NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `lesson_plans` (
  `id` VARCHAR(50) PRIMARY KEY,
  `week` INT NOT NULL,
  `semester` INT NOT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `className` VARCHAR(100) NOT NULL,
  `topic` VARCHAR(255) NOT NULL,
  `competency` TEXT NOT NULL,
  `activities` TEXT NOT NULL,
  `resources` TEXT NOT NULL,
  `status` ENUM('Scheduled', 'Completed') DEFAULT 'Scheduled',
  `materialText` TEXT NULL,
  `materialFile` LONGTEXT NULL,
  `taskTitle` VARCHAR(255) NULL,
  `taskDescription` TEXT NULL,
  `taskMaxPoints` INT DEFAULT 100,
  `taskDeadline` VARCHAR(50) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `attendance` (
  `id` VARCHAR(50) PRIMARY KEY,
  `date` VARCHAR(20) NOT NULL,
  `className` VARCHAR(100) NOT NULL,
  `studentId` VARCHAR(50) NOT NULL,
  `status` ENUM('Hadir', 'Sakit', 'Izin', 'Alpa') NOT NULL,
  `notes` TEXT NULL,
  `lessonPlanId` VARCHAR(50) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `materials` (
  `id` VARCHAR(50) PRIMARY KEY,
  `className` VARCHAR(100) NOT NULL,
  `lessonPlanId` VARCHAR(50) NULL,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `category` ENUM('Teori', 'Praktikum', 'Referensi') NOT NULL,
  `createdAt` VARCHAR(50) NOT NULL,
  `file` LONGTEXT NULL,
  `created_timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `tasks` (
  `id` VARCHAR(50) PRIMARY KEY,
  `className` VARCHAR(100) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `maxPoints` INT DEFAULT 100,
  `deadline` VARCHAR(50) NOT NULL,
  `createdAt` VARCHAR(50) NOT NULL,
  `lessonPlanId` VARCHAR(50) NULL,
  `created_timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `task_submissions` (
  `id` VARCHAR(50) PRIMARY KEY,
  `taskId` VARCHAR(50) NOT NULL,
  `studentId` VARCHAR(50) NOT NULL,
  `submissionDate` VARCHAR(50) NULL,
  `status` ENUM('Belum Mengumpulkan', 'Menunggu Penilaian', 'Selesai') DEFAULT 'Belum Mengumpulkan',
  `grade` INT NULL,
  `feedback` TEXT NULL,
  `studentAnswerText` TEXT NULL,
  `studentAnswerFile` LONGTEXT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `development_progress` (
  `id` VARCHAR(50) PRIMARY KEY,
  `studentId` VARCHAR(50) NOT NULL,
  `date` VARCHAR(20) NOT NULL,
  `aspect` VARCHAR(255) NOT NULL,
  `status` ENUM('Perlu Bimbingan', 'Cukup', 'Baik', 'Sangat Baik') NOT NULL,
  `notes` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `discipline_logs` (
  `id` VARCHAR(50) PRIMARY KEY,
  `studentId` VARCHAR(50) NOT NULL,
  `date` VARCHAR(20) NOT NULL,
  `type` ENUM('Negatif', 'Positif') NOT NULL,
  `category` VARCHAR(255) NOT NULL,
  `points` INT NOT NULL,
  `actionTaken` TEXT NULL,
  `notes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
