// flights.js — Amadeus Flight Search

// ─── Airport data (top 80 airports) ──────────────────────────
const AIRPORTS = [
  { iata: 'DEL', name: 'Indira Gandhi International', city: 'New Delhi', country: 'India' },
  { iata: 'BOM', name: 'Chhatrapati Shivaji Maharaj', city: 'Mumbai', country: 'India' },
  { iata: 'BLR', name: 'Kempegowda International', city: 'Bengaluru', country: 'India' },
  { iata: 'MAA', name: 'Chennai International', city: 'Chennai', country: 'India' },
  { iata: 'HYD', name: 'Rajiv Gandhi International', city: 'Hyderabad', country: 'India' },
  { iata: 'CCU', name: 'Netaji Subhas Chandra Bose', city: 'Kolkata', country: 'India' },
  { iata: 'COK', name: 'Cochin International', city: 'Kochi', country: 'India' },
  { iata: 'AMD', name: 'Sardar Vallabhbhai Patel', city: 'Ahmedabad', country: 'India' },
  { iata: 'PNQ', name: 'Pune Airport', city: 'Pune', country: 'India' },
  { iata: 'GOI', name: 'Dabolim Airport', city: 'Goa', country: 'India' },
  { iata: 'LHR', name: 'Heathrow', city: 'London', country: 'UK' },
  { iata: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'France' },
  { iata: 'JFK', name: 'John F. Kennedy', city: 'New York', country: 'USA' },
  { iata: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'USA' },
  { iata: 'DXB', name: 'Dubai International', city: 'Dubai', country: 'UAE' },
  { iata: 'SIN', name: 'Changi Airport', city: 'Singapore', country: 'Singapore' },
  { iata: 'NRT', name: 'Narita International', city: 'Tokyo', country: 'Japan' },
  { iata: 'HND', name: 'Haneda Airport', city: 'Tokyo', country: 'Japan' },
  { iata: 'SYD', name: 'Kingsford Smith', city: 'Sydney', country: 'Australia' },
  { iata: 'MEL', name: 'Melbourne Airport', city: 'Melbourne', country: 'Australia' },
  { iata: 'DPS', name: 'Ngurah Rai International', city: 'Bali', country: 'Indonesia' },
  { iata: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand' },
  { iata: 'KUL', name: 'Kuala Lumpur International', city: 'Kuala Lumpur', country: 'Malaysia' },
  { iata: 'HKG', name: 'Hong Kong International', city: 'Hong Kong', country: 'China' },
  { iata: 'PEK', name: 'Beijing Capital International', city: 'Beijing', country: 'China' },
  { iata: 'PVG', name: 'Pudong International', city: 'Shanghai', country: 'China' },
  { iata: 'ICN', name: 'Incheon International', city: 'Seoul', country: 'South Korea' },
  { iata: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey' },
  { iata: 'FCO', name: 'Leonardo da Vinci', city: 'Rome', country: 'Italy' },
  { iata: 'BCN', name: 'Barcelona El Prat', city: 'Barcelona', country: 'Spain' },
  { iata: 'AMS', name: 'Amsterdam Schiphol', city: 'Amsterdam', country: 'Netherlands' },
  { iata: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany' },
  { iata: 'ZRH', name: 'Zurich Airport', city: 'Zurich', country: 'Switzerland' },
  { iata: 'VIE', name: 'Vienna International', city: 'Vienna', country: 'Austria' },
  { iata: 'PRG', name: 'Václav Havel Airport', city: 'Prague', country: 'Czech Republic' },
  { iata: 'CPH', name: 'Copenhagen Airport', city: 'Copenhagen', country: 'Denmark' },
  { iata: 'ARN', name: 'Stockholm Arlanda', city: 'Stockholm', country: 'Sweden' },
  { iata: 'OSL', name: 'Oslo Gardermoen', city: 'Oslo', country: 'Norway' },
  { iata: 'HEL', name: 'Helsinki Airport', city: 'Helsinki', country: 'Finland' },
  { iata: 'MAD', name: 'Adolfo Suárez Barajas', city: 'Madrid', country: 'Spain' },
  { iata: 'MXP', name: 'Malpensa Airport', city: 'Milan', country: 'Italy' },
  { iata: 'ATH', name: 'Athens International', city: 'Athens', country: 'Greece' },
  { iata: 'JTR', name: 'Santorini Airport', city: 'Santorini', country: 'Greece' },
  { iata: 'RAK', name: 'Marrakech Menara', city: 'Marrakech', country: 'Morocco' },
  { iata: 'CAI', name: 'Cairo International', city: 'Cairo', country: 'Egypt' },
  { iata: 'JNB', name: 'O.R. Tambo International', city: 'Johannesburg', country: 'South Africa' },
  { iata: 'CPT', name: 'Cape Town International', city: 'Cape Town', country: 'South Africa' },
  { iata: 'NBO', name: 'Jomo Kenyatta International', city: 'Nairobi', country: 'Kenya' },
  { iata: 'MLE', name: 'Velana International', city: 'Malé', country: 'Maldives' },
  { iata: 'KTM', name: 'Tribhuvan International', city: 'Kathmandu', country: 'Nepal' },
  { iata: 'CMB', name: 'Bandaranaike International', city: 'Colombo', country: 'Sri Lanka' },
  { iata: 'DAC', name: 'Hazrat Shahjalal International', city: 'Dhaka', country: 'Bangladesh' },
  { iata: 'KHI', name: 'Jinnah International', city: 'Karachi', country: 'Pakistan' },
  { iata: 'GRU', name: 'Guarulhos International', city: 'São Paulo', country: 'Brazil' },
  { iata: 'GIG', name: 'Rio de Janeiro Galeão', city: 'Rio de Janeiro', country: 'Brazil' },
  { iata: 'BOG', name: 'El Dorado International', city: 'Bogotá', country: 'Colombia' },
  { iata: 'LIM', name: 'Jorge Chávez International', city: 'Lima', country: 'Peru' },
  { iata: 'EZE', name: 'Ministro Pistarini', city: 'Buenos Aires', country: 'Argentina' },
  { iata: 'MEX', name: 'Benito Juárez International', city: 'Mexico City', country: 'Mexico' },
  { iata: 'YYZ', name: 'Toronto Pearson', city: 'Toronto', country: 'Canada' },
  { iata: 'YVR', name: 'Vancouver International', city: 'Vancouver', country: 'Canada' },
  { iata: 'ORD', name: "O'Hare International", city: 'Chicago', country: 'USA' },
  { iata: 'MIA', name: 'Miami International', city: 'Miami', country: 'USA' },
  { iata: 'SFO', name: 'San Francisco International', city: 'San Francisco', country: 'USA' },
  { iata: 'KEF', name: 'Keflavík International', city: 'Reykjavik', country: 'Iceland' },
  { iata: 'AMM', name: 'Queen Alia International', city: 'Amman', country: 'Jordan' },
  { iata: 'TLV', name: 'Ben Gurion International', city: 'Tel Aviv', country: 'Israel' },
  { iata: 'DOH', name: 'Hamad International', city: 'Doha', country: 'Qatar' },
  { iata: 'AUH', name: 'Abu Dhabi International', city: 'Abu Dhabi', country: 'UAE' },
  { iata: 'MNL', name: 'Ninoy Aquino International', city: 'Manila', country: 'Philippines' },
  { iata: 'CGK', name: 'Soekarno-Hatta International', city: 'Jakarta', country: 'Indonesia' },
  { iata: 'SGN', name: 'Tan Son Nhat International', city: 'Ho Chi Minh City', country: 'Vietnam' },
  { iata: 'HAN', name: 'Noi Bai International', city: 'Hanoi', country: 'Vietnam' },
  { iata: 'RGN', name: 'Yangon International', city: 'Yangon', country: 'Myanmar' },
  { iata: 'PPS', name: 'Puerto Princesa Airport', city: 'Palawan', country: 'Philippines' },
];

// ─── Popular routes ───────────────────────────────────────────
const POPULAR_ROUTES = [
  { from: 'DEL', fromCity: 'New Delhi', to: 'DPS', toCity: 'Bali', price: '~₹18,000' },
  { from: 'BOM', fromCity: 'Mumbai', to: 'DXB', toCity: 'Dubai', price: '~₹8,500' },
  { from: 'DEL', fromCity: 'New Delhi', to: 'LHR', toCity: 'London', price: '~₹42,000' },
  { from: 'BLR', fromCity: 'Bengaluru', to: 'SIN', toCity: 'Singapore', price: '~₹12,000' },
  { from: 'DEL', fromCity: 'New Delhi', to: 'NRT', toCity: 'Tokyo', price: '~₹28,000' },
  { from: 'BOM', fromCity: 'Mumbai', to: 'MLE', toCity: 'Maldives', price: '~₹9,000' },
  { from: 'DEL', fromCity: 'New Delhi', to: 'CDG', toCity: 'Paris', price: '~₹38,000' },
  { from: 'MAA', fromCity: 'Chennai', to: 'CMB', toCity: 'Colombo', price: '~₹5,500' },
];

// ─── State ────────────────────────────────────────────────────
let tripType = 'one-way';
let amadeusToken = null;
let tokenExpiry = 0;
let lastResults = [];

// ─── API credentials ──────────────────────────────────────────
function getCredentials() {
  return {
    clientId: localStorage.getItem('wl_amadeus_id') || '',
    clientSecret: localStorage.getItem('wl_amadeus_secret') || '',
  };
}
function hasCredentials() {
  const { clientId, clientSecret } = getCredentials();
  return clientId && clientSecret;
}
function updateApiNotice() {
  document.getElementById('api-notice').style.display = hasCredentials() ? 'none' : 'block';
}

// ─── Amadeus Auth ─────────────────────────────────────────────
async function getAmadeusToken() {
  if (amadeusToken && Date.now() < tokenExpiry) return amadeusToken;
  const { clientId, clientSecret } = getCredentials();
  if (!clientId || !clientSecret) throw new Error('No API credentials. Please configure Amadeus API.');
  const resp = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=client_credentials&client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}`
  });
  if (!resp.ok) throw new Error('Authentication failed. Check your API credentials.');
  const data = await resp.json();
  amadeusToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
  return amadeusToken;
}

// ─── Flight Search ────────────────────────────────────────────
async function searchFlights() {
  const fromIata = document.getElementById('from-iata').value.trim().toUpperCase();
  const toIata = document.getElementById('to-iata').value.trim().toUpperCase();
  const depart = document.getElementById('depart-date').value;
  const returnDate = document.getElementById('return-date').value;
  const adults = document.getElementById('passengers').value;
  const cabin = document.getElementById('cabin-class').value;

  // Validate
  if (!fromIata || fromIata.length !== 3) { showError('Please select a valid departure airport.'); return; }
  if (!toIata || toIata.length !== 3) { showError('Please select a valid destination airport.'); return; }
  if (!depart) { showError('Please select a departure date.'); return; }
  if (tripType === 'round-trip' && !returnDate) { showError('Please select a return date.'); return; }
  if (fromIata === toIata) { showError('Departure and destination airports cannot be the same.'); return; }

  hideError();
  setSearching(true);

  try {
    const token = await getAmadeusToken();
    let url = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${fromIata}&destinationLocationCode=${toIata}&departureDate=${depart}&adults=${adults}&travelClass=${cabin}&nonStop=false&max=15&currencyCode=INR`;
    if (tripType === 'round-trip' && returnDate) url += `&returnDate=${returnDate}`;

    const resp = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!resp.ok) {
      const err = await resp.json();
      throw new Error(err.errors?.[0]?.detail || 'Search failed. Please try again.');
    }
    const data = await resp.json();
    lastResults = data.data || [];
    renderResults(lastResults, fromIata, toIata, depart);
  } catch (err) {
    showError(err.message);
  } finally {
    setSearching(false);
  }
}

