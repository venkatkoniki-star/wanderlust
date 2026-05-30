// experiences.js

let currentFilter = 'all';
let selectedRating = 5;

// Star rating widget
const stars = document.querySelectorAll('.star');
stars.forEach(star => {
  star.addEventListener('click', () => {
    selectedRating = parseInt(star.dataset.val);
    document.getElementById('exp-rating').value = selectedRating;
    stars.forEach((s, i) => s.classList.toggle('selected', i < selectedRating));
  });
  star.addEventListener('mouseover', () => {
    stars.forEach((s, i) => s.classList.toggle('hovered', i <= parseInt(star.dataset.val) - 1));
  });
  star.addEventListener('mouseout', () => {
    stars.forEach(s => s.classList.remove('hovered'));
  });
});
// Default 5 stars selected
stars.forEach(s => s.classList.add('selected'));

function starsDisplay(n) {
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

function timeSince(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? '1 month ago' : `${months} months ago`;
}

function renderExperiences() {
  const list = document.getElementById('experiences-list');
  const noEl = document.getElementById('no-experiences');
  list.innerHTML = '';

  const searchVal = document.getElementById('exp-search').value.trim();
  const filter = {};
  if (currentFilter !== 'all') filter.category = currentFilter;
  if (searchVal) filter.destination = searchVal;

  const exps = DB.getExperiences(filter);
  if (!exps.length) { noEl.style.display = 'block'; return; }
  noEl.style.display = 'none';

  const user = DB.currentUser();
  exps.forEach((e, i) => {
    const helpful = user && e.helpfulBy.includes(user.id);
    const card = document.createElement('div');
    card.className = 'exp-card';
    card.style.animationDelay = `${0.05 * i}s`;
    card.innerHTML = `
      <div class="exp-card-inner">
        ${e.image ? `<div class="exp-img"><img src="${e.image}" alt="${e.title}" loading="lazy"></div>` : ''}
        <div class="exp-content">
          <div class="exp-top">
            <span class="story-category-tag">${e.category}</span>
            <span class="exp-stars ${e.rating >= 4 ? 'high-rating' : ''}">${starsDisplay(e.rating)} <strong>${e.rating}.0</strong></span>
          </div>
          <h3 class="exp-title">${e.title}</h3>
          <p class="exp-destination">📍 ${e.destination}</p>
          <p class="exp-body">${e.body}</p>
          ${e.tips ? `<div class="exp-tips"><span class="tips-label">💡 Insider Tip</span>${e.tips}</div>` : ''}
          <div class="exp-footer">
            <div class="story-author">
              <span class="author-avatar">${e.avatar}</span>
              <div><span class="author-name">${e.author}</span><br><span class="story-time">${timeSince(e.date)}</span></div>
            </div>
            <div style="display:flex;gap:12px;align-items:center;">
              <button class="helpful-btn ${helpful ? 'active' : ''}" data-id="${e.id}">
                👍 Helpful <span>${e.helpful}</span>
              </button>
              <a href="flights.html?dest=${encodeURIComponent(e.destination)}" class="btn btn-outline" style="padding:7px 16px;font-size:0.72rem;">✈ Fly There</a>
            </div>
          </div>
        </div>
      </div>
    `;

    card.querySelector('.helpful-btn').addEventListener('click', (ev) => {
      const result = DB.markHelpful(e.id);
      if (!result.ok) { alert(result.msg); return; }
      const btn = ev.currentTarget;
      btn.classList.toggle('active');
      btn.querySelector('span').textContent = result.helpful;
    });

    list.appendChild(card);
  });
}

// Modal
document.getElementById('open-exp-modal').addEventListener('click', () => {
  if (!DB.currentUser()) { window.location.href = 'auth.html'; return; }
  document.getElementById('exp-modal').classList.add('open');
});
document.getElementById('close-exp-modal').addEventListener('click', () => document.getElementById('exp-modal').classList.remove('open'));
document.querySelectorAll('.modal-overlay').forEach(o => o.addEventListener('click', e => { if (e.target === o) o.classList.remove('open'); }));

// Submit
document.getElementById('submit-exp').addEventListener('click', () => {
  const dest = document.getElementById('exp-dest').value.trim();
  const cat = document.getElementById('exp-cat').value;
  const title = document.getElementById('exp-title').value.trim();
  const body = document.getElementById('exp-body').value.trim();
  const tips = document.getElementById('exp-tips').value.trim();
  const image = document.getElementById('exp-image').value.trim();
  const rating = parseInt(document.getElementById('exp-rating').value);
  const msg = document.getElementById('exp-msg');

  if (!dest || !title || !body) {
    msg.style.display = 'block'; msg.style.color = 'var(--accent)'; msg.textContent = 'Please fill in Destination, Title and Description.'; return;
  }
  const result = DB.addExperience({ destination: dest, category: cat, rating, title, body, tips, image });
  if (!result.ok) { msg.style.display = 'block'; msg.style.color = 'var(--accent)'; msg.textContent = result.msg; return; }
  document.getElementById('exp-modal').classList.remove('open');
  ['exp-dest','exp-title','exp-body','exp-tips','exp-image'].forEach(id => document.getElementById(id).value = '');
  renderExperiences();
});

// Filters
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderExperiences();
  });
});

document.getElementById('exp-search').addEventListener('input', renderExperiences);

renderExperiences();