<?php
/**
 * NSBM NewsDesk — Campus Pulse
 * data.php
 * Simple, beginner-friendly PHP data store for NSBM Green University
 * Easily editable by beginner CS students.
 */

// 1. News Articles
$news_articles = [
    [
        'id' => 'art-01',
        'title' => 'NSBM Innovation Week 2026: Groundbreaking AI & Green Tech Projects Unveiled',
        'summary' => 'Over 80 student teams from Computing, Engineering, and Business faculties showcased sustainable tech solutions before industry leaders and venture partners.',
        'category' => 'Events',
        'cover_image' => 'images/hero_innovation_week.jpg',
        'author' => 'NSBM NewsDesk Editorial',
        'author_role' => 'Campus Bureau',
        'author_avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
        'date' => 'October 18, 2026',
        'read_time' => '4 min read',
        'is_important' => true,
        'views' => 3420,
        'likes' => 248,
        'tags' => ['Innovation', 'Computing', 'Exhibition', 'Startups'],
        'content' => "NSBM Green University inaugurated its flagship annual tech symposium, Innovation Week 2026, yesterday at the University Auditorium and Central Technology Concourse.\n\nUnder the theme \"Sustained Tech for Tomorrow's Cities,\" over 80 multidisciplinary teams gathered to demonstrate functional prototypes spanning autonomous agricultural drones, low-carbon smart campus microgrids, and multilingual health diagnostics systems.\n\nThe event was graced by prominent venture catalysts, industry CTOs from leading Sri Lankan and international tech enterprises, and distinguished university senate dignitaries.\n\n\"What distinguishes NSBM Innovation Week this year is the direct translation from academic coursework into deployable, commercial-ready artifacts,\" said Prof. E. K. Chaminda, Dean of the Faculty of Computing. \"Students are not merely writing papers; they are building tangible hardware and software platforms that address pressing societal challenges.\"\n\nKey Exhibition Highlights:\n• Project EcoPulse: An IoT sensor cluster monitoring campus rainwater catchment and solar storage in real-time.\n• BioSync AI: A computer vision diagnostic assistant developed by Batch 26.1 IFSL students tailored for regional healthcare clinics.\n• RoboSorter: An autonomous material sorting arm engineered by the Faculty of Engineering robotics division.\n\nIndustry judges awarded the Grand Champion trophy to Team Synapse from the Faculty of Computing for their edge-computing agricultural monitor. The top three winning teams were immediately offered incubation grants by NSBM Ventures and fast-track recruitment pathways."
    ],
    [
        'id' => 'art-02',
        'title' => 'New AI Research Lab Opens at NSBM Computing Complex',
        'summary' => 'State-of-the-art laboratory features 40 GPU-accelerated computing workstations, neural network testbeds, and collaborative research pods.',
        'category' => 'Academic',
        'cover_image' => 'images/news_ai_research_lab.jpg',
        'author' => 'Devinda Ratnayake',
        'author_role' => 'Computing Faculty Editor',
        'author_avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
        'date' => 'October 16, 2026',
        'read_time' => '5 min read',
        'is_important' => true,
        'views' => 2150,
        'likes' => 182,
        'tags' => ['AI', 'Computing', 'Research', 'Lab'],
        'content' => "The Faculty of Computing has officially commissioned the new Artificial Intelligence & Machine Learning Research Laboratory located on the 4th Floor of the Computing Complex.\n\nEquipped with high-performance GPU clusters, modular collaborative pod seating, and dedicated high-speed research fiber, the lab aims to supercharge student research into Large Language Models, Computer Vision, and Predictive Analytics.\n\nUndergraduate researchers in Batch 26.1 IFSL will be the inaugural cohort granted dedicated compute credits for their final year development capstones and IEEE publication manuscripts.\n\n\"We want our students solving complex, compute-intensive problems without encountering hardware bottlenecks,\" noted the Head of Department during the ribbon-cutting ceremony. \"This facility bridges the gap between theoretical algorithms and industrial-scale deployment.\""
    ],
    [
        'id' => 'art-03',
        'title' => 'Career Fair 2026 Announced: Over 50 Tier-1 Tech & Enterprise Employers Visiting Campus',
        'summary' => 'The Career Guidance Unit confirms top software companies, consultancies, and financial enterprises will conduct on-site interviews on October 28.',
        'category' => 'Events',
        'cover_image' => 'images/news_career_fair.jpg',
        'author' => 'Career Guidance Unit',
        'author_role' => 'Student Affairs',
        'author_avatar' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
        'date' => 'October 15, 2026',
        'read_time' => '3 min read',
        'is_important' => true,
        'views' => 2940,
        'likes' => 210,
        'tags' => ['Careers', 'Internships', 'Jobs', 'Recruitment'],
        'content' => "The NSBM Career Guidance Unit (CGU) has finalized arrangements for the flagship Annual Career Fair 2026, set to take place across the Main Auditorium and Student Concourse.\n\nParticipating industry partners include top-tier software exporters, regional tech unicorns, telecommunications leaders, and multinational accounting firms.\n\nFinal-year undergraduates and pre-final interns from Computing, Business, and Engineering disciplines are invited to register early. CGU will conduct preliminary CV clinics and mock interview bootcamps across the coming two weeks to ensure students present their portfolios effectively."
    ],
    [
        'id' => 'art-04',
        'title' => 'Semester Examination Timetable Released for Batch 26.1 IFSL',
        'summary' => 'The Examination Division has published the formal schedule and hall allocations for the upcoming end-semester assessments.',
        'category' => 'Announcements',
        'cover_image' => 'images/hero_innovation_week.jpg',
        'author' => 'Examination Directorate',
        'author_role' => 'Academic Registry',
        'author_avatar' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
        'date' => 'October 14, 2026',
        'read_time' => '2 min read',
        'is_important' => true,
        'views' => 4120,
        'likes' => 95,
        'tags' => ['Exams', 'Academic', 'Timetable', 'Batch 26.1'],
        'content' => "The Examination Division has officially published the draft and final timetables for the upcoming end-semester examinations across Computing, Business, and Engineering faculties.\n\nBatch 26.1 IFSL students can download their personalized seat allocations and examination room maps directly from the student intranet portal.\n\nImportant Guidelines:\n1. Students must carry valid NSBM Student ID cards and Examination Admission slips to each hall.\n2. Electronic smart watches and unauthorized devices are strictly prohibited inside exam halls.\n3. Any clash inquiries must be lodged with the respective faculty coordinator within 5 working days."
    ],
    [
        'id' => 'art-05',
        'title' => 'NSBM Green University Cricket Team Advances to Inter-University Finals',
        'summary' => 'A thrilling 4-wicket victory over University of Moratuwa propels the Green Lions into the championship showdown this weekend.',
        'category' => 'Campus Life',
        'cover_image' => 'images/news_cricket_tournament.jpg',
        'author' => 'Sports Council Lead',
        'author_role' => 'Athletics Department',
        'author_avatar' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
        'date' => 'October 12, 2026',
        'read_time' => '3 min read',
        'is_important' => false,
        'views' => 1890,
        'likes' => 312,
        'tags' => ['Sports', 'Cricket', 'Championship', 'Lions'],
        'content' => "In a nail-biting semifinal clash that went down to the final over, the NSBM Green Lions cricket team secured their berth in the National Inter-University Championship Finals.\n\nChasing a formidable target of 264 runs set by the University of Moratuwa, captain Dinuka Perera anchored the innings with an unbeaten 88 runs off 72 deliveries. Support from all-rounder Kaveen Jayasuriya in the death overs sealed the dramatic win with three balls to spare.\n\nThe grand final is scheduled for this coming Saturday at 10:00 AM at the NSBM Grounds, with complimentary shuttle transport provided from all key student hostel blocks."
    ],
    [
        'id' => 'art-06',
        'title' => 'Technology Society Announces Hands-On Generative AI Bootcamp',
        'summary' => 'A weekend workshop series exploring LLM prompting, vector search embeddings, and modern web agent architectures.',
        'category' => 'Academic',
        'cover_image' => 'images/news_ai_research_lab.jpg',
        'author' => 'TechSoc President',
        'author_role' => 'Computing Society',
        'author_avatar' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
        'date' => 'October 10, 2026',
        'read_time' => '3 min read',
        'is_important' => false,
        'views' => 1420,
        'likes' => 165,
        'tags' => ['TechSoc', 'Workshop', 'AI', 'Coding'],
        'content' => "The NSBM Computing & Technology Society (TechSoc) is launching a comprehensive two-day technical workshop titled \"Architecting Autonomous Web Agents & Generative Systems.\"\n\nLed by alumni software architects currently working at global tech consultancies, the bootcamp focuses on practical, project-based engineering. Participants will build end-to-end applications utilizing vector databases, agent workflows, and real-time frontend streaming interfaces.\n\nSessions will be conducted in Lab C301 with cloud compute environments sponsored by industry partners. Limited to 120 seats on a first-come, first-served basis."
    ],
    [
        'id' => 'art-07',
        'title' => 'Green Campus Eco-Initiative: Solar Shading Pavilions & Electric Shuttles',
        'summary' => 'NSBM marks another sustainability milestone with 300 kW additional rooftop solar arrays and zero-emission transit shuttles.',
        'category' => 'Campus Life',
        'cover_image' => 'images/hero_innovation_week.jpg',
        'author' => 'Green Council',
        'author_role' => 'Sustainability Cell',
        'author_avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
        'date' => 'October 8, 2026',
        'read_time' => '3 min read',
        'is_important' => false,
        'views' => 1120,
        'likes' => 142,
        'tags' => ['GreenCampus', 'Eco', 'Solar', 'CampusLife'],
        'content' => "Staying true to its identity as South Asia's premier Green University Town, NSBM has concluded Phase 4 of its campus decarbonization roadmap.\n\nThree new solar-canopied pedestrian walkways connecting the Student Recreation Hub with the Faculty of Computing have been completed, generating clean energy while offering shade against tropical rains.\n\nAdditionally, two new electric 14-seater shuttles have joined the internal campus fleet, operating continuously during peak class transition intervals."
    ]
];