function renderResults(flights, from, to, date) {
  const section = document.getElementById('results-section');
  const list = document.getElementById('flights-list');
  const noFlights = document.getElementById('no-flights');
  const title = document.getElementById('results-title');

  const fromAirport = AIRPORTS.find(a => a.iata === from);
  const toAirport = AIRPORTS.find(a => a.iata === to);
  title.innerHTML = `<em>${fromAirport ? fromAirport.city : from}</em> → <em>${toAirport ? toAirport.city : to}</em> &nbsp;·&nbsp; ${formatDate(date)} &nbsp;·&nbsp; ${flights.length} flights found`;

  section.style.display = 'block';
  list.innerHTML = '';

  if (!flights.length) { noFlights.style.display = 'block'; return; }
  noFlights.style.display = 'none';

  flights.forEach((offer, i) => {
    const itinerary = offer.itineraries[0];
    const segments = itinerary.segments;
    const firstSeg = segments[0];
    const lastSeg = segments[segments.length - 1];
    const stops = segments.length - 1;
    const duration = formatDuration(itinerary.duration);
    const price = offer.price.total;
    const currency = offer.price.currency;
    const airline = firstSeg.carrierCode;
    const flightNum = `${firstSeg.carrierCode}${firstSeg.number}`;
    const depTime = formatTime(firstSeg.departure.at);
    const arrTime = formatTime(lastSeg.arrival.at);
    const depDate = formatDate(firstSeg.departure.at);

    const card = document.createElement('div');
    card.className = 'flight-card';
    card.style.animationDelay = `${0.04 * i}s`;
    card.innerHTML = `
      <div class="flight-card-inner">
        <div class="flight-airline">
          <div class="airline-logo">${airline}</div>
          <div>
            <span class="flight-number">${flightNum}</span>
            <span class="flight-cabin">${offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin || ''}</span>
          </div>
        </div>
        <div class="flight-route">
          <div class="flight-time-block">
            <span class="flight-time">${depTime}</span>
            <span class="flight-iata">${firstSeg.departure.iataCode}</span>
            <span class="flight-date-small">${depDate}</span>
          </div>
          <div class="flight-duration-block">
            <span class="flight-duration">${duration}</span>
            <div class="flight-line">
              <span class="flight-dot"></span>
              <span class="flight-dash"></span>
              ${stops > 0 ? `<span class="stop-dot" title="${stops} stop${stops > 1 ? 's' : ''}"></span><span class="flight-dash"></span>` : ''}
              <span class="flight-plane">✈</span>
            </div>
            <span class="flight-stops ${stops === 0 ? 'nonstop' : ''}">${stops === 0 ? 'Non-stop' : stops + ' stop' + (stops > 1 ? 's' : '')}</span>
          </div>
          <div class="flight-time-block">
            <span class="flight-time">${arrTime}</span>
            <span class="flight-iata">${lastSeg.arrival.iataCode}</span>
          </div>
        </div>
        <div class="flight-price-block">
          <span class="flight-price">${currency === 'INR' ? '₹' : currency + ' '}${Number(price).toLocaleString('en-IN')}</span>
          <span class="flight-price-note">per person</span>
          <button class="btn btn-fill flight-book-btn" onclick="bookFlight('${offer.id}', '${from}', '${to}', '${price}', '${currency}')">Select</button>
        </div>
      </div>
      ${stops > 0 ? `<div class="flight-stops-detail">${segments.map((seg, si) => si < segments.length - 1 ? `<span>Stop: ${seg.arrival.iataCode} (${formatDuration(seg.duration)})</span>` : '').join('')}</div>` : ''}
    `;
    list.appendChild(card);
  });
}

