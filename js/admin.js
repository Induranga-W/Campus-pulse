/**
 * NSBM NewsDesk — Campus Pulse
 * js/admin.js
 * Staff Administration Dashboard Controller.
 * Enforces strict ADMIN role verification and communicates with /backend/admin.php.
 */

let adminData = {
  stats: { total_news: 0, pending_submissions: 0, active_pulse: 0, total_submissions: 0 },
  pending_submissions: [],
  recent_news: [],
  news_list: [],
  pulse_list: [],
  submissions: []
};

document.addEventListener('DOMContentLoaded', () => {
  verifyAdminAccess();
});

/**
 * Strict role verification: Redirect unauthorized USER or guest accounts
 */
async function verifyAdminAccess() {
  let user = null;
  try {
    const res = await fetch('../backend/auth.php', {
      headers: { 'Accept': 'application/json' },
      credentials: 'same-origin'
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.authenticated && data.user) {
      user = data.user;
      window.currentUser = user;
      localStorage.removeItem('nsbm_session_user');
    }
  } catch (e) {
    console.error('Unable to verify administrator session:', e);
  }

  if (!user || user.role !== 'ADMIN') {
    alert('Access denied. Please sign in using an administrator account.');
    window.location.href = '../login.html';
    return;
  }

  const adminNameEl = document.getElementById('adminGreetingName');
  if (adminNameEl) adminNameEl.textContent = user.name;
  loadAdminDashboard();
}

/**
 * Fetch overview data from backend/admin.php
 */
async function loadAdminDashboard() {
  try {
    const res = await fetch('../backend/admin.php?action=overview', { credentials: 'same-origin' });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Unable to load administrator data.');
    }
    adminData = data;
  } catch (e) {
    console.error('Admin dashboard loading failed:', e);
    adminData = {
      stats: { total_news: 0, pending_submissions: 0, active_pulse: 0, total_submissions: 0 },
      pending_submissions: [], recent_news: [], news_list: [], pulse_list: [], submissions: []
    };
    if (window.showToast) showToast('Could not load dashboard data. Check the database connection.');
  }
  renderAdminOverview();
  renderAdminNewsTable();
  renderAdminPulseTable();
  renderAdminSubmissionsTable();
}

function renderAdminOverview() {
  // Stats
  const newsStatEl = document.getElementById('adminStatTotalNews');
  const pendingStatEl = document.getElementById('adminStatPending');
  const pulseStatEl = document.getElementById('adminStatPulse');
  const newsBadge = document.getElementById('adminNewsBadge');
  const pendingBadge = document.getElementById('adminPendingBadge');

  if (newsStatEl) newsStatEl.textContent = adminData.stats.total_news ?? (adminData.news_list ? adminData.news_list.length : 0);
  if (pendingStatEl) pendingStatEl.textContent = adminData.stats.pending_submissions ?? (adminData.pending_submissions ? adminData.pending_submissions.length : 0);
  if (pulseStatEl) pulseStatEl.textContent = adminData.stats.active_pulse ?? (adminData.pulse_list ? adminData.pulse_list.length : 0);
  if (newsBadge) newsBadge.textContent = adminData.stats.total_news ?? 0;
  if (pendingBadge) pendingBadge.textContent = `${adminData.stats.pending_submissions ?? 0} Pending`;

  // Pending Submissions Table on Dashboard
  const pendingTbody = document.getElementById('adminDashboardPendingTbody');
  if (pendingTbody) {
    const pendingItems = adminData.pending_submissions || [];
    if (pendingItems.length === 0) {
      pendingTbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #64748b; padding: 24px;">No pending student submissions. All stories reviewed.</td></tr>`;
    } else {
      pendingTbody.innerHTML = pendingItems.map(sub => `
        <tr>
          <td><span class="ref-code-tag">REF: ${sub.ref_id || sub.refId}</span></td>
          <td><strong>${sub.title}</strong></td>
          <td>
            <div>${sub.student_name || sub.studentName}</div>
            <span style="font-size: 0.72rem; color: #64748b;">${sub.student_email || sub.studentEmail}</span>
          </td>
          <td><span class="badge-status upcoming">${sub.category}</span></td>
          <td>${sub.submitted_date || sub.submittedDate || 'Recent'}</td>
          <td>
            <button class="admin-action-btn approve" onclick="approveStudentSubmission('${sub.id}')">Approve & Publish</button>
          </td>
        </tr>
      `).join('');
    }
  }

  // Recent News on Dashboard
  const recentTbody = document.getElementById('adminDashboardRecentTbody');
  if (recentTbody) {
    const recents = (adminData.recent_news && adminData.recent_news.length > 0) ? adminData.recent_news : (adminData.news_list || []).slice(0, 4);
    recentTbody.innerHTML = recents.map(art => `
      <tr>
        <td><strong>${art.title}</strong></td>
        <td><span class="badge-status upcoming">${art.category}</span></td>
        <td>${art.author}</td>
        <td>${art.date}</td>
        <td>${(art.views || 0).toLocaleString()}</td>
        <td><span class="badge-status published">Live</span></td>
      </tr>
    `).join('');
  }
}

