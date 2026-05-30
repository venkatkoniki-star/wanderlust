// nav.js — updates nav based on auth state on every page

(function updateNav() {
  const user = DB.currentUser();
  const authDiv = document.querySelector('.nav-auth');
  if (!authDiv) return;
  if (user) {
    authDiv.innerHTML = `
      <a href="experiences.html" class="btn btn-outline">Experiences</a>
      <a href="stories.html" class="btn btn-outline">Stories</a>
      <div class="nav-user-menu" style="position:relative;display:inline-block;">
        <button class="nav-avatar" style="width:38px;height:38px;border-radius:50%;background:var(--accent);color:#fff;border:none;cursor:pointer;font-family:'Jost',sans-serif;font-size:0.9rem;font-weight:500;">${user.avatar}</button>
        <div class="nav-dropdown" style="display:none;position:absolute;right:0;top:48px;background:var(--card-bg);border:1px solid rgba(28,24,20,0.1);border-radius:6px;min-width:160px;box-shadow:0 8px 24px rgba(0,0,0,0.1);z-index:200;padding:8px 0;">
          <div style="padding:12px 16px 8px;font-size:0.8rem;color:var(--muted);border-bottom:1px solid rgba(28,24,20,0.07);margin-bottom:4px;">${user.name}</div>
          <a href="flights.html" style="display:block;padding:9px 16px;font-size:0.8rem;text-decoration:none;color:var(--text);transition:background 0.15s;" onmouseover="this.style.background='rgba(184,92,56,0.06)'" onmouseout="this.style.background=''">✈ Book Flights</a>
          <a href="stories.html" style="display:block;padding:9px 16px;font-size:0.8rem;text-decoration:none;color:var(--text);transition:background 0.15s;" onmouseover="this.style.background='rgba(184,92,56,0.06)'" onmouseout="this.style.background=''">📖 My Stories</a>
          <a href="#" id="nav-logout" style="display:block;padding:9px 16px;font-size:0.8rem;text-decoration:none;color:var(--accent);transition:background 0.15s;" onmouseover="this.style.background='rgba(184,92,56,0.06)'" onmouseout="this.style.background=''">Sign Out</a>
        </div>
      </div>
    `;
    const avatar = authDiv.querySelector('.nav-avatar');
    const dropdown = authDiv.querySelector('.nav-dropdown');
    avatar.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    });
    document.addEventListener('click', () => { dropdown.style.display = 'none'; });
    document.getElementById('nav-logout').addEventListener('click', (e) => {
      e.preventDefault(); DB.logout(); window.location.reload();
    });
  } else {
    authDiv.innerHTML = `
      <a href="auth.html" class="btn btn-outline">Sign In</a>
      <a href="auth.html?mode=signup" class="btn btn-fill">Sign Up</a>
    `;
  }
})();