function bookFlight(offerId, from, to, price, currency) {
  const user = DB.currentUser();
  if (!user) { window.location.href = 'auth.html'; return; }
  // Save booking to localStorage
  const bookings = JSON.parse(localStorage.getItem('wl_bookings') || '[]');
  bookings.push({ id: offerId, from, to, price, currency, userId: user.id, date: new Date().toISOString() });
  localStorage.setItem('wl_bookings', JSON.stringify(bookings));
  // Show confirmation
  showBookingConfirmation(from, to, price, currency);
}

function showBookingConfirmation(from, to, price, currency) {
  const fromAirport = AIRPORTS.find(a => a.iata === from);
  const toAirport = AIRPORTS.find(a => a.iata === to);
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay open booking-confirm';
  overlay.innerHTML = `
    <div class="modal" style="text-align:center;padding:48px 40px;max-width:480px;">
      <div style="font-size:3rem;margin-bottom:16px;">✈️</div>
      <h3 class="modal-title">Flight Selected!</h3>
      <p style="color:var(--muted);margin:12px 0 24px;line-height:1.7;">
        <strong>${fromAirport?.city || from} → ${toAirport?.city || to}</strong><br>
        ${currency === 'INR' ? '₹' : currency + ' '}${Number(price).toLocaleString('en-IN')} per person
      </p>
      <p style="font-size:0.82rem;color:var(--muted);background:rgba(184,92,56,0.06);padding:12px;border-radius:6px;margin-bottom:24px;">
        This is a demo booking. In production, this would redirect to Amadeus' booking flow or your preferred airline's payment page.
      </p>
      <button class="btn btn-fill" onclick="this.closest('.modal-overlay').remove()">Done</button>
    </div>
  `;
  document.body.appendChild(overlay);
}