// 2. Campus Pulse Items
$campus_pulse = [
    [
        'id' => 'pulse-01',
        'title' => 'Inter-University Cricket Tournament: Semifinal Day 2',
        'description' => 'NSBM Green Lions vs. Moratuwa. High energy match with big-screen broadcasting at student pavilion.',
        'location' => 'NSBM Sports Ground & Pavilion',
        'date' => 'Today',
        'start_time' => '10:00 AM',
        'end_time' => '4:00 PM',
        'status' => 'happening_now',
        'category' => 'Sports',
        'organizer' => 'NSBM Sports Council',
        'attendees' => 420
    ],
    [
        'id' => 'pulse-02',
        'title' => 'Tech Society Workshop: Introduction to Generative AI',
        'description' => 'Hands-on coding session exploring LLMs, agent architectures, and vector pipelines.',
        'location' => 'Innovation Lab C301',
        'date' => 'Tomorrow',
        'start_time' => '2:00 PM',
        'end_time' => '5:30 PM',
        'status' => 'upcoming',
        'category' => 'Technology',
        'organizer' => 'NSBM TechSoc',
        'attendees' => 110
    ],
    [
        'id' => 'pulse-03',
        'title' => 'Career Readiness Masterclass: Resume Crafting & Tech Interviews',
        'description' => 'Direct feedback session with alumni recruiters from senior software enterprises in Colombo.',
        'location' => 'Computing Complex Mini-Theatre',
        'date' => 'Oct 24, 2026',
        'start_time' => '3:30 PM',
        'end_time' => '5:00 PM',
        'status' => 'upcoming',
        'category' => 'Academic',
        'organizer' => 'Career Guidance Unit',
        'attendees' => 85
    ],
    [
        'id' => 'pulse-04',
        'title' => 'Freshers Orientation & Campus Life Welcome Festival',
        'description' => 'Comprehensive campus orientation, society recruitment stalls, and musical showcase.',
        'location' => 'Main University Auditorium & Lawn',
        'date' => 'Yesterday',
        'start_time' => '9:00 AM',
        'end_time' => '6:00 PM',
        'status' => 'completed',
        'category' => 'Campus Life',
        'organizer' => 'Student Welfare Directorate',
        'attendees' => 1250
    ]
];

