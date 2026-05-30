// stories.js

let currentFilter = 'all';

function timeSince(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? '1 month ago' : `${months} months ago`;
}

function renderStories() {
  const grid = document.getElementById('stories-grid');
  const noEl = document.getElementById('no-stories');
  grid.innerHTML = '';
  const filter = currentFilter === 'all' ? {} : { category: currentFilter };
  const stories = DB.getStories(filter);

  if (!stories.length) { noEl.style.display = 'block'; return; }
  noEl.style.display = 'none';

  stories.forEach((s, i) => {
    const user = DB.currentUser();
    const liked = user && s.likedBy.includes(user.id);
    const card = document.createElement('article');
    card.className = 'story-card';
    card.style.animationDelay = `${0.06 * i}s`;
    card.innerHTML = `
      ${s.image ? `<div class="story-card-img"><img src="${s.image}" alt="${s.title}" loading="lazy"></div>` : ''}
      <div class="story-card-body">
        <div class="story-meta-top">
          <span class="story-category-tag">${s.category}</span>
          <span class="story-time">${timeSince(s.date)}</span>
        </div>
        <h3 class="story-title-text">${s.title}</h3>
        <p class="story-destination-tag">📍 ${s.destination}</p>
        <p class="story-excerpt">${s.body.slice(0, 180)}${s.body.length > 180 ? '…' : ''}</p>
        <div class="story-footer">
          <div class="story-author">
            <span class="author-avatar">${s.avatar}</span>
            <span class="author-name">${s.author}</span>
          </div>
          <div class="story-actions">
            <button class="story-like-btn ${liked ? 'liked' : ''}" data-id="${s.id}">
              ${liked ? '♥' : '♡'} <span>${s.likes}</span>
            </button>
            <button class="story-read-btn btn btn-outline" data-id="${s.id}" style="padding:7px 18px;font-size:0.72rem;">Read More</button>
          </div>
        </div>
      </div>
    `;

    card.querySelector('.story-like-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      const result = DB.likeStory(s.id);
      if (!result.ok) { alert(result.msg); return; }
      const btn = e.currentTarget;
      btn.classList.toggle('liked', result.liked);
      btn.querySelector('span').textContent = result.likes;
      btn.firstChild.textContent = result.liked ? '♥' : '♡';
    });

    card.querySelector('.story-read-btn').addEventListener('click', () => openStoryDetail(s.id));
    card.querySelector('.story-card-body h3').addEventListener('click', () => openStoryDetail(s.id));

    grid.appendChild(card);
  });
}

