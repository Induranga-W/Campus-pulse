/**
 * NSBM NewsDesk — Campus Pulse
 * js/auth.js
 * Client authentication controller, session verification, and role-aware profile dropdown.
 */

window.currentUser = null;
const AUTH_API_BASE = window.location.pathname.includes('/admin/') ? '../backend/' : './backend/';

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initAuth();
  setupProfileDropdownToggle();
});

/**
 * Verify session with PHP backend and initialize user state
 */
async function initAuth() {
  try {
    const res = await fetch(`${AUTH_API_BASE}auth.php`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      credentials: 'same-origin'
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.authenticated && data.user) {
        window.currentUser = data.user;
        localStorage.setItem('nsbm_session_user', JSON.stringify(data.user));
      } else {
        window.currentUser = null;
        localStorage.removeItem('nsbm_session_user');
      }
    } else {
      window.currentUser = null;
      localStorage.removeItem('nsbm_session_user');
    }
  } catch (err) {
    window.currentUser = null;
    localStorage.removeItem('nsbm_session_user');
  }

  renderUserProfileBadge();
  renderProfileDropdown();
}

/**
 * Update the user profile pill in the top navigation bar
 */
function renderUserProfileBadge() {
  const badgeNameEl = document.getElementById('navUserBadgeName');
  const badgeAvatarEl = document.getElementById('navUserBadgeAvatar');
  const greetingNameEl = document.getElementById('greetingUserName');

  if (window.currentUser) {
    if (badgeNameEl) badgeNameEl.textContent = window.currentUser.name;
    if (badgeAvatarEl) badgeAvatarEl.src = window.currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150';
    if (greetingNameEl) greetingNameEl.textContent = window.currentUser.name.split(' ')[0];
  } else {
    if (badgeNameEl) badgeNameEl.textContent = 'Sign In';
  }
}

/**
 * Render the account dropdown strictly respecting roles (USER vs ADMIN)
 */
function renderProfileDropdown() {
  const dropdown = document.getElementById('profileDropdownMenu');
  if (!dropdown) return;

  const user = window.currentUser;
  const isInsideAdminDir = window.location.pathname.includes('/admin/');
  const rootPrefix = isInsideAdminDir ? '../' : './';

  if (!user) {
    // Guest dropdown
    dropdown.innerHTML = `
      <div class="dropdown-user-header">
        <div class="dropdown-user-info">
          <div class="dropdown-user-name">Guest Student</div>
          <div class="dropdown-user-email">Please log in to save bookmarks</div>
        </div>
      </div>
      <ul class="dropdown-menu-list">
        <li>
          <a href="${rootPrefix}login.html" class="dropdown-item-link">
            <span class="item-icon">🔑</span>
            <span>Log In</span>
          </a>
        </li>
        <li>
          <a href="${rootPrefix}register.html" class="dropdown-item-link">
            <span class="item-icon">📝</span>
            <span>Create Account</span>
          </a>
        </li>
      </ul>
    `;
    return;
  }

  const isAdmin = user.role === 'ADMIN';

  dropdown.innerHTML = `
    <!-- User Account Header: Avatar, Name, Email, Role -->
    <div class="dropdown-user-header">
      <img src="${user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}" alt="${user.name}" class="dropdown-avatar-lg" />
      <div class="dropdown-user-info">
        <div class="dropdown-user-name">${user.name}</div>
        <div class="dropdown-user-email">${user.email}</div>
        <span class="dropdown-role-badge ${isAdmin ? 'admin' : 'user'}">
          ${isAdmin ? '🛡️ ADMINISTRATOR' : '🎓 STUDENT USER'}
        </span>
      </div>
    </div>

    <!-- Navigation Options -->
    <ul class="dropdown-menu-list">
      <li>
        <a href="${rootPrefix}profile.html" class="dropdown-item-link">
          <span class="item-icon">👤</span>
          <span>My Profile</span>
        </a>
      </li>
      <li>
        <a href="${rootPrefix}bookmarks.html" class="dropdown-item-link">
          <span class="item-icon">🔖</span>
          <span>My Bookmarks</span>
        </a>
      </li>

      <!-- STRICT REQUIREMENT: Admin Dashboard option ONLY displayed for authenticated ADMIN role -->
      ${isAdmin ? `
        <li>
          <a href="${rootPrefix}admin/dashboard.html" class="dropdown-item-link admin-dashboard-link">
            <span class="item-icon">⚡</span>
            <span>Admin Dashboard</span>
          </a>
        </li>
      ` : ''}

      <li class="dropdown-divider"></li>

      <li>
        <a href="javascript:void(0)" onclick="handleLogout()" class="dropdown-item-link logout-link">
          <span class="item-icon">🚪</span>
          <span>Logout</span>
        </a>
      </li>
    </ul>
  `;
}

/**
 * Setup profile dropdown toggle and click-outside handler
 */
function setupProfileDropdownToggle() {
  const badge = document.getElementById('userProfileBadgeBtn');
  const dropdown = document.getElementById('profileDropdownMenu');

  if (!badge || !dropdown) return;

  badge.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dropdown.classList.contains('open');
    if (isOpen) {
      dropdown.classList.remove('open');
      badge.classList.remove('active');
    } else {
      renderProfileDropdown();
      dropdown.classList.add('open');
      badge.classList.add('active');
    }
  });

  // Close when clicking anywhere outside
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && !badge.contains(e.target)) {
      dropdown.classList.remove('open');
      badge.classList.remove('active');
    }
  });

  // Mobile drawer toggle
  const hamburger = document.getElementById('hamburgerToggle');
  const mobileDrawer = document.getElementById('mobileNavDrawer');
  if (hamburger && mobileDrawer) {
    hamburger.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
    });
  }
}

/**
 * Handle user logout
 */
async function handleLogout() {
  try {
    await fetch(`${AUTH_API_BASE}logout.php`, { method: 'POST', credentials: 'same-origin' });
  } catch (e) {}

  window.currentUser = null;
  localStorage.removeItem('nsbm_session_user');

  if (window.showToast) {
    showToast('Logged out successfully.');
  }

  setTimeout(() => {
    const isInsideAdminDir = window.location.pathname.includes('/admin/');
    window.location.href = isInsideAdminDir ? '../login.html' : './login.html';
  }, 400);
}

