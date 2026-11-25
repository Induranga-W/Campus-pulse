/**
 * NSBM NewsDesk — Campus Pulse
 * js/profile.js
 * Controller for the user profile page (profile.html).
 */

document.addEventListener('DOMContentLoaded', () => {
  renderProfilePage();
  setupInterestsForm();
});

function renderProfilePage() {
  const user = window.currentUser || JSON.parse(localStorage.getItem('nsbm_session_user') || 'null');
  if (!user) return;

  const avatarEl = document.getElementById('profileAvatarImg');
  const nameEl = document.getElementById('profileDisplayName');
  const emailEl = document.getElementById('profileDisplayEmail');
  const roleEl = document.getElementById('profileDisplayRole');
  const cohortEl = document.getElementById('profileDisplayCohort');
  const bookmarkCountEl = document.getElementById('profileBookmarkCount');
  const roleBadgeEl = document.getElementById('profileRoleBadge');

  if (avatarEl) avatarEl.src = user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150';
  if (nameEl) nameEl.textContent = user.name;
  if (emailEl) emailEl.textContent = user.email;
  if (cohortEl) cohortEl.textContent = user.cohort || 'Batch 26.1 IFSL';

  const isAdmin = user.role === 'ADMIN';
  if (roleEl) roleEl.textContent = isAdmin ? 'Administrator' : 'Student Undergrad';
  if (roleBadgeEl) {
    roleBadgeEl.textContent = isAdmin ? '🛡️ Administrator' : '🎓 Student User';
    roleBadgeEl.className = `dropdown-role-badge ${isAdmin ? 'admin' : 'user'}`;
  }

  // Populate counts
  const bookmarks = JSON.parse(localStorage.getItem('nsbm_bookmarks') || '["art-01", "art-03"]');
  if (bookmarkCountEl) bookmarkCountEl.textContent = bookmarks.length;
}

function setupInterestsForm() {
  const container = document.getElementById('profileInterestsGrid');
  if (!container) return;

  const userInterests = JSON.parse(localStorage.getItem('nsbm_news_interests') || '["Events", "Academic", "Technology", "Campus Life"]');
  const allCategories = ['Events', 'Academic', 'Announcements', 'Campus Life', 'Technology', 'Sports'];

  container.innerHTML = allCategories.map(cat => {
    const isChecked = userInterests.includes(cat);
    return `
      <label style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; font-weight: 600; cursor: pointer; background: #ffffff; padding: 10px 14px; border: 1px solid var(--border); border-radius: var(--radius-sm);">
        <input type="checkbox" name="interest" value="${cat}" ${isChecked ? 'checked' : ''} onchange="handleInterestChange()" />
        <span>${cat}</span>
      </label>
    `;
  }).join('');
}

function handleInterestChange() {
  const checkboxes = document.querySelectorAll('input[name="interest"]:checked');
  const selected = Array.from(checkboxes).map(cb => cb.value);
  localStorage.setItem('nsbm_news_interests', JSON.stringify(selected));
  if (window.showToast) {
    showToast('Feed topic preferences saved!');
  }
}

window.renderProfilePage = renderProfilePage;
window.handleInterestChange = handleInterestChange;
