// ============================================================
// Wanderlust — db.js  (localStorage-based data layer)
// ============================================================

const DB = {
  // ── helpers ────────────────────────────────────────────────
  _get(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; }
    catch { return []; }
  },
  _set(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  },
  _id() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  },

  // ── Auth ───────────────────────────────────────────────────
  registerUser({ name, email, password }) {
    const users = this._get('wl_users');
    if (users.find(u => u.email === email)) return { ok: false, msg: 'Email already registered.' };
    const user = { id: this._id(), name, email, password, avatar: name.charAt(0).toUpperCase(), joined: new Date().toISOString() };
    users.push(user);
    this._set('wl_users', users);
    this._set('wl_session', user);
    return { ok: true, user };
  },
  loginUser({ email, password }) {
    const users = this._get('wl_users');
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return { ok: false, msg: 'Invalid email or password.' };
    this._set('wl_session', user);
    return { ok: true, user };
  },
  logout() { localStorage.removeItem('wl_session'); },
  currentUser() {
    try { return JSON.parse(localStorage.getItem('wl_session')) || null; }
    catch { return null; }
  },

  // ── Stories ────────────────────────────────────────────────
  addStory({ title, destination, category, body, image, tags }) {
    const user = this.currentUser();
    if (!user) return { ok: false, msg: 'Please sign in.' };
    const stories = this._get('wl_stories');
    const story = {
      id: this._id(), title, destination, category, body, image: image || '', tags: tags || [],
      author: user.name, authorId: user.id, avatar: user.avatar,
      date: new Date().toISOString(), likes: 0, likedBy: [], comments: []
    };
    stories.unshift(story);
    this._set('wl_stories', stories);
    return { ok: true, story };
  },
  getStories(filter = {}) {
    let s = this._get('wl_stories');
    if (filter.category) s = s.filter(x => x.category === filter.category);
    if (filter.destination) s = s.filter(x => x.destination.toLowerCase().includes(filter.destination.toLowerCase()));
    return s;
  },
  likeStory(id) {
    const user = this.currentUser();
    if (!user) return { ok: false, msg: 'Please sign in.' };
    const stories = this._get('wl_stories');
    const s = stories.find(x => x.id === id);
    if (!s) return { ok: false };
    if (s.likedBy.includes(user.id)) {
      s.likes--; s.likedBy = s.likedBy.filter(x => x !== user.id);
    } else {
      s.likes++; s.likedBy.push(user.id);
    }
    this._set('wl_stories', stories);
    return { ok: true, likes: s.likes, liked: s.likedBy.includes(user.id) };
  },
  addComment(storyId, text) {
    const user = this.currentUser();
    if (!user) return { ok: false, msg: 'Please sign in.' };
    const stories = this._get('wl_stories');
    const s = stories.find(x => x.id === storyId);
    if (!s) return { ok: false };
    const comment = { id: this._id(), text, author: user.name, avatar: user.avatar, date: new Date().toISOString() };
    s.comments.push(comment);
    this._set('wl_stories', stories);
    return { ok: true, comment };
  },

  // ── Experiences ────────────────────────────────────────────
  addExperience({ destination, category, rating, title, body, tips, image }) {
    const user = this.currentUser();
    if (!user) return { ok: false, msg: 'Please sign in.' };
    const exps = this._get('wl_experiences');
    const exp = {
      id: this._id(), destination, category, rating: Number(rating), title, body, tips: tips || '',
      image: image || '', author: user.name, authorId: user.id, avatar: user.avatar,
      date: new Date().toISOString(), helpful: 0, helpfulBy: []
    };
    exps.unshift(exp);
    this._set('wl_experiences', exps);
    return { ok: true, exp };
  },
  getExperiences(filter = {}) {
    let e = this._get('wl_experiences');
    if (filter.destination) e = e.filter(x => x.destination.toLowerCase().includes(filter.destination.toLowerCase()));
    if (filter.category) e = e.filter(x => x.category === filter.category);
    return e;
  },
  markHelpful(id) {
    const user = this.currentUser();
    if (!user) return { ok: false, msg: 'Please sign in.' };
    const exps = this._get('wl_experiences');
    const e = exps.find(x => x.id === id);
    if (!e) return { ok: false };
    if (e.helpfulBy.includes(user.id)) {
      e.helpful--; e.helpfulBy = e.helpfulBy.filter(x => x !== user.id);
    } else {
      e.helpful++; e.helpfulBy.push(user.id);
    }
    this._set('wl_experiences', exps);
    return { ok: true, helpful: e.helpful };
  },

  // ── Ratings ────────────────────────────────────────────────
  rateDestination(destinationName, score) {
    const user = this.currentUser();
    if (!user) return { ok: false, msg: 'Please sign in.' };
    const ratings = this._get('wl_ratings');
    const existing = ratings.find(r => r.dest === destinationName && r.userId === user.id);
    if (existing) { existing.score = score; }
    else { ratings.push({ id: this._id(), dest: destinationName, userId: user.id, score }); }
    this._set('wl_ratings', ratings);
    return { ok: true };
  },
  getAvgRating(destinationName, baseRating) {
    const ratings = this._get('wl_ratings').filter(r => r.dest === destinationName);
    if (!ratings.length) return baseRating;
    const total = ratings.reduce((sum, r) => sum + r.score, 0);
    const combined = (baseRating * 10 + total) / (10 + ratings.length);
    return Math.round(combined * 10) / 10;
  },

  // ── Bookmarks ──────────────────────────────────────────────
  toggleBookmark(place) {
    const user = this.currentUser();
    if (!user) return { ok: false, msg: 'Please sign in.' };
    const key = `wl_bookmarks_${user.id}`;
    const bm = this._get(key);
    const idx = bm.findIndex(b => b.name === place.name);
    if (idx > -1) { bm.splice(idx, 1); this._set(key, bm); return { ok: true, saved: false }; }
    bm.push({ ...place, savedAt: new Date().toISOString() });
    this._set(key, bm);
    return { ok: true, saved: true };
  },
  getBookmarks() {
    const user = this.currentUser();
    if (!user) return [];
    return this._get(`wl_bookmarks_${user.id}`);
  },
  isBookmarked(name) {
    const user = this.currentUser();
    if (!user) return false;
    return this._get(`wl_bookmarks_${user.id}`).some(b => b.name === name);
  },

  // ── seed demo data ─────────────────────────────────────────
  seed() {
    if (this._get('wl_seeded').length) return;
    const demoStories = [
      { title: "Two Weeks in Kyoto Changed My Life", destination: "Kyoto, Japan", category: "cities", body: "I arrived expecting temples and found something far more profound — a city that moves at its own tempo, unhurried and deeply intentional. The moss gardens of Ryoan-ji, the pre-dawn walk to Fushimi Inari, the particular silence of a late evening in Gion. Every morning I woke to the smell of incense and the distant clang of a temple bell. There is a word in Japanese — 'ma' — meaning the pause between moments. Kyoto taught me to live in that pause.", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80", tags: ["culture", "temples", "japan"], author: "Elena Marchetti", authorId: "demo1", avatar: "E", date: "2024-11-12T10:30:00Z", likes: 47, likedBy: [], comments: [{ id: "c1", text: "This is exactly how I felt! The ma concept really resonated with me.", author: "James K.", avatar: "J", date: "2024-11-13T08:00:00Z" }] },
      { title: "Crossing the Sahara on Camelback", destination: "Merzouga, Morocco", category: "deserts", body: "We left at 4am. By the time the sun broke the horizon, we were deep enough in the dunes that no road, no building, nothing man-made was visible in any direction. My guide Ahmed had crossed these dunes hundreds of times and still he paused, looked around, and said quietly: 'beautiful'. That word, offered with such ease by someone who had every reason to take it for granted, stayed with me the entire trip home.", image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80", tags: ["desert", "adventure", "morocco"], author: "Thomas Weber", authorId: "demo2", avatar: "T", date: "2024-10-05T14:00:00Z", likes: 63, likedBy: [], comments: [] },
      { title: "Getting Lost in Hallstatt's Silence", destination: "Hallstatt, Austria", category: "villages", body: "I'd seen the photos a thousand times — so perfect they looked fake. Standing there, I understood why photographers return again and again. The lake is that colour. The mountains are that close. The stillness is real. I stayed three nights instead of one. By the second morning I knew the baker's name and the route the mail boat takes. Slow travel isn't a strategy — it's what happens when a place won't let you rush.", image: "images/villages.jpg", tags: ["village", "lakes", "austria"], author: "Sophie Andersen", authorId: "demo3", avatar: "S", date: "2024-09-18T09:00:00Z", likes: 38, likedBy: [], comments: [] },
    ];
    const demoExperiences = [
      { destination: "Bali, Indonesia", category: "islands", rating: 5, title: "Ubud Rice Terrace Sunrise Trek", body: "We set off at 5am with a local guide through the Tegalalang rice terraces. The light at dawn is unlike anything I've photographed — layered greens turning gold. Worth every early alarm.", tips: "Book a local guide (not a resort tour), wear proper shoes, carry a rain layer — weather changes fast.", image: "images/bali.webp", author: "Marco Rossi", authorId: "demo4", avatar: "M", date: "2024-12-01T08:00:00Z", helpful: 29, helpfulBy: [] },
      { destination: "Santorini, Greece", category: "islands", rating: 4, title: "Caldera Sunset from Oia — Tips to Avoid Crowds", body: "The sunset is real and worth it, but everyone knows about it. Arrive at the main viewpoint by 5pm or accept that you'll be watching from three rows back. Better tip: walk 10 minutes north of the main square for a less crowded but equally beautiful view.", tips: "Arrive early. Walk north of the main square. Bring a light jacket — it gets cold fast once the sun drops.", image: "images/santorini.webp", author: "Laila Hassan", authorId: "demo5", avatar: "L", date: "2024-11-20T16:00:00Z", helpful: 41, helpfulBy: [] },
      { destination: "Marrakech, Morocco", category: "cities", rating: 5, title: "Navigating the Medina — What No One Tells You", body: "The medina is intentionally maze-like. Don't fight it. Put your phone away, say yes to the wrong turns, and let yourself get briefly lost. The best carpet shop I found was down an alley I entered by mistake. Budget three hours minimum and bring cash in small denominations.", tips: "Learn three phrases in Darija. Walk confidently — hesitation attracts touts. The riad alleys south of the Bahia Palace are quieter and equally beautiful.", image: "images/morocco.jpg", author: "Priya Nair", authorId: "demo6", avatar: "P", date: "2024-10-28T11:00:00Z", helpful: 55, helpfulBy: [] },
    ];
    const stories = this._get('wl_stories');
    demoStories.forEach(s => { s.id = this._id(); stories.push(s); });
    this._set('wl_stories', stories);
    const exps = this._get('wl_experiences');
    demoExperiences.forEach(e => { e.id = this._id(); exps.push(e); });
    this._set('wl_experiences', exps);
    this._set('wl_seeded', ['done']);
  }
};

// Auto-seed on load
DB.seed();