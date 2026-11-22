/**
 * NSBM NewsDesk — Campus Pulse
 * js/news.js
 * Controller for the dedicated Latest News page (news.html).
 */

let newsPageArticles = [];
let currentCategoryFilter = 'All';

document.addEventListener('DOMContentLoaded', () => {
  fetchLatestNews();
});

async function fetchLatestNews() {
  const container = document.getElementById('latestNewsCardsGrid');
  if (!container) return;

  try {
    const res = await fetch('./backend/news.php');
    if (res.ok) {
      const data = await res.json();
      if (data && data.articles) {
        newsPageArticles = data.articles;
      }
    }
  } catch (e) {
    if (window.DEFAULT_NEWS) {
      newsPageArticles = window.DEFAULT_NEWS;
    }
  }

  renderNewsGrid();
}

function renderNewsGrid() {
  const container = document.getElementById('latestNewsCardsGrid');
  if (!container) return;

  const searchInput = document.getElementById('newsSearchInput');
  const sortSelect = document.getElementById('newsSortSelect');

  const query = (searchInput ? searchInput.value.trim().toLowerCase() : '');
  const sortBy = sortSelect ? sortSelect.value : 'newest';

  let filtered = newsPageArticles.filter(art => {
    const matchesCat = currentCategoryFilter === 'All' || 
                       art.category.toLowerCase() === currentCategoryFilter.toLowerCase();
    const matchesQuery = !query ||
      art.title.toLowerCase().includes(query) ||
      (art.summary && art.summary.toLowerCase().includes(query)) ||
      (art.content && art.content.toLowerCase().includes(query));
    return matchesCat && matchesQuery;
  });

  if (sortBy === 'popular') {
    filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
  } else {
    // Newest
    filtered.sort((a, b) => (b.id > a.id ? 1 : -1));
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <h3>No campus stories found</h3>
        <p>No stories matched "${query || currentCategoryFilter}". Try searching with different terms or reset filters.</p>
        <button class="btn-secondary" onclick="resetNewsFilter()" style="margin-top: 14px;">Reset Filter</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(art => {
    const isSaved = window.savedBookmarks ? window.savedBookmarks.has(art.id) : false;
    const isLiked = window.likedArticles ? window.likedArticles.has(art.id) : false;
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
            <button class="like-btn" onclick="toggleLike('${art.id}', event)" title="Like story">
              <span>❤️</span>
              <span>${likeCount}</span>
            </button>
            <button class="bookmark-btn ${isSaved ? 'saved' : ''}" onclick="toggleBookmark('${art.id}', event)" title="${isSaved ? 'Remove bookmark' : 'Save story'}">
              <span>🔖</span>
              <span>${isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function handleNewsSearchInput() {
  renderNewsGrid();
}

function setNewsCategoryFilter(cat, btn) {
  currentCategoryFilter = cat;
  document.querySelectorAll('.cat-tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderNewsGrid();
}

function resetNewsFilter() {
  currentCategoryFilter = 'All';
  const input = document.getElementById('newsSearchInput');
  if (input) input.value = '';
  document.querySelectorAll('.cat-tab-btn').forEach((b, i) => {
    if (i === 0) b.classList.add('active');
    else b.classList.remove('active');
  });
  renderNewsGrid();
}

window.handleNewsSearchInput = handleNewsSearchInput;
window.setNewsCategoryFilter = setNewsCategoryFilter;
window.resetNewsFilter = resetNewsFilter;
window.renderNewsGrid = renderNewsGrid;
