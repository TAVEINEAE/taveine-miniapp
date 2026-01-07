const modal = document.getElementById("product-modal");
const title = document.getElementById("modal-title");
const price = document.getElementById("modal-price");
const img = document.getElementById("modal-img");

function openProduct(t, p, i) {
  title.textContent = t;
  price.textContent = p;
  img.src = i;
  modal.style.display = "flex";
}

function closeProduct() {
  modal.style.display = "none";
}

function addToCart() {
  alert("Added to cart 🌸");
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function toggleMenu() {
  document.getElementById("side-menu").classList.toggle("active");
}

document.querySelector(".menu-btn").addEventListener("click", toggleMenu);

function toggleSub(id) {
  const block = document.getElementById(id);
  const icon = document.getElementById("icon-" + id);

  if (block.style.display === "block") {
    block.style.display = "none";
    icon.innerText = "+";
  } else {
    block.style.display = "block";
    icon.innerText = "−";
  }

  const products = [
  { name: "Snowfall Serenity", price: "620 AED", img: "p1.jpg", category: "christmas" },
  { name: "Winter Harmony Bowl", price: "580 AED", img: "p2.jpg", category: "christmas" },
  { name: "Golden Pine", price: "640 AED", img: "p3.jpg", category: "christmas" },
  { name: "Evergreen Glow", price: "600 AED", img: "p4.jpg", category: "christmas" },

  { name: "Pink Roses", price: "950 AED", img: "g1.jpg", category: "luxury" },
  { name: "Ivory Roses", price: "950 AED", img: "g2.jpg", category: "luxury" },
  { name: "Lilac Roses", price: "990 AED", img: "g3.jpg", category: "luxury" },
  { name: "Rose Gold", price: "990 AED", img: "g4.jpg", category: "luxury" }
];
  
function renderProducts(category, title) {
  const container = document.getElementById("content");

  const filtered = products.filter(p => p.category === category);

  let html = `<section class="section">
    <h2>${title}</h2>
    <div class="grid">`;

  filtered.forEach(p => {
    html += `
      <div class="grid-card" onclick="openProduct('${p.name}','${p.price}','${p.img}')">
        <img src="${p.img}">
        <h4>${p.name}</h4>
        <span>${p.price}</span>
      </div>
    `;
  });

  html += `</div></section>`;

  container.innerHTML = html;
  toggleMenu(); // закрыть меню
  window.scrollTo(0, 0);
}

