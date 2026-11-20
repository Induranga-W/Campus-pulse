/**
 * NSBM NewsDesk — Campus Pulse
 * js/pulse.js
 * Controller for the dedicated Campus Pulse radar page (pulse.html).
 */

let pulseActivities = [];
let activePulseFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
  fetchCampusPulseData();
});

async function fetchCampusPulseData() {
  try {
    const res = await fetch('./backend/pulse.php');
    if (res.ok) {
      const data = await res.json();
      if (data && data.items) {
        pulseActivities = data.items;
      }
    }
  } catch (e) {
    if (window.DEFAULT_PULSE) {
      pulseActivities = window.DEFAULT_PULSE;
    }
  }

  renderPulseTimeline(activePulseFilter);
}

function renderPulseTimeline(filter = 'all') {
  const container = document.getElementById('pulseTimelineGrid');
  if (!container) return;

  activePulseFilter = filter;
  let items = pulseActivities;
  if (filter !== 'all') {
    items = pulseActivities.filter(item => item.status === filter);
  }

  if (items.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📡</div>
        <h3>No activities under this filter</h3>
        <p>No campus pulse events currently recorded for "${filter}". Check back soon or select "All Activities".</p>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(item => {
    const hasReminder = window.pulseReminders ? window.pulseReminders.has(item.id) : false;
    const isLive = item.status === 'happening_now';
    let pillClass = item.status === 'happening_now' ? 'now' : (item.status === 'upcoming' ? 'upcoming' : 'completed');
    let pillText = item.status === 'happening_now' ? '🟢 HAPPENING NOW' : (item.status === 'upcoming' ? '🔵 UPCOMING' : '⚪ COMPLETED');

    return `
      <div class="pulse-full-card ${isLive ? 'live-glow' : ''}">
        <div>
          <div class="pulse-card-top">
            <span class="status-pill ${pillClass}">
              <span class="status-dot"></span>
              ${pillText}
            </span>
            <span class="pulse-card-date">${item.date}</span>
          </div>

          <h3 style="font-size: 1.05rem; font-weight: 800; color: #0f172a; margin-top: 6px;">${item.title}</h3>
          <p style="font-size: 0.8rem; color: #475569; margin-top: 6px; line-height: 1.5;">${item.description}</p>

          <div class="pulse-details-list">
            <div class="pulse-detail-row">
              <span>📍</span>
              <strong>Location:</strong>
              <span>${item.location}</span>
            </div>
            <div class="pulse-detail-row">
              <span>⏰</span>
              <strong>Time:</strong>
              <span>${item.start_time || item.startTime} – ${item.end_time || item.endTime}</span>
            </div>
            <div class="pulse-detail-row">
              <span>👥</span>
              <strong>Organized by:</strong>
              <span>${item.organizer}</span>
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; padding-top: 12px; border-top: 1px solid #f1f5f9;">
          <span style="font-size: 0.72rem; color: #64748b;">${item.attendees ? `~${item.attendees} confirmed attendance` : ''}</span>
          ${item.status !== 'completed' ? `
            <button class="pulse-reminder-btn ${hasReminder ? 'active' : ''}" onclick="togglePulseReminder('${item.id}')">
              <span>🔔</span>
              <span>${hasReminder ? 'Reminder Set' : 'Set Reminder'}</span>
            </button>
          ` : '<span style="font-size: 0.72rem; color: #94a3b8; font-weight: 600;">Event Concluded</span>'}
        </div>
      </div>
    `;
  }).join('');
}

function filterPulse(status, btnElement) {
  const tabs = document.querySelectorAll('.pulse-tab');
  tabs.forEach(t => t.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');
  renderPulseTimeline(status);
}

function togglePulseReminder(pulseId) {
  const item = pulseActivities.find(p => p.id === pulseId);
  if (!item) return;

  if (!window.pulseReminders) {
    window.pulseReminders = new Set();
  }

  if (window.pulseReminders.has(pulseId)) {
    window.pulseReminders.delete(pulseId);
    showToast(`Reminder cancelled for ${item.title}`);
  } else {
    window.pulseReminders.add(pulseId);
    showToast(`Reminder set! You will be alerted before ${item.title} starts.`);
  }

  localStorage.setItem('nsbm_reminders', JSON.stringify([...window.pulseReminders]));

  // Notify backend
  fetch('./backend/pulse.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pulse_id: pulseId })
  }).catch(() => {});

  renderPulseTimeline(activePulseFilter);
}

window.filterPulse = filterPulse;
window.togglePulseReminder = togglePulseReminder;
window.renderPulseTimeline = renderPulseTimeline;
