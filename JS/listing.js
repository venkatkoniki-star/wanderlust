// listing.js

const params = new URLSearchParams(window.location.search);
const category = params.get("category") || "cities";

const header = document.getElementById("listing-title");
const subtitle = document.getElementById("listing-subtitle");
const grid = document.getElementById("places-grid");

const labels = {
  cities:    { title: "Cities",    em: "Cities",    sub: "Explore the world's most captivating urban destinations" },
  beaches:   { title: "Beaches",   em: "Beaches",   sub: "Find your perfect stretch of sand and sea" },
  villages:  { title: "Villages",  em: "Villages",  sub: "Discover the charm of the world's most beautiful villages" },
  museums:   { title: "Museums",   em: "Museums",   sub: "Walk through humanity's greatest collections" },
  forests:   { title: "Forests",   em: "Forests",   sub: "Lose yourself in ancient green wilderness" },
  mountains: { title: "Mountains", em: "Mountains", sub: "Reach for the world's most breathtaking peaks" },
  islands:   { title: "Islands",   em: "Islands",   sub: "Escape to the world's most extraordinary islands" },
  deserts:   { title: "Deserts",   em: "Deserts",   sub: "Explore earth's most dramatic arid landscapes" },
};

const info = labels[category] || labels.cities;
header.innerHTML = `Explore <em>${info.em}</em>`;
subtitle.textContent = info.sub;

function starsHTML(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    '★'.repeat(full) +
    (half ? '½' : '') +
    '☆'.repeat(empty)
  );
}

const places = destinationsData[category] || [];

places.forEach((place, i) => {
  const avgRating = DB.getAvgRating(place.name, place.rating || 4.5);
  const isBookmarked = DB.isBookmarked(place.name);

  const card = document.createElement("div");
  card.classList.add("place-card");
  card.style.animationDelay = `${0.05 * i}s`;

  card.innerHTML = `
    <div class="place-img-wrap">
      <img src="${place.image}" alt="${place.name}" class="place-img" loading="lazy">
      <button class="bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" data-name="${place.name}" title="${isBookmarked ? 'Saved' : 'Save destination'}">
        ${isBookmarked ? '♥' : '♡'}
      </button>
    </div>
    <div class="place-info">
      <h3>${place.name}</h3>
      <span class="place-location">${place.location}</span>
      <div class="place-rating">
        <span class="stars">${starsHTML(avgRating)}</span>
        <span class="rating-num">${avgRating.toFixed(1)}</span>
        <span class="rate-link" data-name="${place.name}" data-base="${place.rating}">Rate this</span>
      </div>
      <p class="place-highlight">${place.highlight}</p>
      <div class="place-meta">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        Best time: ${place.bestTime}
      </div>
      <a href="flights.html?to=${place.iata}&dest=${encodeURIComponent(place.name + ', ' + place.location)}" class="btn btn-fill place-flight-btn">✈ Book a Flight</a>
    </div>
  `;

  // Bookmark
  card.querySelector('.bookmark-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    const result = DB.toggleBookmark({ name: place.name, location: place.location, image: place.image, iata: place.iata, category });
    if (!result.ok) { alert(result.msg); return; }
    const btn = e.currentTarget;
    btn.classList.toggle('bookmarked', result.saved);
    btn.textContent = result.saved ? '♥' : '♡';
  });

  // Rate
  card.querySelector('.rate-link').addEventListener('click', (e) => {
    const user = DB.currentUser();
    if (!user) { alert('Please sign in to rate destinations.'); return; }
    const score = parseFloat(prompt('Rate this destination (1–5):', '5'));
    if (isNaN(score) || score < 1 || score > 5) return;
    DB.rateDestination(place.name, score);
   const newAvg = DB.getAvgRating(place.name, place.rating || 4.5);
    card.querySelector('.stars').textContent = starsHTML(newAvg);
    card.querySelector('.rating-num').textContent = newAvg.toFixed(1);
    e.target.textContent = 'Rated ✓';
  });

  grid.appendChild(card);
});