// 3. Don't Miss Items
$dont_miss = [
    [
        'id' => 'dm-01',
        'title' => 'Database Systems Assignment: Normalization & SQL Queries',
        'description' => 'Due tonight at 11:59 PM via VLE. SQL schema script and normalization report required.',
        'urgency' => 'today',
        'due_label' => 'Due Today, 11:59 PM',
        'category' => 'Academic'
    ],
    [
        'id' => 'dm-02',
        'title' => 'Annual Career Fair 2026 — Company Registrations Close',
        'description' => 'Upload verified resumes and reserve interview slots before tomorrow 5:00 PM.',
        'urgency' => 'tomorrow',
        'due_label' => 'Tomorrow at 5:00 PM',
        'category' => 'Events'
    ],
    [
        'id' => 'dm-03',
        'title' => 'Web & Mobile Application Development (Batch 26.1) Progress Review',
        'description' => 'Topic 1 NSBM NewsDesk architecture presentation and group progress demo.',
        'urgency' => '3_days',
        'due_label' => 'In 3 Days (Friday 9:00 AM)',
        'category' => 'Academic'
    ],
    [
        'id' => 'dm-04',
        'title' => 'Semester 2 Elective & Specialization Module Registration',
        'description' => 'Select elective modules for Cloud Architecture or Advanced Data Science.',
        'urgency' => 'urgent',
        'due_label' => 'Closes October 28',
        'category' => 'Announcements'
    ]
];

