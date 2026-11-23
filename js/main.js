/**
 * NSBM NewsDesk — Campus Pulse
 * js/main.js
 * Core frontend logic, carousel, news cards, article reading modal, and interaction handlers.
 */

// Global state
let allNewsArticles = [];
let allPulseItems = [];
let activeDiscoveryCategory = 'for-you';
let dontMissIndex = 0;
let dontMissTimer = null;
let isDontMissPaused = false;

// Saved IDs
let userInterests = JSON.parse(localStorage.getItem('nsbm_news_interests') || '["Events", "Academic", "Technology", "Campus Life"]');
let savedBookmarks = new Set(JSON.parse(localStorage.getItem('nsbm_bookmarks') || '["art-01", "art-03"]'));
let likedArticles = new Set(JSON.parse(localStorage.getItem('nsbm_likes') || '[]'));
let pulseReminders = new Set(JSON.parse(localStorage.getItem('nsbm_reminders') || '[]'));

// Static default sample data (Sinhala names)
const DEFAULT_NEWS = [
  {
    id: 'art-01',
    title: 'NSBM Innovation Week 2026: Groundbreaking AI & Green Tech Projects Unveiled',
    summary: 'Over 80 student teams from Computing, Engineering, and Business faculties showcased sustainable tech solutions before industry leaders and venture partners.',
    category: 'Events',
    cover_image: './images/hero_innovation_week.jpg',
    author: 'NSBM NewsDesk Editorial',
    author_role: 'Campus Bureau',
    author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    date: 'October 18, 2026',
    read_time: '4 min read',
    is_important: true,
    views: 3420,
    likes: 248,
    tags: ['Innovation', 'Computing', 'Exhibition', 'Startups'],
    content: `NSBM Green University inaugurated its flagship annual tech symposium, Innovation Week 2026, yesterday at the University Auditorium and Central Technology Concourse.\n\nUnder the theme "Sustained Tech for Tomorrow's Cities," over 80 multidisciplinary teams gathered to demonstrate functional prototypes spanning autonomous agricultural drones, low-carbon smart campus microgrids, and multilingual health diagnostics systems.\n\nThe event was graced by prominent venture catalysts, industry CTOs from leading Sri Lankan and international tech enterprises, and distinguished university senate dignitaries.\n\n"What distinguishes NSBM Innovation Week this year is the direct translation from academic coursework into deployable, commercial-ready artifacts," said Prof. E. K. Chaminda, Dean of the Faculty of Computing. "Students are not merely writing papers; they are building tangible hardware and software platforms that address pressing societal challenges."\n\nKey Exhibition Highlights:\n• Project EcoPulse: An IoT sensor cluster monitoring campus rainwater catchment and solar storage in real-time.\n• BioSync AI: A computer vision diagnostic assistant developed by Batch 26.1 IFSL students tailored for regional healthcare clinics.\n• RoboSorter: An autonomous material sorting arm engineered by the Faculty of Engineering robotics division.\n\nIndustry judges awarded the Grand Champion trophy to Team Synapse from the Faculty of Computing for their edge-computing agricultural monitor. The top three winning teams were immediately offered incubation grants by NSBM Ventures and fast-track recruitment pathways.`
  },
  {
    id: 'art-02',
    title: 'New AI Research Lab Opens at NSBM Computing Complex',
    summary: 'State-of-the-art laboratory features 40 GPU-accelerated computing workstations, neural network testbeds, and collaborative research pods.',
    category: 'Academic',
    cover_image: './images/news_ai_research_lab.jpg',
    author: 'Devinda Ratnayake',
    author_role: 'Computing Faculty Editor',
    author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    date: 'October 16, 2026',
    read_time: '5 min read',
    is_important: true,
    views: 2150,
    likes: 182,
    tags: ['AI', 'Computing', 'Research', 'Lab'],
    content: `The Faculty of Computing has officially commissioned the new Artificial Intelligence & Machine Learning Research Laboratory located on the 4th Floor of the Computing Complex.\n\nEquipped with high-performance GPU clusters, modular collaborative pod seating, and dedicated high-speed research fiber, the lab aims to supercharge student research into Large Language Models, Computer Vision, and Predictive Analytics.\n\nUndergraduate researchers in Batch 26.1 IFSL will be the inaugural cohort granted dedicated compute credits for their final year development capstones and IEEE publication manuscripts.\n\n"We want our students solving complex, compute-intensive problems without encountering hardware bottlenecks," noted the Head of Department during the ribbon-cutting ceremony. "This facility bridges the gap between theoretical algorithms and industrial-scale deployment."`
  },
  {
    id: 'art-03',
    title: 'Career Fair 2026 Announced: Over 50 Tier-1 Tech & Enterprise Employers Visiting Campus',
    summary: 'The Career Guidance Unit confirms top software companies, consultancies, and financial enterprises will conduct on-site interviews on October 28.',
    category: 'Events',
    cover_image: './images/news_career_fair.jpg',
    author: 'Career Guidance Unit',
    author_role: 'Student Affairs',
    author_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    date: 'October 15, 2026',
    read_time: '3 min read',
    is_important: true,
    views: 2940,
    likes: 210,
    tags: ['Careers', 'Internships', 'Jobs', 'Recruitment'],
    content: `The NSBM Career Guidance Unit (CGU) has finalized arrangements for the flagship Annual Career Fair 2026, set to take place across the Main Auditorium and Student Concourse.\n\nParticipating industry partners include top-tier software exporters, regional tech unicorns, telecommunications leaders, and multinational accounting firms.\n\nFinal-year undergraduates and pre-final interns from Computing, Business, and Engineering disciplines are invited to register early. CGU will conduct preliminary CV clinics and mock interview bootcamps across the coming two weeks to ensure students present their portfolios effectively.`
  },
  {
    id: 'art-04',
    title: 'Semester Examination Timetable Released for Batch 26.1 IFSL',
    summary: 'The Examination Division has published the formal schedule and hall allocations for the upcoming end-semester assessments.',
    category: 'Announcements',
    cover_image: './images/hero_innovation_week.jpg',
    author: 'Examination Directorate',
    author_role: 'Academic Registry',
    author_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    date: 'October 14, 2026',
    read_time: '2 min read',
    is_important: true,
    views: 4120,
    likes: 95,
    tags: ['Exams', 'Academic', 'Timetable', 'Batch 26.1'],
    content: `The Examination Division has officially published the draft and final timetables for the upcoming end-semester examinations across Computing, Business, and Engineering faculties.\n\nBatch 26.1 IFSL students can download their personalized seat allocations and examination room maps directly from the student intranet portal.\n\nImportant Guidelines:\n1. Students must carry valid NSBM Student ID cards and Examination Admission slips to each hall.\n2. Electronic smart watches and unauthorized devices are strictly prohibited inside exam halls.\n3. Any clash inquiries must be lodged with the respective faculty coordinator within 5 working days.`
  },
  {
    id: 'art-05',
    title: 'NSBM Green University Cricket Team Advances to Inter-University Finals',
    summary: 'A thrilling 4-wicket victory over University of Moratuwa propels the Green Lions into the championship showdown this weekend.',
    category: 'Campus Life',
    cover_image: './images/news_cricket_tournament.jpg',
    author: 'Sports Council Lead',
    author_role: 'Athletics Department',
    author_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    date: 'October 12, 2026',
    read_time: '3 min read',
    is_important: false,
    views: 1890,
    likes: 312,
    tags: ['Sports', 'Cricket', 'Championship', 'Lions'],
    content: `In a nail-biting semifinal clash that went down to the final over, the NSBM Green Lions cricket team secured their berth in the National Inter-University Championship Finals.\n\nChasing a formidable target of 264 runs set by the University of Moratuwa, captain Dinuka Perera anchored the innings with an unbeaten 88 runs off 72 deliveries. Support from all-rounder Kaveen Jayasuriya in the death overs sealed the dramatic win with three balls to spare.\n\nThe grand final is scheduled for this coming Saturday at 10:00 AM at the NSBM Grounds, with complimentary shuttle transport provided from all key student hostel blocks.`
  },
  {
    id: 'art-06',
    title: 'Technology Society Announces Hands-On Generative AI Bootcamp',
    summary: 'A weekend workshop series exploring LLM prompting, vector search embeddings, and modern web agent architectures.',
    category: 'Academic',
    cover_image: './images/news_ai_research_lab.jpg',
    author: 'TechSoc President',
    author_role: 'Computing Society',
    author_avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    date: 'October 10, 2026',
    read_time: '3 min read',
    is_important: false,
    views: 1420,
    likes: 165,
    tags: ['TechSoc', 'Workshop', 'AI', 'Coding'],
    content: `The NSBM Computing & Technology Society (TechSoc) is launching a comprehensive two-day technical workshop titled "Architecting Autonomous Web Agents & Generative Systems."\n\nLed by alumni software architects currently working at global tech consultancies, the bootcamp focuses on practical, project-based engineering. Participants will build end-to-end applications utilizing vector databases, agent workflows, and real-time frontend streaming interfaces.\n\nSessions will be conducted in Lab C301 with cloud compute environments sponsored by industry partners. Limited to 120 seats on a first-come, first-served basis.`
  },
  {
    id: 'art-07',
    title: 'Green Campus Eco-Initiative: Solar Shading Pavilions & Electric Shuttles',
    summary: 'NSBM marks another sustainability milestone with 300 kW additional rooftop solar arrays and zero-emission transit shuttles.',
    category: 'Campus Life',
    cover_image: './images/hero_innovation_week.jpg',
    author: 'Green Council',
    author_role: 'Sustainability Cell',
    author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    date: 'October 8, 2026',
    read_time: '3 min read',
    is_important: false,
    views: 1120,
    likes: 142,
    tags: ['GreenCampus', 'Eco', 'Solar', 'CampusLife'],
    content: `Staying true to its identity as South Asia's premier Green University Town, NSBM has concluded Phase 4 of its campus decarbonization roadmap.\n\nThree new solar-canopied pedestrian walkways connecting the Student Recreation Hub with the Faculty of Computing have been completed, generating clean energy while offering shade against tropical rains.\n\nAdditionally, two new electric 14-seater shuttles have joined the internal campus fleet, operating continuously during peak class transition intervals.`
  }
];