// ─── Sorting ──────────────────────────────────────────────────
document.getElementById('sort-select').addEventListener('change', (e) => {
  const sorted = [...lastResults].sort((a, b) => {
    if (e.target.value === 'price') return parseFloat(a.price.total) - parseFloat(b.price.total);
    const durA = parseDuration(a.itineraries[0].duration);
    const durB = parseDuration(b.itineraries[0].duration);
    return durA - durB;
  });
  renderResults(sorted, document.getElementById('from-iata').value, document.getElementById('to-iata').value, document.getElementById('depart-date').value);
});

// ─── Airport Autocomplete ─────────────────────────────────────
function setupAutocomplete(inputId, hiddenId, suggestionsId) {
  const input = document.getElementById(inputId);
  const hidden = document.getElementById(hiddenId);
  const suggestions = document.getElementById(suggestionsId);

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase();
    suggestions.innerHTML = '';
    if (q.length < 1) { suggestions.style.display = 'none'; return; }
    const matches = AIRPORTS.filter(a =>
      a.iata.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q)
    ).slice(0, 6);
    if (!matches.length) { suggestions.style.display = 'none'; return; }
    matches.forEach(a => {
      const div = document.createElement('div');
      div.className = 'suggestion-item';
      div.innerHTML = `<span class="sug-iata">${a.iata}</span><span class="sug-name">${a.city}, ${a.country}</span><span class="sug-full">${a.name}</span>`;
      div.addEventListener('click', () => {
        input.value = `${a.city} (${a.iata})`;
        hidden.value = a.iata;
        suggestions.style.display = 'none';
      });
      suggestions.appendChild(div);
    });
    suggestions.style.display = 'block';
  });

  document.addEventListener('click', (e) => {
    if (!input.contains(e.target)) suggestions.style.display = 'none';
  });
}

