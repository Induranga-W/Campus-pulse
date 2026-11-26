/**
 * NSBM NewsDesk — Campus Pulse
 * js/admin-requests.js
 * "Admin Requests" tab: lists people who registered as admins and lets an
 * existing admin approve or reject them. Loaded after js/admin.js.
 */

let adminRequests = [];

function escRequestText(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

async function loadAdminRequests() {
  try {
    const res = await fetch('../backend/admin.php?action=pending_admins', { credentials: 'same-origin' });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) return; // not an admin or database offline: stay quiet
    adminRequests = data.requests || [];
  } catch (e) {
    return;
  }
  renderAdminRequests();
}

function renderAdminRequests() {
  const badge = document.getElementById('adminRequestsBadge');
  if (badge) {
    const n = adminRequests.length;
    badge.textContent = n > 0 ? n + ' Pending' : 'None';
    badge.style.background = n > 0 ? '#fef3c7' : '';
    badge.style.color = n > 0 ? '#b45309' : '';
  }

  const tbody = document.getElementById('adminRequestsTbody');
  if (!tbody) return;

  if (adminRequests.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:#64748b; padding:28px;">No admin requests waiting for approval.</td></tr>';
    return;
  }

  tbody.innerHTML = adminRequests.map(r => `
    <tr>
      <td><strong>${escRequestText(r.name)}</strong></td>
      <td>${escRequestText(r.email)}</td>
      <td>${escRequestText(r.department)}</td>
      <td>${escRequestText(r.created_at)}</td>
      <td>
        <div style="display:inline-flex; gap:8px;">
          <button class="admin-action-btn approve" onclick="decideAdminRequest(${Number(r.id)}, 'approve')">Approve</button>
          <button class="admin-action-btn delete" onclick="decideAdminRequest(${Number(r.id)}, 'reject')">Reject</button>
        </div>
      </td>
    </tr>
  `).join('');
}

async function decideAdminRequest(userId, decision) {
  const req = adminRequests.find(r => Number(r.id) === Number(userId));
  const who = req ? req.name : 'this person';
  const question = decision === 'approve'
    ? 'Give ' + who + ' full admin access?'
    : 'Reject the admin request from ' + who + '?';
  if (!confirm(question)) return;

  try {
    const res = await fetch('../backend/admin.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: decision === 'approve' ? 'approve_admin' : 'reject_admin', user_id: userId }),
      credentials: 'same-origin'
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success) {
      if (window.showToast) showToast(data.message);
      loadAdminRequests();
      return;
    }
    if (window.showToast) showToast(data.error || 'Could not update the request.');
  } catch (e) {
    if (window.showToast) showToast('Could not reach the server.');
  }
}

document.addEventListener('DOMContentLoaded', loadAdminRequests);

// Refresh the list whenever the Admin Requests tab is opened.
(function () {
  const original = window.switchAdminTab;
  if (typeof original !== 'function') return;
  window.switchAdminTab = function (moduleName, btnElement) {
    original(moduleName, btnElement);
    if (moduleName === 'requests') loadAdminRequests();
  };
})();