const DEFAULT_PULSE = [
  {
    id: 'pulse-01',
    title: 'Inter-University Cricket Tournament: Semifinal Day 2',
    description: 'NSBM Green Lions vs. Moratuwa. High energy match with big-screen broadcasting at student pavilion.',
    location: 'NSBM Sports Ground & Pavilion',
    date: 'Today',
    start_time: '10:00 AM',
    end_time: '4:00 PM',
    status: 'happening_now',
    category: 'Sports',
    organizer: 'NSBM Sports Council',
    attendees: 420
  },
  {
    id: 'pulse-02',
    title: 'Tech Society Workshop: Introduction to Generative AI',
    description: 'Hands-on coding session exploring LLMs, agent architectures, and vector pipelines.',
    location: 'Innovation Lab C301',
    date: 'Tomorrow',
    start_time: '2:00 PM',
    end_time: '5:30 PM',
    status: 'upcoming',
    category: 'Technology',
    organizer: 'NSBM TechSoc',
    attendees: 110
  },
  {
    id: 'pulse-03',
    title: 'Career Readiness Masterclass: Resume Crafting & Tech Interviews',
    description: 'Direct feedback session with alumni recruiters from senior software enterprises in Colombo.',
    location: 'Computing Complex Mini-Theatre',
    date: 'Oct 24, 2026',
    start_time: '3:30 PM',
    end_time: '5:00 PM',
    status: 'upcoming',
    category: 'Academic',
    organizer: 'Career Guidance Unit',
    attendees: 85
  },
  {
    id: 'pulse-04',
    title: 'Freshers Orientation & Campus Life Welcome Festival',
    description: 'Comprehensive campus orientation, society recruitment stalls, and musical showcase.',
    location: 'Main University Auditorium & Lawn',
    date: 'Yesterday',
    start_time: '9:00 AM',
    end_time: '6:00 PM',
    status: 'completed',
    category: 'Campus Life',
    organizer: 'Student Welfare Directorate',
    attendees: 1250
  }
];