setupAutocomplete('from-input', 'from-iata', 'from-suggestions');
setupAutocomplete('to-input', 'to-iata', 'to-suggestions');

// ─── Trip type tabs ───────────────────────────────────────────
document.querySelectorAll('.trip-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.trip-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    tripType = tab.dataset.type;
    document.getElementById('return-group').style.display = tripType === 'round-trip' ? 'block' : 'none';
  });
});

// ─── Swap button ──────────────────────────────────────────────
document.getElementById('swap-btn').addEventListener('click', () => {
  const fromInput = document.getElementById('from-input');
  const toInput = document.getElementById('to-input');
  const fromHidden = document.getElementById('from-iata');
  const toHidden = document.getElementById('to-iata');
  [fromInput.value, toInput.value] = [toInput.value, fromInput.value];
  [fromHidden.value, toHidden.value] = [toHidden.value, fromHidden.value];
});

// ─── Search button ────────────────────────────────────────────
document.getElementById('search-flights-btn').addEventListener('click', searchFlights);

// ─── API Config ───────────────────────────────────────────────
document.getElementById('setup-api-btn').addEventListener('click', () => {
  const { clientId, clientSecret } = getCredentials();
  document.getElementById('amadeus-client-id').value = clientId;
  document.getElementById('amadeus-client-secret').value = clientSecret;
  document.getElementById('api-config-panel').style.display = 'block';
  document.getElementById('api-notice').style.display = 'none';
});
document.getElementById('save-api-btn').addEventListener('click', () => {
  const id = document.getElementById('amadeus-client-id').value.trim();
  const secret = document.getElementById('amadeus-client-secret').value.trim();
  if (!id || !secret) { alert('Please enter both Client ID and Client Secret.'); return; }
  localStorage.setItem('wl_amadeus_id', id);
  localStorage.setItem('wl_amadeus_secret', secret);
  amadeusToken = null;
  document.getElementById('api-config-panel').style.display = 'none';
  updateApiNotice();
  alert('Credentials saved! You can now search for flights.');
});
document.getElementById('cancel-api-btn').addEventListener('click', () => {
  document.getElementById('api-config-panel').style.display = 'none';
  updateApiNotice();
});