// 4. Sample Comments Store
$article_comments = [
    'art-01' => [
        ['name' => 'Kavindu Senaratne', 'role' => 'Batch 25.2', 'text' => 'The robotics arm demonstration at the Central Concourse was super impressive! Great to see commercial venture mentors visiting campus.', 'time' => '2 hours ago'],
        ['name' => 'Rashmi Perera', 'role' => 'Batch 26.1 IFSL', 'text' => 'Our team will be presenting tomorrow morning at Pod 14. Come check out our predictive agricultural sensor!', 'time' => '4 hours ago']
    ],
    'art-02' => [
        ['name' => 'Sandun Jayasuriya', 'role' => 'Batch 26.1 IFSL', 'text' => 'Huge upgrade for our capstone research! Are we able to request remote SSH access to the GPU nodes?', 'time' => '1 day ago']
    ]
];

// 5. Student Submissions Queue (Admin Review)
$sample_submissions = [
    [
        'id' => 'sub-101',
        'ref_id' => 'NSBM-SUB-2026-8921',
        'title' => 'Faculty of Engineering Wins IEEE National Robotic Championship 2026',
        'student_name' => 'Kavindu Weerasinghe',
        'student_email' => 'kavindu.w@students.nsbm.ac.lk',
        'category' => 'Events',
        'details' => 'The undergraduate robotics team from NSBM Green University secured first place in the National Autonomous Navigation Challenge organized by IEEE Sri Lanka Section at BMICH.',
        'status' => 'pending',
        'submitted_date' => 'October 27, 2026',
        'cover_image' => 'images/hero_innovation_week.jpg'
    ],
    [
        'id' => 'sub-102',
        'ref_id' => 'NSBM-SUB-2026-7432',
        'title' => 'Rotaract Club of NSBM Launches Annual Green Drive at Pitipana Grounds',
        'student_name' => 'Nimasha Fernando',
        'student_email' => 'nimasha.f@students.nsbm.ac.lk',
        'category' => 'Campus Life',
        'details' => 'Over 300 endemic seedlings were planted across the perimeter boundary of the university grounds. Dean of Faculty joined the morning flag-off ceremony.',
        'status' => 'pending',
        'submitted_date' => 'October 26, 2026',
        'cover_image' => 'images/news_cricket_tournament.jpg'
    ],
    [
        'id' => 'sub-103',
        'ref_id' => 'NSBM-SUB-2026-6119',
        'title' => 'Computing Students Release Open-Source Sinhala Natural Language Toolkit',
        'student_name' => 'Sachithra Bandara',
        'student_email' => 'sachithra.b@students.nsbm.ac.lk',
        'category' => 'Academic',
        'details' => 'Batch 26.1 research group has published their tokenization and sentiment classification Python library on GitHub with benchmarks on local news corpora.',
        'status' => 'approved',
        'submitted_date' => 'October 24, 2026',
        'cover_image' => 'images/news_ai_research_lab.jpg'
    ]
];

// 6. University Categories
$campus_categories = [
    ['name' => 'Events', 'icon' => '🎪', 'description' => 'Symposiums, hackathons, and cultural festivities', 'count' => 4],
    ['name' => 'Academic', 'icon' => '🎓', 'description' => 'Research breakthroughs, timetables, and curriculum notices', 'count' => 3],
    ['name' => 'Announcements', 'icon' => '📢', 'description' => 'Official registry updates, directives, and deadlines', 'count' => 2],
    ['name' => 'Campus Life', 'icon' => '🌿', 'description' => 'Student clubs, community initiatives, and hostel updates', 'count' => 2],
    ['name' => 'Technology', 'icon' => '💻', 'description' => 'Computing labs, software projects, and tech workshops', 'count' => 3],
    ['name' => 'Sports', 'icon' => '🏏', 'description' => 'Inter-faculty fixtures, track & field, and recreation', 'count' => 1]
];

// 5. Helper Functions
function get_article_by_id($id, $articles) {
    foreach ($articles as $art) {
        if ($art['id'] === $id) {
            return $art;
        }
    }
    return $articles[0]; // Fallback to first article
}
