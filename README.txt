================================================================================
NSBM NewsDesk — Campus Pulse
University News & Student Information Platform
NSBM Green University, Pitipana, Homagama, Sri Lanka
================================================================================

Faculty of Computing
Module: Web and Mobile Application Development (Batch 26.1 IFSL)
Architecture: Clean HTML5, CSS3, Vanilla JavaScript, PHP & MySQL

--------------------------------------------------------------------------------
1. PROJECT OVERVIEW
--------------------------------------------------------------------------------
NSBM NewsDesk — Campus Pulse is a modern university news, events radar, and student
information platform restructured into a clean, decoupled traditional web stack:
  • HTML5 for frontend pages
  • CSS3 for modular styling
  • Vanilla JavaScript for client functionality & Fetch API communication
  • PHP for backend processing, sessions, and role authorization
  • MySQL for relational database management

--------------------------------------------------------------------------------
2. DIRECTORY STRUCTURE
--------------------------------------------------------------------------------
/
├── index.html               # Main Student Homepage
├── news.html                # Dedicated Latest News hub with search & filters
├── pulse.html               # Dedicated Campus Pulse real-time radar
├── submit.html              # Campus Reporter story submission portal
├── login.html               # User authentication & role selection
├── register.html            # Student registration portal (strictly USER role)
├── profile.html             # Student Profile & personalized topic preferences
├── bookmarks.html           # Saved Bookmarks reading list
├── data.php                 # Sample data used when the database is empty
├── admin/
│   └── dashboard.html       # Staff Administration Console (Tier 1 ADMIN only)
├── css/
│   ├── style.css            # Core design system, variables, cards, modals
│   ├── header.css           # Navigation bar, profile badge, and dropdown
│   ├── footer.css           # Academic university footer
│   └── admin.css            # Staff console tables, metrics, and modals
├── js/
│   ├── main.js              # Global utilities, carousel, cards, modals, toasts
│   ├── auth.js              # Role-aware authentication & profile dropdown
│   ├── profile.js           # Student profile controller & topic preferences
│   ├── admin.js             # Staff admin dashboard controller
│   ├── news.js              # Latest news controller with live search & sort
│   └── pulse.js             # Campus pulse radar controller & reminders
├── backend/
│   ├── config.php           # DB credentials, sessions, and JSON response utility
│   ├── db.php               # PDO connection with prepared statement security
│   ├── auth.php             # Session validation endpoint
│   ├── login.php            # Login processor with password verification
│   ├── register.php         # Registration processor (enforces USER role)
│   ├── logout.php           # Session destruction & cookie cleanup
│   ├── news.php             # News listing, filters, likes, and comments
│   ├── bookmarks.php        # User bookmark retrieval and toggling
│   ├── pulse.php            # Pulse activities and reminders
│   ├── submit.php           # Story submissions with tracking reference code
│   └── admin.php            # Strict ADMIN operations (verify role, approve, publish)
├── database/
│   └── schema.sql           # Complete MySQL database schema & initial seed data
└── images/                  # High-resolution campus photographs for NSBM

--------------------------------------------------------------------------------
3. AUTHENTICATION & USER ROLES
--------------------------------------------------------------------------------
The system strictly enforces two account roles:
  1. USER  - Normal student account. Access to feeds, profile, bookmarks, comments.
  2. ADMIN - Staff administrator. Access to all student features PLUS the Staff Admin
             Dashboard.

DEFAULT TEST ACCOUNTS:
  • Administrator:
      Email:    admin@nsbm.ac.lk
      Password: Admin@123
      Name:     Dr. Rasika Silva
      Role:     ADMIN

  • Student User:
      Email:    kasun@students.nsbm.ac.lk
      Password: User@123
      Name:     Kasun Perera
      Role:     USER

ADMIN DASHBOARD ACCESS:
  Per requirements, the old "Admin Console" button in the top navigation has been
  removed from all public pages.
  Administrators access the Admin Dashboard EXCLUSIVELY via the Profile Dropdown:
  1. Click the profile icon in the top right.
  2. The dropdown displays account information and an "Admin Dashboard" option.
  3. Clicking "Admin Dashboard" opens admin/dashboard.html.
  Normal USER accounts and unauthenticated guests NEVER see the Admin Dashboard
  link and are strictly blocked on the backend if attempting direct access.

--------------------------------------------------------------------------------
4. DATABASE SETUP (phpMyAdmin / MySQL)
--------------------------------------------------------------------------------
1. Open phpMyAdmin or your MySQL client.
2. Create a new database named `nsbm_newsdesk` (or import directly):
     CREATE DATABASE `nsbm_newsdesk` DEFAULT CHARACTER SET utf8mb4;
3. Import `database/schema.sql`.
4. Open `backend/config.php` and verify your DB credentials:
     DB_HOST: localhost
     DB_PORT: 3306
     DB_NAME: nsbm_newsdesk
     DB_USER: root
     DB_PASS: (your password or empty for default XAMPP)

--------------------------------------------------------------------------------
5. RUNNING LOCALLY & DEPLOYMENT
--------------------------------------------------------------------------------
XAMPP / WAMP:
1. Copy this folder into `C:\xampp\htdocs\nsbm-newsdesk`.
2. Start Apache and MySQL in the XAMPP Control Panel.
3. Open browser: http://localhost/nsbm-newsdesk/index.html

cPanel / Apache / Nginx Shared Hosting:
1. Extract `nsbm_newsdesk_campus_pulse.zip` into `public_html`.
2. Import `database/schema.sql` into your cPanel MySQL Database.
3. Update `backend/config.php` with your database name, username, and password.
4. Visit your website domain.

================================================================================
© 2026 NSBM Green University Town · Faculty of Computing (Batch 26.1 IFSL)
================================================================================