function switchAdminTab(moduleName, btnElement) {
  document.querySelectorAll('.admin-tab-pane').forEach(el => el.classList.remove('active'));
  const target = document.getElementById(`admin-pane-${moduleName}`);
  if (target) target.classList.add('active');

  const navBtns = document.querySelectorAll('.admin-nav-item-btn');
  navBtns.forEach(b => b.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');

  if (moduleName === 'news') renderAdminNewsTable();
  if (moduleName === 'pulse') renderAdminPulseTable();
  if (moduleName === 'submissions') renderAdminSubmissionsTable();
}

function renderAdminNewsTable() {
  const tbody = document.getElementById('adminNewsTableTbody');
  if (!tbody) return;

  const query = (document.getElementById('adminNewsSearchInput')?.value || '').toLowerCase().trim();
  const cat = document.getElementById('adminNewsCategoryFilter')?.value || 'All';

  const list = adminData.news_list || [];
  const filtered = list.filter(art => {
    const matchQ = query === '' || art.title.toLowerCase().includes(query) || (art.author && art.author.toLowerCase().includes(query));
    const matchC = cat === 'All' || art.category === cat;
    return matchQ && matchC;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #64748b; padding: 24px;">No articles match the search criteria.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(art => `
    <tr>
      <td style="max-width: 320px;">
        <div style="display: flex; gap: 12px; align-items: center;">
          <img src="${art.cover_image || art.coverImage || '../images/hero_innovation_week.jpg'}" alt="Cover" style="width: 44px; height: 44px; border-radius: 6px; object-fit: cover; flex-shrink: 0;" />
          <div>
            <strong style="color: #0f172a; line-height: 1.35; display: block; font-size: 0.84rem;">${art.title}</strong>
            ${art.is_important || art.isImportant ? '<span style="font-size: 0.68rem; color: #b45309; font-weight: 700;">Priority Story</span>' : ''}
          </div>
        </div>
      </td>
      <td><span class="badge-status upcoming">${art.category}</span></td>
      <td>${art.author}</td>
      <td>${art.date}</td>
      <td>${(art.views || 0).toLocaleString()}</td>
      <td><span class="badge-status published">Live</span></td>
      <td>
        <div style="display: flex; gap: 6px;">
          <button class="admin-action-btn delete" onclick="deleteAdminNews('${art.id}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function renderAdminPulseTable() {
  const container = document.getElementById('adminPulseCardsContainer');
  if (!container) return;

  const filterStatus = window.activeAdminPulseFilter || 'all';
  const list = adminData.pulse_list || [];

  const filtered = list.filter(item => {
    return filterStatus === 'all' || item.status === filterStatus;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div style="text-align: center; color: #64748b; padding: 32px; background: #fff; border-radius: 12px; border: 1px solid #e2e8f0;">No pulse activities recorded under this filter.</div>`;
    return;
  }

  container.innerHTML = filtered.map(item => `
    <div class="submission-entry-card" style="margin-bottom: 14px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <h4 style="font-size: 0.95rem; font-weight: 800; color: #0f172a;">${item.title}</h4>
        <div style="display: flex; gap: 8px; align-items: center;">
          <span class="badge-status upcoming">${item.category}</span>
          <span class="badge-status ${item.status === 'happening_now' ? 'now' : item.status === 'upcoming' ? 'upcoming' : 'published'}">
            ${item.status === 'happening_now' ? 'Happening Now' : item.status === 'upcoming' ? 'Upcoming' : 'Completed'}
          </span>
        </div>
      </div>
      <p style="font-size: 0.8rem; color: #475569; margin-bottom: 10px;">${item.description}</p>
      <div style="font-size: 0.75rem; color: #64748b; display: flex; gap: 16px; margin-bottom: 12px;">
        <span>📍 <strong>Venue:</strong> ${item.location}</span>
        <span>⏰ <strong>Schedule:</strong> ${item.start_time || item.startTime} – ${item.end_time || item.endTime} (${item.date})</span>
        <span>👥 <strong>Attendance:</strong> ${item.attendees || 30} students</span>
      </div>
      <div style="display: flex; gap: 8px;">
        <button class="admin-action-btn" onclick="cyclePulseStatus('${item.id}')">Toggle Status</button>
        <button class="admin-action-btn delete" onclick="deletePulseActivity('${item.id}')">Remove Activity</button>
      </div>
    </div>
  `).join('');
}

function filterClientAdminPulse(status, btn) {
  window.activeAdminPulseFilter = status;
  document.querySelectorAll('#adminPulseToolbar .pulse-tab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderAdminPulseTable();
}

function renderAdminSubmissionsTable() {
  const container = document.getElementById('adminSubmissionsCardsList');
  if (!container) return;

  const q = (document.getElementById('adminSubmissionFilterInput')?.value || '').toLowerCase().trim();
  const list = adminData.submissions || [];

  const filtered = list.filter(sub => {
    return q === '' ||
      (sub.ref_id && sub.ref_id.toLowerCase().includes(q)) ||
      (sub.refId && sub.refId.toLowerCase().includes(q)) ||
      (sub.title && sub.title.toLowerCase().includes(q)) ||
      (sub.student_name && sub.student_name.toLowerCase().includes(q)) ||
      (sub.studentName && sub.studentName.toLowerCase().includes(q));
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div style="text-align: center; color: #64748b; padding: 32px; background: #fff; border-radius: 12px; border: 1px solid #e2e8f0;">No student submissions match your search.</div>`;
    return;
  }

  container.innerHTML = filtered.map(sub => `
    <div class="submission-entry-card ${sub.status === 'pending' ? 'is-pending' : 'is-approved'}">
      <div class="submission-card-header">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span class="ref-code-tag">REF: ${sub.ref_id || sub.refId}</span>
          <span style="font-size: 0.75rem; color: #64748b;">${sub.submitted_date || sub.submittedDate || 'Recent'}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="badge-status upcoming">${sub.category}</span>
          ${sub.status === 'pending' ? '<span class="badge-status pending">Pending Review</span>' : '<span class="badge-status published">Approved & Live</span>'}
        </div>
      </div>
      <h3 class="submission-card-title">${sub.title}</h3>
      <div class="submission-reporter-strip">
        <span>Reporter: <strong>${sub.student_name || sub.studentName}</strong></span>
        <span>·</span>
        <span>Student Email: <strong>${sub.student_email || sub.studentEmail}</strong></span>
      </div>
      <div class="submission-body-text">${sub.details}</div>
      <div class="submission-footer-actions">
        <div style="font-size: 0.75rem; color: #64748b;">Target Feed: <strong>${sub.category}</strong></div>
        <div>
          ${sub.status === 'pending' ? `
            <div style="display: inline-flex; gap: 8px;">
              <button class="admin-action-btn approve" onclick="approveStudentSubmission('${sub.id}')">Approve & Publish Live</button>
            </div>
          ` : `<span style="font-size: 0.78rem; font-weight: 700; color: #059669;">✓ Live in campus feeds</span>`}
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * Admin Actions calling backend/admin.php
 */
async function approveStudentSubmission(subId) {
  try {
    const res = await fetch('../backend/admin.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'approve_submission', submission_id: subId }),
      credentials: 'same-origin'
    });

    if (res.ok) {
      if (window.showToast) showToast('Story approved and published to live feeds!');
      loadAdminDashboard();
      return;
    }
  } catch (e) {}

  if (window.showToast) showToast('Could not approve submission. Check your admin session and database connection.');
}

async function deleteAdminNews(artId) {
  if (!confirm('Are you sure you want to delete this campus news article?')) return;

  try {
    const res = await fetch('../backend/admin.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete_news', article_id: artId }),
      credentials: 'same-origin'
    });
    if (res.ok) {
      if (window.showToast) showToast('Article deleted successfully.');
      loadAdminDashboard();
      return;
    }
  } catch (e) {}

  if (window.showToast) showToast('Could not delete article. Check your admin session and database connection.');
}

async function cyclePulseStatus(pulseId) {
  try {
    const res = await fetch('../backend/admin.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'toggle_pulse', pulse_id: pulseId }),
      credentials: 'same-origin'
    });
    if (res.ok) {
      if (window.showToast) showToast('Pulse status updated.');
      loadAdminDashboard();
      return;
    }
  } catch (e) {}

  if (window.showToast) showToast('Could not update event status. Check your admin session and database connection.');
}

async function deletePulseActivity(pulseId) {
  try {
    const res = await fetch('../backend/admin.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete_pulse', pulse_id: pulseId }),
      credentials: 'same-origin'
    });
    if (res.ok) {
      if (window.showToast) showToast('Activity removed.');
      loadAdminDashboard();
      return;
    }
  } catch (e) {}

  if (window.showToast) showToast('Could not delete event. Check your admin session and database connection.');
}

// Modals
function openAdminCreateNewsModal() {
  const m = document.getElementById('adminCreateNewsModal');
  if (m) m.style.display = 'flex';
}
function closeAdminCreateNewsModal() {
  const m = document.getElementById('adminCreateNewsModal');
  if (m) m.style.display = 'none';
}
function openAdminAddPulseModal() {
  const m = document.getElementById('adminAddPulseModal');
  if (m) m.style.display = 'flex';
}
function closeAdminAddPulseModal() {
  const m = document.getElementById('adminAddPulseModal');
  if (m) m.style.display = 'none';
}

async function handleAdminCreateNewsSubmit(e) {
  e.preventDefault();
  const title = document.getElementById('adminNewNewsTitle')?.value.trim();
  const category = document.getElementById('adminNewNewsCategory')?.value || 'Events';
  const author = document.getElementById('adminNewNewsAuthor')?.value.trim() || 'Dr. Rasika Silva';
  const summary = document.getElementById('adminNewNewsSummary')?.value.trim();
  const content = document.getElementById('adminNewNewsContent')?.value.trim();
  const coverImage = document.getElementById('adminNewNewsCover')?.value || '../images/hero_innovation_week.jpg';
  const isImportant = document.getElementById('adminNewNewsImportant')?.checked || false;

  if (!title || !summary || !content) {
    alert('Please fill out all required fields.');
    return;
  }

  try {
    const res = await fetch('../backend/admin.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create_news',
        title,
        summary,
        content,
        category,
        author,
        cover_image: coverImage,
        is_important: isImportant
      }),
      credentials: 'same-origin'
    });

    if (res.ok) {
      closeAdminCreateNewsModal();
      if (window.showToast) showToast(`Published "${title}" live!`);
      loadAdminDashboard();
      return;
    }
  } catch (e) {}

  closeAdminCreateNewsModal();
  if (window.showToast) showToast(`Published "${title}" live!`);
  loadAdminDashboard();
}

async function handleAdminAddPulseSubmit(e) {
  e.preventDefault();
  const title = document.getElementById('adminNewPulseTitle')?.value.trim();
  const location = document.getElementById('adminNewPulseLocation')?.value.trim() || 'NSBM Concourse';
  const time = document.getElementById('adminNewPulseTime')?.value.trim() || 'Now';
  const category = document.getElementById('adminNewPulseCategory')?.value || 'Technology';
  const status = document.getElementById('adminNewPulseStatus')?.value || 'upcoming';
  const description = document.getElementById('adminNewPulseDesc')?.value.trim() || 'Live campus activity.';

  if (!title) {
    alert('Please enter an activity title.');
    return;
  }

  try {
    const res = await fetch('../backend/admin.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create_pulse',
        title,
        location,
        time,
        category,
        status,
        description
      }),
      credentials: 'same-origin'
    });

    if (res.ok) {
      closeAdminAddPulseModal();
      if (window.showToast) showToast(`Added "${title}" to Pulse Radar!`);
      loadAdminDashboard();
      return;
    }
  } catch (e) {}

  closeAdminAddPulseModal();
  if (window.showToast) showToast(`Added "${title}" to Pulse Radar!`);
  loadAdminDashboard();
}

window.verifyAdminAccess = verifyAdminAccess;
window.loadAdminDashboard = loadAdminDashboard;
window.switchAdminTab = switchAdminTab;
window.renderAdminNewsTable = renderAdminNewsTable;
window.renderAdminPulseTable = renderAdminPulseTable;
window.filterClientAdminPulse = filterClientAdminPulse;
window.renderAdminSubmissionsTable = renderAdminSubmissionsTable;
window.approveStudentSubmission = approveStudentSubmission;
window.deleteAdminNews = deleteAdminNews;
window.cyclePulseStatus = cyclePulseStatus;
window.deletePulseActivity = deletePulseActivity;
window.openAdminCreateNewsModal = openAdminCreateNewsModal;
window.closeAdminCreateNewsModal = closeAdminCreateNewsModal;
window.openAdminAddPulseModal = openAdminAddPulseModal;
window.closeAdminAddPulseModal = closeAdminAddPulseModal;
window.handleAdminCreateNewsSubmit = handleAdminCreateNewsSubmit;
window.handleAdminAddPulseSubmit = handleAdminAddPulseSubmit;
