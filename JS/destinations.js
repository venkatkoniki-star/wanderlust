const categories = [
  { name: "Cities", slug: "cities", description: "Urban energy & timeless architecture", image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80" },
  { name: "Beaches", slug: "beaches", description: "Sun, sand & turquoise serenity", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80" },
  { name: "Villages", slug: "villages", description: "Quiet charm & living tradition", image: "images/villages.jpg" },
  { name: "Museums", slug: "museums", description: "Culture, history & human genius", image: "images/museum.webp" },
  { name: "Forests", slug: "forests", description: "Ancient green cathedrals of life", image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80" },
  { name: "Mountains", slug: "mountains", description: "Adventure, altitude & awe", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80" },
  { name: "Islands", slug: "islands", description: "Remote shores & island escapes", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80" },
  { name: "Deserts", slug: "deserts", description: "Vast silence & star-filled skies", image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80" },
];

const container = document.getElementById("destinations-menu");

categories.forEach(cat => {
  const card = document.createElement("a");
  card.classList.add("destination-card");
  card.href = `listing.html?category=${cat.slug}`;

  card.innerHTML = `
    <img src="${cat.image}" alt="${cat.name}" class="card-img" loading="lazy">
    <div class="card-overlay">
      <div class="card-body">
        <h3 class="card-name">${cat.name}</h3>
        <p class="card-desc">${cat.description}</p>
      </div>
    </div>
  `;

  container.appendChild(card);
});
