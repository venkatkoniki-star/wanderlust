const categories = [
  {
    name: "Cities",
    description: "Urban energy & architecture",
    image: "https://images.unsplash.com/photo-1494783367193-149034c05e8f"
  },
  {
    name: "Beaches",
    description: "Sun, sand & serenity",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
  },
  {
    name: "Mountains",
    description: "Adventure & altitude",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470"
  },
  {
  name: "Museums",
  description: "Culture & history",
  image: "images/museum.webp"
  },
  {
    name: "Villages",
    description: "Quiet charm & tradition",
    image: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad"
  }
];

const container = document.getElementById("destinations-menu");

categories.forEach(cat => {
  const card = document.createElement("div");
  card.classList.add("destination-card");

  card.innerHTML = `
    <img src="${cat.image}" alt="${cat.name}" class="card-img">
    <div class="card-overlay">
        <div class="card-body">
            <h3 class="card-name">${cat.name}</h3>
            <p class="card-desc">${cat.description}</p>
        </div>
    </div>
  `;

  container.appendChild(card);
});