function openStoryDetail(id) {
  const stories = DB.getStories();
  const s = stories.find(x => x.id === id);
  if (!s) return;
  const user = DB.currentUser();
  const liked = user && s.likedBy.includes(user.id);
  const content = document.getElementById('story-detail-content');
  content.innerHTML = `
    ${s.image ? `<img src="${s.image}" alt="${s.title}" class="detail-hero-img">` : ''}
    <div class="detail-body">
      <div class="story-meta-top" style="margin-bottom:12px;">
        <span class="story-category-tag">${s.category}</span>
        <span class="story-time">${timeSince(s.date)}</span>
      </div>
      <h2 class="detail-title">${s.title}</h2>
      <p class="story-destination-tag">📍 ${s.destination}</p>
      <div class="detail-author">
        <span class="author-avatar">${s.avatar}</span>
        <div><span class="author-name">${s.author}</span><br><span style="font-size:0.72rem;color:var(--muted);">Traveller</span></div>
      </div>
      <div class="detail-text">${s.body.split('\n').map(p => `<p>${p}</p>`).join('')}</div>
      ${s.tags.length ? `<div class="detail-tags">${s.tags.map(t => `<span class="tag">#${t}</span>`).join('')}</div>` : ''}
      <div class="detail-actions">
        <button class="story-like-btn ${liked ? 'liked' : ''}" id="detail-like" data-id="${s.id}">
          ${liked ? '♥' : '♡'} <span>${s.likes}</span> likes
        </button>
        <a href="flights.html?dest=${encodeURIComponent(s.destination)}" class="btn btn-fill" style="padding:10px 24px;font-size:0.75rem;">✈ Book Flight to ${s.destination.split(',')[0]}</a>
      </div>
      <div class="comments-section">
        <h4>Comments (${s.comments.length})</h4>
        <div id="comments-list">
          ${s.comments.map(c => `
            <div class="comment">
              <span class="author-avatar" style="font-size:0.75rem;width:28px;height:28px;">${c.avatar}</span>
              <div><span class="author-name">${c.author}</span><p>${c.text}</p></div>
            </div>
          `).join('')}
        </div>
        <div class="comment-form">
          <input type="text" id="comment-input" placeholder="Add a comment…" />
          <button class="btn btn-fill" id="post-comment" style="padding:10px 20px;font-size:0.75rem;">Post</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('detail-like').addEventListener('click', (e) => {
    const result = DB.likeStory(s.id);
    if (!result.ok) { alert(result.msg); return; }
    const btn = e.currentTarget;
    btn.classList.toggle('liked', result.liked);
    btn.querySelector('span').textContent = result.likes;
    btn.firstChild.textContent = result.liked ? '♥' : '♡';
  });

  document.getElementById('post-comment').addEventListener('click', () => {
    const text = document.getElementById('comment-input').value.trim();
    if (!text) return;
    const result = DB.addComment(s.id, text);
    if (!result.ok) { alert(result.msg); return; }
    const list = document.getElementById('comments-list');
    const div = document.createElement('div');
    div.className = 'comment';
    div.innerHTML = `<span class="author-avatar" style="font-size:0.75rem;width:28px;height:28px;">${result.comment.avatar}</span><div><span class="author-name">${result.comment.author}</span><p>${result.comment.text}</p></div>`;
    list.appendChild(div);
    document.getElementById('comment-input').value = '';
  });

  document.getElementById('story-detail-modal').classList.add('open');
}

// Modal controls
document.getElementById('open-story-modal').addEventListener('click', () => {
  if (!DB.currentUser()) { window.location.href = 'auth.html'; return; }
  document.getElementById('story-modal').classList.add('open');
});
document.getElementById('close-story-modal').addEventListener('click', () => document.getElementById('story-modal').classList.remove('open'));
document.getElementById('close-detail-modal').addEventListener('click', () => document.getElementById('story-detail-modal').classList.remove('open'));
document.querySelectorAll('.modal-overlay').forEach(o => o.addEventListener('click', (e) => { if (e.target === o) o.classList.remove('open'); }));

// Submit story
document.getElementById('submit-story').addEventListener('click', () => {
  const title = document.getElementById('story-title').value.trim();
  const dest = document.getElementById('story-dest').value.trim();
  const cat = document.getElementById('story-cat').value;
  const body = document.getElementById('story-body').value.trim();
  const image = document.getElementById('story-image').value.trim();
  const tags = document.getElementById('story-tags').value.split(',').map(t => t.trim()).filter(Boolean);
  const msg = document.getElementById('story-msg');

  if (!title || !dest || !body) {
    msg.style.display = 'block'; msg.style.color = 'var(--accent)'; msg.textContent = 'Please fill in Title, Destination and Story.'; return;
  }
  const result = DB.addStory({ title, destination: dest, category: cat, body, image, tags });
  if (!result.ok) { msg.style.display = 'block'; msg.style.color = 'var(--accent)'; msg.textContent = result.msg; return; }
  document.getElementById('story-modal').classList.remove('open');
  ['story-title','story-dest','story-body','story-image','story-tags'].forEach(id => document.getElementById(id).value = '');
  renderStories();
});

// Filters
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderStories();
  });
});

renderStories();