// ─── Popular routes ───────────────────────────────────────────
function renderPopularRoutes() {
  const grid = document.getElementById('routes-grid');
  POPULAR_ROUTES.forEach(r => {
    const card = document.createElement('div');
    card.className = 'route-card';
    card.innerHTML = `
      <div class="route-cities">${r.fromCity} <span>→</span> ${r.toCity}</div>
      <div class="route-codes">${r.from} → ${r.to}</div>
      <div class="route-price">${r.price}</div>
    `;
    card.addEventListener('click', () => {
      const fromA = AIRPORTS.find(a => a.iata === r.from);
      const toA = AIRPORTS.find(a => a.iata === r.to);
      if (fromA) { document.getElementById('from-input').value = `${fromA.city} (${fromA.iata})`; document.getElementById('from-iata').value = fromA.iata; }
      if (toA) { document.getElementById('to-input').value = `${toA.city} (${toA.iata})`; document.getElementById('to-iata').value = toA.iata; }
      document.querySelector('.flights-form-card').scrollIntoView({ behavior: 'smooth' });
    });
    grid.appendChild(card);
  });
}

// ─── Helpers ──────────────────────────────────────────────────
function formatTime(dt) {
  return new Date(dt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
}
function formatDate(dt) {
  return new Date(dt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
function formatDuration(iso) {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  const h = m[1] || 0, min = m[2] || 0;
  return h > 0 ? `${h}h ${min}m` : `${min}m`;
}
function parseDuration(iso) {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  return (parseInt(m[1] || 0) * 60) + parseInt(m[2] || 0);
}
function setSearching(val) {
  document.getElementById('search-btn-text').style.display = val ? 'none' : 'inline';
  document.getElementById('search-spinner').style.display = val ? 'inline' : 'none';
  document.getElementById('search-flights-btn').disabled = val;
}
function showError(msg) {
  const el = document.getElementById('flight-error');
  el.textContent = '⚠ ' + msg;
  el.style.display = 'block';
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
function hideError() { document.getElementById('flight-error').style.display = 'none'; }

// ─── Pre-fill from URL params ──────────────────────────────────
const params = new URLSearchParams(window.location.search);
const toIata = params.get('to');
const destName = params.get('dest');
if (toIata) {
  const a = AIRPORTS.find(x => x.iata === toIata);
  if (a) { document.getElementById('to-input').value = `${a.city} (${a.iata})`; document.getElementById('to-iata').value = a.iata; }
} else if (destName) {
  const words = destName.split(',')[0].toLowerCase();
  const a = AIRPORTS.find(x => x.city.toLowerCase().includes(words) || x.name.toLowerCase().includes(words));
  if (a) { document.getElementById('to-input').value = `${a.city} (${a.iata})`; document.getElementById('to-iata').value = a.iata; }
}

// Set min date
const today = new Date().toISOString().split('T')[0];
document.getElementById('depart-date').min = today;
document.getElementById('return-date').min = today;

updateApiNotice();
renderPopularRoutes();