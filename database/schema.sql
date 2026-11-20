-- =====================================================================
-- NSBM NewsDesk — Campus Pulse
-- Relational Database Schema & Initial Seed Data (MySQL / MariaDB)
-- NSBM Green University, Pitipana, Homagama, Sri Lanka
-- =====================================================================

CREATE DATABASE IF NOT EXISTS `nsbm_newsdesk` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `nsbm_newsdesk`;

-- Drop existing tables in dependency order if re-importing
DROP TABLE IF EXISTS `comments`;
DROP TABLE IF EXISTS `pulse_reminders`;
DROP TABLE IF EXISTS `likes`;
DROP TABLE IF EXISTS `bookmarks`;
DROP TABLE IF EXISTS `submissions`;
DROP TABLE IF EXISTS `dont_miss`;
DROP TABLE IF EXISTS `campus_pulse`;
DROP TABLE IF EXISTS `news_articles`;
DROP TABLE IF EXISTS `users`;

-- ---------------------------------------------------------------------
-- 1. Table: users
-- ---------------------------------------------------------------------
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
  `avatar` VARCHAR(255) DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
  `cohort` VARCHAR(100) DEFAULT 'Batch 26.1 IFSL',
  `interests` VARCHAR(255) DEFAULT 'Events,Academic,Technology,Campus Life',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 2. Table: news_articles