const DONT_MISS_ITEMS = [
  {
    id: 'dm-01',
    title: 'Database Systems Assignment: Normalization & SQL Queries',
    description: 'Due tonight at 11:59 PM via VLE. SQL schema script and normalization report required.',
    dueLabel: 'Due Today, 11:59 PM'
  },
  {
    id: 'dm-02',
    title: 'Annual Career Fair 2026 — Company Registrations Close',
    description: 'Upload verified resumes and reserve interview slots before tomorrow 5:00 PM.',
    dueLabel: 'Tomorrow at 5:00 PM'
  },
  {
    id: 'dm-03',
    title: 'Web & Mobile Application Development (Batch 26.1) Progress Review',
    description: 'Topic 1 NSBM NewsDesk architecture presentation and group progress demo.',
    dueLabel: 'In 3 Days (Friday 9:00 AM)'
  },
  {
    id: 'dm-04',
    title: 'Semester 2 Elective & Specialization Module Registration',
    description: 'Select elective modules for Cloud Architecture or Advanced Data Science.',
    dueLabel: 'Closes October 28'
  }
];

// In-memory comments store
const ARTICLE_COMMENTS = {
  'art-01': [
    { name: 'Kavindu Senaratne', role: 'Batch 25.2', text: 'The robotics arm demonstration at the Central Concourse was super impressive! Great to see commercial venture mentors visiting campus.', time: '2 hours ago' },
    { name: 'Rashmi Perera', role: 'Batch 26.1 IFSL', text: 'Our team will be presenting tomorrow morning at Pod 14. Come check out our predictive agricultural sensor!', time: '4 hours ago' }
  ],
  'art-02': [
    { name: 'Sandun Jayasuriya', role: 'Batch 26.1 IFSL', text: 'Huge upgrade for our capstone research! Are we able to request remote SSH access to the GPU nodes?', time: '1 day ago' }
  ]
};