-- ---------------------------------------------------------------------
CREATE TABLE `news_articles` (
  `id` VARCHAR(64) PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `summary` TEXT NOT NULL,
  `content` LONGTEXT NOT NULL,
  `category` VARCHAR(60) NOT NULL,
  `cover_image` VARCHAR(255) NOT NULL,
  `author` VARCHAR(100) NOT NULL,
  `author_role` VARCHAR(100) NOT NULL,
  `author_avatar` VARCHAR(255) NOT NULL,
  `date` VARCHAR(60) NOT NULL,
  `read_time` VARCHAR(30) NOT NULL,
  `is_important` TINYINT(1) DEFAULT 0,
  `is_featured` TINYINT(1) DEFAULT 0,
  `views` INT DEFAULT 0,
  `likes` INT DEFAULT 0,
  `tags` VARCHAR(255) DEFAULT '',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 3. Table: campus_pulse
-- ---------------------------------------------------------------------
CREATE TABLE `campus_pulse` (
  `id` VARCHAR(64) PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `location` VARCHAR(150) NOT NULL,
  `date` VARCHAR(60) NOT NULL,
  `start_time` VARCHAR(40) NOT NULL,
  `end_time` VARCHAR(40) NOT NULL,
  `status` ENUM('happening_now', 'upcoming', 'completed') DEFAULT 'upcoming',
  `category` VARCHAR(60) NOT NULL,
  `organizer` VARCHAR(100) NOT NULL,
  `attendees` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 4. Table: dont_miss
-- ---------------------------------------------------------------------
CREATE TABLE `dont_miss` (
  `id` VARCHAR(64) PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `urgency` VARCHAR(30) NOT NULL,
  `due_label` VARCHAR(80) NOT NULL,
  `category` VARCHAR(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 5. Table: submissions (Student Reporter queue)
-- ---------------------------------------------------------------------
CREATE TABLE `submissions` (
  `id` VARCHAR(64) PRIMARY KEY,
  `ref_id` VARCHAR(64) NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL,
  `student_name` VARCHAR(100) NOT NULL,
  `student_email` VARCHAR(150) NOT NULL,
  `category` VARCHAR(60) NOT NULL,
  `details` LONGTEXT NOT NULL,
  `cover_image` VARCHAR(255) DEFAULT './images/hero_innovation_week.jpg',
  `status` ENUM('pending', 'approved', 'declined') DEFAULT 'pending',
  `submitted_date` VARCHAR(60) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 6. Table: bookmarks
-- ---------------------------------------------------------------------
CREATE TABLE `bookmarks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `article_id` VARCHAR(64) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_user_bookmark` (`user_id`, `article_id`),
  CONSTRAINT `fk_bookmarks_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bookmarks_article` FOREIGN KEY (`article_id`) REFERENCES `news_articles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 7. Table: likes
-- ---------------------------------------------------------------------
CREATE TABLE `likes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `article_id` VARCHAR(64) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_user_like` (`user_id`, `article_id`),
  CONSTRAINT `fk_likes_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_likes_article` FOREIGN KEY (`article_id`) REFERENCES `news_articles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 8. Table: pulse_reminders
-- ---------------------------------------------------------------------
CREATE TABLE `pulse_reminders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `pulse_id` VARCHAR(64) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_user_pulse` (`user_id`, `pulse_id`),
  CONSTRAINT `fk_reminders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_reminders_pulse` FOREIGN KEY (`pulse_id`) REFERENCES `campus_pulse` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 9. Table: comments
-- ---------------------------------------------------------------------
CREATE TABLE `comments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `article_id` VARCHAR(64) NOT NULL,
  `user_id` INT NULL,
  `name` VARCHAR(100) NOT NULL,
  `role` VARCHAR(60) NOT NULL,
  `text` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_comments_article` FOREIGN KEY (`article_id`) REFERENCES `news_articles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================================
-- INITIAL SEED DATA
-- Default Credentials:
-- Administrator: admin@nsbm.ac.lk / Admin@123
-- Student User:  kasun@students.nsbm.ac.lk / User@123
-- =====================================================================

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `avatar`, `cohort`, `interests`) VALUES
(1, 'Dr. Rasika Silva', 'admin@nsbm.ac.lk', '$2y$12$hJC48edO.pt0JOS20BP4oeuv9kJWi9sb29dtRLLFcvBRs6VEERPRW', 'ADMIN', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', 'Faculty of Computing & Media Unit', 'Events,Academic,Technology,Campus Life'),
(2, 'Kasun Perera', 'kasun@students.nsbm.ac.lk', '$2y$12$4EPTYn/PwSZUilrNAQ1DseK3PmIY8LZZZhiAHBZXIBap7228bMAoa', 'USER', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150', 'Batch 26.1 IFSL', 'Events,Academic,Technology,Campus Life');

-- ---------------------------------------------------------------------
-- News Articles (Verified Sinhala Names)
-- ---------------------------------------------------------------------
INSERT INTO `news_articles` (`id`, `title`, `summary`, `content`, `category`, `cover_image`, `author`, `author_role`, `author_avatar`, `date`, `read_time`, `is_important`, `is_featured`, `views`, `likes`, `tags`) VALUES
('art-01', 'NSBM Innovation Week 2026: Groundbreaking AI & Green Tech Projects Unveiled', 
 'Over 80 student teams from Computing, Engineering, and Business faculties showcased sustainable tech solutions before industry leaders and venture partners.',
 'NSBM Green University inaugurated its flagship annual tech symposium, Innovation Week 2026, yesterday at the University Auditorium and Central Technology Concourse.\n\nUnder the theme "Sustained Tech for Tomorrow\'s Cities," over 80 multidisciplinary teams gathered to demonstrate functional prototypes spanning autonomous agricultural drones, low-carbon smart campus microgrids, and multilingual health diagnostics systems.\n\nThe event was graced by prominent venture catalysts, industry CTOs from leading Sri Lankan and international tech enterprises, and distinguished university senate dignitaries.\n\n"What distinguishes NSBM Innovation Week this year is the direct translation from academic coursework into deployable, commercial-ready artifacts," said Prof. E. K. Chaminda, Dean of the Faculty of Computing. "Students are not merely writing papers; they are building tangible hardware and software platforms that address pressing societal challenges."\n\nKey Exhibition Highlights:\n• Project EcoPulse: An IoT sensor cluster monitoring campus rainwater catchment and solar storage in real-time.\n• BioSync AI: A computer vision diagnostic assistant developed by Batch 26.1 IFSL students tailored for regional healthcare clinics.\n• RoboSorter: An autonomous material sorting arm engineered by the Faculty of Engineering robotics division.\n\nIndustry judges awarded the Grand Champion trophy to Team Synapse from the Faculty of Computing for their edge-computing agricultural monitor. The top three winning teams were immediately offered incubation grants by NSBM Ventures and fast-track recruitment pathways.',
 'Events', './images/hero_innovation_week.jpg', 'NSBM NewsDesk Editorial', 'Campus Bureau', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', 'October 18, 2026', '4 min read', 1, 1, 3420, 248, 'Innovation,Computing,Exhibition,Startups'),

('art-02', 'New AI Research Lab Opens at NSBM Computing Complex',
 'State-of-the-art laboratory features 40 GPU-accelerated computing workstations, neural network testbeds, and collaborative research pods.',
 'The Faculty of Computing has officially commissioned the new Artificial Intelligence & Machine Learning Research Laboratory located on the 4th Floor of the Computing Complex.\n\nEquipped with high-performance GPU clusters, modular collaborative pod seating, and dedicated high-speed research fiber, the lab aims to supercharge student research into Large Language Models, Computer Vision, and Predictive Analytics.\n\nUndergraduate researchers in Batch 26.1 IFSL will be the inaugural cohort granted dedicated compute credits for their final year development capstones and IEEE publication manuscripts.\n\n"We want our students solving complex, compute-intensive problems without encountering hardware bottlenecks," noted the Head of Department during the ribbon-cutting ceremony. "This facility bridges the gap between theoretical algorithms and industrial-scale deployment."',
 'Academic', './images/news_ai_research_lab.jpg', 'Devinda Ratnayake', 'Computing Faculty Editor', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', 'October 16, 2026', '5 min read', 1, 0, 2150, 182, 'AI,Computing,Research,Lab'),

('art-03', 'Career Fair 2026 Announced: Over 50 Tier-1 Tech & Enterprise Employers Visiting Campus',
 'The Career Guidance Unit confirms top software companies, consultancies, and financial enterprises will conduct on-site interviews on October 28.',
 'The NSBM Career Guidance Unit (CGU) has finalized arrangements for the flagship Annual Career Fair 2026, set to take place across the Main Auditorium and Student Concourse.\n\nParticipating industry partners include top-tier software exporters, regional tech unicorns, telecommunications leaders, and multinational accounting firms.\n\nFinal-year undergraduates and pre-final interns from Computing, Business, and Engineering disciplines are invited to register early. CGU will conduct preliminary CV clinics and mock interview bootcamps across the coming two weeks to ensure students present their portfolios effectively.',
 'Events', './images/news_career_fair.jpg', 'Career Guidance Unit', 'Student Affairs', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', 'October 15, 2026', '3 min read', 1, 0, 2940, 210, 'Careers,Internships,Jobs,Recruitment'),

('art-04', 'Semester Examination Timetable Released for Batch 26.1 IFSL',
 'The Examination Division has published the formal schedule and hall allocations for the upcoming end-semester assessments.',
 'The Examination Division has officially published the draft and final timetables for the upcoming end-semester examinations across Computing, Business, and Engineering faculties.\n\nBatch 26.1 IFSL students can download their personalized seat allocations and examination room maps directly from the student intranet portal.\n\nImportant Guidelines:\n1. Students must carry valid NSBM Student ID cards and Examination Admission slips to each hall.\n2. Electronic smart watches and unauthorized devices are strictly prohibited inside exam halls.\n3. Any clash inquiries must be lodged with the respective faculty coordinator within 5 working days.',
 'Announcements', './images/hero_innovation_week.jpg', 'Examination Directorate', 'Academic Registry', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150', 'October 14, 2026', '2 min read', 1, 0, 4120, 95, 'Exams,Academic,Timetable,Batch 26.1'),

('art-05', 'NSBM Green University Cricket Team Advances to Inter-University Finals',
 'A thrilling 4-wicket victory over University of Moratuwa propels the Green Lions into the championship showdown this weekend.',
 'In a nail-biting semifinal clash that went down to the final over, the NSBM Green Lions cricket team secured their berth in the National Inter-University Championship Finals.\n\nChasing a formidable target of 264 runs set by the University of Moratuwa, captain Dinuka Perera anchored the innings with an unbeaten 88 runs off 72 deliveries. Support from all-rounder Kaveen Jayasuriya in the death overs sealed the dramatic win with three balls to spare.\n\nThe grand final is scheduled for this coming Saturday at 10:00 AM at the NSBM Grounds, with complimentary shuttle transport provided from all key student hostel blocks.',
 'Campus Life', './images/news_cricket_tournament.jpg', 'Sports Council Lead', 'Athletics Department', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150', 'October 12, 2026', '3 min read', 0, 0, 1890, 312, 'Sports,Cricket,Championship,Lions'),

('art-06', 'Technology Society Announces Hands-On Generative AI Bootcamp',
 'A weekend workshop series exploring LLM prompting, vector search embeddings, and modern web agent architectures.',
 'The NSBM Computing & Technology Society (TechSoc) is launching a comprehensive two-day technical workshop titled "Architecting Autonomous Web Agents & Generative Systems."\n\nLed by alumni software architects currently working at global tech consultancies, the bootcamp focuses on practical, project-based engineering. Participants will build end-to-end applications utilizing vector databases, agent workflows, and real-time frontend streaming interfaces.\n\nSessions will be conducted in Lab C301 with cloud compute environments sponsored by industry partners. Limited to 120 seats on a first-come, first-served basis.',
 'Academic', './images/news_ai_research_lab.jpg', 'TechSoc President', 'Computing Society', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150', 'October 10, 2026', '3 min read', 0, 0, 1420, 165, 'TechSoc,Workshop,AI,Coding'),

('art-07', 'Green Campus Eco-Initiative: Solar Shading Pavilions & Electric Shuttles',
 'NSBM marks another sustainability milestone with 300 kW additional rooftop solar arrays and zero-emission transit shuttles.',
 'Staying true to its identity as South Asia\'s premier Green University Town, NSBM has concluded Phase 4 of its campus decarbonization roadmap.\n\nThree new solar-canopied pedestrian walkways connecting the Student Recreation Hub with the Faculty of Computing have been completed, generating clean energy while offering shade against tropical rains.\n\nAdditionally, two new electric 14-seater shuttles have joined the internal campus fleet, operating continuously during peak class transition intervals.',
 'Campus Life', './images/hero_innovation_week.jpg', 'Green Council', 'Sustainability Cell', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', 'October 8, 2026', '3 min read', 0, 0, 1120, 142, 'GreenCampus,Eco,Solar,CampusLife');

-- ---------------------------------------------------------------------
-- Campus Pulse Items
-- ---------------------------------------------------------------------
INSERT INTO `campus_pulse` (`id`, `title`, `description`, `location`, `date`, `start_time`, `end_time`, `status`, `category`, `organizer`, `attendees`) VALUES
('pulse-01', 'Inter-University Cricket Tournament: Semifinal Day 2', 'NSBM Green Lions vs. Moratuwa. High energy match with big-screen broadcasting at student pavilion.', 'NSBM Sports Ground & Pavilion', 'Today', '10:00 AM', '4:00 PM', 'happening_now', 'Sports', 'NSBM Sports Council', 420),
('pulse-02', 'Tech Society Workshop: Introduction to Generative AI', 'Hands-on coding session exploring LLMs, agent architectures, and vector pipelines.', 'Innovation Lab C301', 'Tomorrow', '2:00 PM', '5:30 PM', 'upcoming', 'Technology', 'NSBM TechSoc', 110),
('pulse-03', 'Career Readiness Masterclass: Resume Crafting & Tech Interviews', 'Direct feedback session with alumni recruiters from senior software enterprises in Colombo.', 'Computing Complex Mini-Theatre', 'Oct 24, 2026', '3:30 PM', '5:00 PM', 'upcoming', 'Academic', 'Career Guidance Unit', 85),
('pulse-04', 'Freshers Orientation & Campus Life Welcome Festival', 'Comprehensive campus orientation, society recruitment stalls, and musical showcase.', 'Main University Auditorium & Lawn', 'Yesterday', '9:00 AM', '6:00 PM', 'completed', 'Campus Life', 'Student Welfare Directorate', 1250);

-- ---------------------------------------------------------------------
-- Don't Miss Items
-- ---------------------------------------------------------------------
INSERT INTO `dont_miss` (`id`, `title`, `description`, `urgency`, `due_label`, `category`) VALUES
('dm-01', 'Database Systems Assignment: Normalization & SQL Queries', 'Due tonight at 11:59 PM via VLE. SQL schema script and normalization report required.', 'today', 'Due Today, 11:59 PM', 'Academic'),
('dm-02', 'Annual Career Fair 2026 — Company Registrations Close', 'Upload verified resumes and reserve interview slots before tomorrow 5:00 PM.', 'tomorrow', 'Tomorrow at 5:00 PM', 'Events'),
('dm-03', 'Web & Mobile Application Development (Batch 26.1) Progress Review', 'Topic 1 NSBM NewsDesk architecture presentation and group progress demo.', '3_days', 'In 3 Days (Friday 9:00 AM)', 'Academic'),
('dm-04', 'Semester 2 Elective & Specialization Module Registration', 'Select elective modules for Cloud Architecture or Advanced Data Science.', 'urgent', 'Closes October 28', 'Announcements');

-- ---------------------------------------------------------------------
-- Student Submissions Queue (Sinhala Names)
-- ---------------------------------------------------------------------
INSERT INTO `submissions` (`id`, `ref_id`, `title`, `student_name`, `student_email`, `category`, `details`, `cover_image`, `status`, `submitted_date`) VALUES
('sub-101', 'NSBM-SUB-2026-8921', 'Faculty of Engineering Wins IEEE National Robotic Championship 2026', 'Kavindu Weerasinghe', 'kavindu.w@students.nsbm.ac.lk', 'Events', 'The undergraduate robotics team from NSBM Green University secured first place in the National Autonomous Navigation Challenge organized by IEEE Sri Lanka Section at BMICH.', './images/hero_innovation_week.jpg', 'pending', 'October 27, 2026'),
('sub-102', 'NSBM-SUB-2026-7432', 'Rotaract Club of NSBM Launches Annual Green Drive at Pitipana Grounds', 'Nimasha Fernando', 'nimasha.f@students.nsbm.ac.lk', 'Campus Life', 'Over 300 endemic seedlings were planted across the perimeter boundary of the university grounds. Dean of Faculty joined the morning flag-off ceremony.', './images/news_cricket_tournament.jpg', 'pending', 'October 26, 2026'),
('sub-103', 'NSBM-SUB-2026-6119', 'Computing Students Release Open-Source Sinhala Natural Language Toolkit', 'Sachithra Bandara', 'sachithra.b@students.nsbm.ac.lk', 'Academic', 'Batch 26.1 research group has published their tokenization and sentiment classification Python library on GitHub with benchmarks on local news corpora.', './images/news_ai_research_lab.jpg', 'approved', 'October 24, 2026');

-- ---------------------------------------------------------------------
-- Sample Comments (Sinhala Names)
-- ---------------------------------------------------------------------
INSERT INTO `comments` (`article_id`, `name`, `role`, `text`, `created_at`) VALUES
('art-01', 'Kavindu Senaratne', 'Batch 25.2', 'The robotics arm demonstration at the Central Concourse was super impressive! Great to see commercial venture mentors visiting campus.', NOW() - INTERVAL 2 HOUR),
('art-01', 'Rashmi Perera', 'Batch 26.1 IFSL', 'Our team will be presenting tomorrow morning at Pod 14. Come check out our predictive agricultural sensor!', NOW() - INTERVAL 4 HOUR),
('art-02', 'Sandun Jayasuriya', 'Batch 26.1 IFSL', 'Huge upgrade for our capstone research! Are we able to request remote SSH access to the GPU nodes?', NOW() - INTERVAL 1 DAY);

-- ---------------------------------------------------------------------
-- Initial User Bookmarks & Likes
-- ---------------------------------------------------------------------
INSERT INTO `bookmarks` (`user_id`, `article_id`) VALUES
(2, 'art-01'),
(2, 'art-03');

INSERT INTO `likes` (`user_id`, `article_id`) VALUES
(2, 'art-01');

INSERT INTO `pulse_reminders` (`user_id`, `pulse_id`) VALUES
(2, 'pulse-01');