// Document initialization for homepage
document.addEventListener('DOMContentLoaded', () => {
  loadInitialData();
  setupDontMissCarousel();
  setupDiscoveryTabs();
});

/**
 * Load news and pulse from PHP backend via Fetch API
 */
async function loadInitialData() {
  allNewsArticles = DEFAULT_NEWS;
  allPulseItems = DEFAULT_PULSE;

  try {
    const res = await fetch('./backend/news.php');
    if (res.ok) {
      const data = await res.json();
      if (data && data.articles && data.articles.length > 0) {
        allNewsArticles = data.articles;
      }
    }
  } catch (e) {}

  try {
    const pulseRes = await fetch('./backend/pulse.php');
    if (pulseRes.ok) {
      const pulseData = await pulseRes.json();
      if (pulseData && pulseData.items && pulseData.items.length > 0) {
        allPulseItems = pulseData.items;
      }
    }
  } catch (e) {}

  renderImportantNews();
  renderCampusPulsePreview();
  renderDontMissBanner();
  renderNewsDiscovery(activeDiscoveryCategory);
}

/**
 * Render Important News (Left Box on Home)
 */
function renderImportantNews() {
  const container = document.getElementById('importantNewsContent');
  if (!container) return;

  const importantList = allNewsArticles.filter((a) => a.is_important);
  const lead = importantList[0] || allNewsArticles[0];
  const others = importantList.slice(1, 3);

  container.innerHTML = `
    <!-- Lead Priority Preview Card -->
    <div class="important-lead-card" onclick="openArticleModal('${lead.id}')">
      <img src="${lead.cover_image || lead.coverImage || './images/hero_innovation_week.jpg'}" alt="${lead.title}" class="important-thumb" onerror="this.src='./images/hero_innovation_week.jpg'" />
      <div class="important-lead-content">
        <div>
          <div class="meta-unboxed">
            <span class="meta-kicker">${lead.category}</span>
            <span>·</span>
            <span>${lead.date}</span>
          </div>
          <h4 class="important-headline">${lead.title}</h4>
          <p class="important-desc">${lead.summary}</p>
        </div>
        <div class="read-more-action">
          <span>Read story</span>
          <span>→</span>
        </div>
      </div>
    </div>

    <!-- Secondary Priority Items -->
    <div class="important-secondary-list">
      ${others.map(art => `
        <div class="important-sub-card" onclick="openArticleModal('${art.id}')">
          <div class="meta-unboxed">
            <span class="meta-kicker">${art.category}</span>
            <span>·</span>
            <span>${art.date}</span>
            <span>·</span>
            <span>${art.read_time || art.readTime || '3 min read'}</span>
          </div>
          <div class="headline-mini">${art.title}</div>
          <div class="desc-mini">${art.summary}</div>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * Render Campus Pulse Preview (Right Box on Home)
 */
function renderCampusPulsePreview() {
  const container = document.getElementById('campusPulsePreviewContent');
  if (!container) return;

  const previewItems = allPulseItems.slice(0, 3);

  container.innerHTML = previewItems.map(item => {
    let pillClass = 'now';
    let pillText = 'HAPPENING NOW';
    if (item.status === 'upcoming') {
      pillClass = 'upcoming';
      pillText = 'UPCOMING';
    } else if (item.status === 'completed') {
      pillClass = 'completed';
      pillText = 'COMPLETED';
    }

    return `
      <div class="pulse-item-card" onclick="window.location.href='./pulse.html'">
        <div class="pulse-card-top">
          <span class="status-pill ${pillClass}">
            <span class="status-dot"></span>
            ${pillText}
          </span>
          <span class="pulse-card-date">${item.date}</span>
        </div>
        <div class="pulse-card-title">${item.title}</div>
        <div class="pulse-card-meta">
          <span>📍 ${item.location}</span>
          <span>⏰ ${item.start_time || item.startTime} – ${item.end_time || item.endTime}</span>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Setup and render Don't Miss Carousel
 */
function setupDontMissCarousel() {
  const banner = document.getElementById('dontMissBanner');
  if (!banner) return;

  banner.addEventListener('mouseenter', () => { isDontMissPaused = true; });
  banner.addEventListener('mouseleave', () => { isDontMissPaused = false; });

  if (dontMissTimer) clearInterval(dontMissTimer);
  dontMissTimer = setInterval(() => {
    if (!isDontMissPaused) {
      nextDontMiss();
    }
  }, 5500);

  banner.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextDontMiss();
    if (e.key === 'ArrowLeft') prevDontMiss();
  });
}

function renderDontMissBanner() {
  const item = DONT_MISS_ITEMS[dontMissIndex];
  const middleEl = document.getElementById('dontMissMiddle');
  const tagEl = document.getElementById('dontMissUrgencyTag');
  const indicatorsEl = document.getElementById('dontMissIndicators');

  if (!item || !middleEl) return;

  middleEl.style.opacity = '0';
  middleEl.style.transform = 'translateX(4px)';

  setTimeout(() => {
    middleEl.innerHTML = `
      <div class="dont-miss-headline">${item.title}</div>
      <div class="dont-miss-desc">${item.description}</div>
    `;
    if (tagEl) {
      tagEl.textContent = item.dueLabel;
    }
    middleEl.style.opacity = '1';
    middleEl.style.transform = 'translateX(0)';
  }, 180);

  if (indicatorsEl) {
    indicatorsEl.innerHTML = DONT_MISS_ITEMS.map((_, idx) => `
      <span class="slide-dot ${idx === dontMissIndex ? 'active' : ''}" onclick="goToDontMiss(${idx})" aria-label="Go to slide ${idx + 1}"></span>
    `).join('');
  }
}

function nextDontMiss() {
  dontMissIndex = (dontMissIndex + 1) % DONT_MISS_ITEMS.length;
  renderDontMissBanner();
}

function prevDontMiss() {
  dontMissIndex = (dontMissIndex - 1 + DONT_MISS_ITEMS.length) % DONT_MISS_ITEMS.length;
  renderDontMissBanner();
}

function goToDontMiss(index) {
  dontMissIndex = index;
  renderDontMissBanner();
}

/**
 * News Discovery Category Tabs
 */
function setupDiscoveryTabs() {
  const tabButtons = document.querySelectorAll('.cat-tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeDiscoveryCategory = btn.getAttribute('data-cat');
      renderNewsDiscovery(activeDiscoveryCategory);
    });
  });
}

function renderNewsDiscovery(category) {
  const container = document.getElementById('discoveryCardsGrid');
  const forYouPrompt = document.getElementById('forYouPromptBar');
  if (!container) return;

  let filtered = [];

  if (category === 'for-you') {
    if (forYouPrompt) {
      forYouPrompt.style.display = 'flex';
      const interestsText = document.getElementById('userInterestsText');
      if (interestsText) {
        interestsText.textContent = userInterests.length > 0 ? userInterests.join(', ') : 'Default feed';
      }
    }
    filtered = allNewsArticles.filter(art =>
      userInterests.some(interest =>
        art.category.toLowerCase() === interest.toLowerCase() ||
        (Array.isArray(art.tags) && art.tags.some(t => t.toLowerCase() === interest.toLowerCase()))
      )
    );
    if (filtered.length === 0) filtered = allNewsArticles.slice(0, 4);
  } else {
    if (forYouPrompt) forYouPrompt.style.display = 'none';
    if (category === 'all-news') {
      filtered = allNewsArticles;
    } else if (category === 'events') {
      filtered = allNewsArticles.filter(a => a.category.toLowerCase() === 'events');
    } else if (category === 'academic') {
      filtered = allNewsArticles.filter(a => a.category.toLowerCase() === 'academic');
    } else if (category === 'announcements') {
      filtered = allNewsArticles.filter(a => a.category.toLowerCase() === 'announcements');
    } else if (category === 'campus-life') {
      filtered = allNewsArticles.filter(a => a.category.toLowerCase() === 'campus life');
    }
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📰</div>
        <h3>No stories found</h3>
        <p>No stories found for this category. Check back soon or select "All News".</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(art => renderNewsCardHTML(art)).join('');
}

function renderNewsCardHTML(art) {
  const isSaved = savedBookmarks.has(art.id);
  const isLiked = likedArticles.has(art.id);
  const likeCount = (art.likes || 0) + (isLiked ? 1 : 0);
  const coverImg = art.cover_image || art.coverImage || './images/hero_innovation_week.jpg';
  const authorAvatar = art.author_avatar || art.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150';

  return `
    <article class="news-card" onclick="openArticleModal('${art.id}')">
      <div>
        <div class="news-card-thumb-wrap">
          <img src="${coverImg}" alt="${art.title}" class="news-card-thumb" onerror="this.src='./images/hero_innovation_week.jpg'" />
        </div>
        <div class="news-card-body">
          <div class="meta-unboxed">
            <span class="meta-kicker">${art.category}</span>
            <span>·</span>
            <span>${art.date}</span>
            <span>·</span>
            <span>${art.read_time || art.readTime || '3 min read'}</span>
          </div>
          <h3 class="news-card-headline">${art.title}</h3>
          <p class="news-card-summary">${art.summary}</p>
        </div>
      </div>
      <div class="news-card-footer" onclick="event.stopPropagation()">
        <div class="news-card-author">
          <img src="${authorAvatar}" alt="${art.author}" class="author-avatar" />
          <span>${art.author}</span>
        </div>
        <div class="card-actions-mini">
          <button class="like-btn" onclick="toggleLike('${art.id}', event)" title="Like article">
            <span>❤️</span>
            <span id="like-count-${art.id}">${likeCount}</span>
          </button>
          <button class="bookmark-btn ${isSaved ? 'saved' : ''}" onclick="toggleBookmark('${art.id}', event)" title="${isSaved ? 'Remove bookmark' : 'Save story'}">
            <span>🔖</span>
            <span id="bookmark-label-${art.id}">${isSaved ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>
    </article>
  `;
}

/**
 * Article Modal
 */
function openArticleModal(articleId) {
  const article = allNewsArticles.find(a => a.id === articleId) || allNewsArticles[0];
  const modal = document.getElementById('articleModal');
  const bodyEl = document.getElementById('articleModalContent');
  if (!modal || !bodyEl) return;

  const comments = ARTICLE_COMMENTS[article.id] || [];
  const coverImg = article.cover_image || article.coverImage || './images/hero_innovation_week.jpg';
  const authorAvatar = article.author_avatar || article.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150';

  bodyEl.innerHTML = `
    <div class="meta-unboxed" style="font-size: 0.8rem; margin-bottom: 8px;">
      <span class="meta-kicker">${article.category}</span>
      <span>·</span>
      <span>${article.date}</span>
      <span>·</span>
      <span>${article.read_time || article.readTime || '3 min read'}</span>
    </div>

    <h1 class="article-full-headline">${article.title}</h1>

    <div style="display: flex; justify-content: space-between; align-items: center; margin: 16px 0; padding: 12px 0; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <img src="${authorAvatar}" alt="${article.author}" style="width: 38px; height: 38px; border-radius: 50%; object-fit: cover;" />
        <div>
          <div style="font-size: 0.85rem; font-weight: 750; color: #0f172a;">${article.author}</div>
          <div style="font-size: 0.72rem; color: #64748b;">${article.author_role || article.authorRole || 'Campus Reporter'} · Verified Faculty Desk</div>
        </div>
      </div>
      <div style="display: flex; gap: 8px;">
        <button class="pulse-reminder-btn" onclick="toggleBookmark('${article.id}')">
          <span>🔖</span>
          <span>${savedBookmarks.has(article.id) ? 'Saved' : 'Save Story'}</span>
        </button>
      </div>
    </div>

    <img src="${coverImg}" alt="${article.title}" class="article-hero-img" onerror="this.src='./images/hero_innovation_week.jpg'" />

    <div class="article-prose">
      ${(article.content || article.summary || '').split('\n\n').map((para, i) => {
        if (i === 1) {
          return `
            <p>${para}</p>
            <div class="article-pullquote">
              "What distinguishes NSBM Green University is the direct translation from academic coursework into deployable, commercial-ready artifacts."
            </div>
          `;
        }
        return `<p>${para}</p>`;
      }).join('')}

      <div class="student-infobox">
        <strong>Important Notice for Students</strong>
        Undergraduate students wishing to engage with these facilities or submit capstone proposals should consult the Faculty of Computing Registry or register via the MIS portal.
      </div>
    </div>

    <!-- Interactive Comments Section -->
    <div style="margin-top: 36px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
      <h3 style="font-size: 1.1rem; font-weight: 800; color: #0f172a; margin-bottom: 14px;">
        Student Discussion (${comments.length})
      </h3>

      <div style="display: flex; gap: 10px; margin-bottom: 20px;">
        <input type="text" id="newCommentInput" placeholder="Share your perspective on this campus update..." style="flex: 1; padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.85rem; outline: none;" />
        <button class="btn-submit-primary" style="padding: 10px 18px;" onclick="postComment('${article.id}')">Post</button>
      </div>

      <div id="commentsListContainer" style="display: flex; flex-direction: column; gap: 12px;">
        ${comments.map(c => `
          <div style="background: #f8fafc; border: 1px solid #f1f5f9; padding: 12px 14px; border-radius: 10px;">
            <div style="display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 700; color: #0f172a; margin-bottom: 4px;">
              <span>${c.name} <span style="font-weight: 400; color: #64748b;">(${c.role})</span></span>
              <span style="color: #94a3b8; font-weight: 400;">${c.time || 'Recent'}</span>
            </div>
            <p style="font-size: 0.82rem; color: #334155; line-height: 1.5;">${c.text}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeArticleModal() {
  const modal = document.getElementById('articleModal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = 'auto';
}

function postComment(articleId) {
  const input = document.getElementById('newCommentInput');
  if (!input || !input.value.trim()) return;

  if (!ARTICLE_COMMENTS[articleId]) {
    ARTICLE_COMMENTS[articleId] = [];
  }

  const studentName = window.currentUser ? window.currentUser.name : 'Kasun Perera';
  const studentRole = window.currentUser ? (window.currentUser.cohort || 'Student') : 'Batch 26.1 IFSL';

  ARTICLE_COMMENTS[articleId].unshift({
    name: studentName,
    role: studentRole,
    text: input.value.trim(),
    time: 'Just now'
  });

  // Call PHP backend
  fetch('./backend/news.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'comment', article_id: articleId, text: input.value.trim() })
  }).catch(() => {});

  showToast('Comment posted successfully!');
  openArticleModal(articleId);
}

/**
 * Interactions: Bookmark & Like
 */
async function toggleBookmark(articleId, event) {
  if (event) event.stopPropagation();

  if (savedBookmarks.has(articleId)) {
    savedBookmarks.delete(articleId);
    showToast('Removed from saved bookmarks.');
  } else {
    savedBookmarks.add(articleId);
    showToast('Story bookmarked to your saved reading list!');
  }

  localStorage.setItem('nsbm_bookmarks', JSON.stringify([...savedBookmarks]));

  // Post to backend
  fetch('./backend/bookmarks.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ article_id: articleId })
  }).catch(() => {});

  if (document.getElementById('discoveryCardsGrid')) {
    renderNewsDiscovery(activeDiscoveryCategory);
  }
}

async function toggleLike(articleId, event) {
  if (event) event.stopPropagation();

  if (likedArticles.has(articleId)) {
    likedArticles.delete(articleId);
  } else {
    likedArticles.add(articleId);
    showToast('Liked story!');
  }

  localStorage.setItem('nsbm_likes', JSON.stringify([...likedArticles]));

  fetch('./backend/news.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'like', article_id: articleId })
  }).catch(() => {});

  if (document.getElementById('discoveryCardsGrid')) {
    renderNewsDiscovery(activeDiscoveryCategory);
  }
}

/**
 * Interests Personalization Modal
 */
function openInterestsModal() {
  const modal = document.getElementById('interestsModal');
  const listEl = document.getElementById('interestsChipsContainer');
  if (!modal || !listEl) return;

  const allInterests = ['Events', 'Academic', 'Announcements', 'Campus Life', 'Technology', 'Sports'];

  listEl.innerHTML = allInterests.map(interest => {
    const isSelected = userInterests.includes(interest);
    return `
      <button class="cat-tab-btn ${isSelected ? 'active' : ''}" style="margin: 4px;" onclick="toggleInterestChip(this, '${interest}')">
        <span>${isSelected ? '✓ ' : '+ '}</span>
        <span>${interest}</span>
      </button>
    `;
  }).join('');

  modal.classList.add('open');
}

function closeInterestsModal() {
  const modal = document.getElementById('interestsModal');
  if (modal) modal.classList.remove('open');
}

function toggleInterestChip(btn, interest) {
  if (userInterests.includes(interest)) {
    userInterests = userInterests.filter(i => i !== interest);
    btn.classList.remove('active');
    btn.querySelector('span').textContent = '+ ';
  } else {
    userInterests.push(interest);
    btn.classList.add('active');
    btn.querySelector('span').textContent = '✓ ';
  }
}

function saveInterests() {
  if (userInterests.length === 0) {
    userInterests = ['Events', 'Academic'];
  }
  localStorage.setItem('nsbm_news_interests', JSON.stringify(userInterests));
  closeInterestsModal();
  showToast('Personalized feed preferences updated!');
  renderNewsDiscovery(activeDiscoveryCategory);
}

/**
 * Global Toast Notification Utility
 */
function showToast(message) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-item';
  toast.innerHTML = `
    <span>✓</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// Expose globally
window.openArticleModal = openArticleModal;
window.closeArticleModal = closeArticleModal;
window.toggleBookmark = toggleBookmark;
window.toggleLike = toggleLike;
window.showToast = showToast;
window.openInterestsModal = openInterestsModal;
window.closeInterestsModal = closeInterestsModal;
window.saveInterests = saveInterests;
window.toggleInterestChip = toggleInterestChip;
window.nextDontMiss = nextDontMiss;
window.prevDontMiss = prevDontMiss;
window.goToDontMiss = goToDontMiss;
window.postComment = postComment;
