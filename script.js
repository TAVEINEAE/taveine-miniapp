// ================= MODAL (PRODUCT) =================
const productModal = document.getElementById("product-modal");
const modalTitle = document.getElementById("modal-title");
const modalPrice = document.getElementById("modal-price");
const modalImg = document.getElementById("modal-img");

function openProduct(name, price, img) {
  modalTitle.textContent = name;
  modalPrice.textContent = price;
  modalImg.src = img;
  productModal.style.display = "flex";
}

function closeProduct() {
  productModal.style.display = "none";
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ================= MENU =================
function toggleMenu() {
  document.getElementById("side-menu").classList.toggle("active");
}

document.querySelector(".menu-btn").addEventListener("click", toggleMenu);

function toggleSub(id) {
  const block = document.getElementById(id);
  const icon = document.getElementById("icon-" + id);

  const isOpen = block.style.display === "block";
  block.style.display = isOpen ? "none" : "block";
  icon.textContent = isOpen ? "+" : "−";
}

// ================= PRODUCTS =================
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

// ================= RENDER =================
function renderProducts(category, title) {
  const container = document.getElementById("content");
  const filtered = products.filter(p => p.category === category);

  let html = `
    <section class="section">
      <h2>${title}</h2>
      <div class="grid">
  `;

  filtered.forEach(p => {
    html += `
      <div class="grid-card" onclick="openProduct('${p.name}','${p.price}','${p.img}')">
        <img src="${p.img}" alt="${p.name}">
        <button class="heart-btn"
          onclick="toggleWishlist('${p.name}','${p.price}','${p.img}', this); event.stopPropagation()">♥</button>
        <h4>${p.name}</h4>
        <span>${p.price}</span>
      </div>
    `;
  });

  html += `</div></section>`;
  container.innerHTML = html;
  toggleMenu();
  scrollToTop();
}

// ================= CART =================
let cart = JSON.parse(localStorage.getItem("cart")) || [];
updateCartCount();

function addToCart() {
  cart.push({
    name: modalTitle.textContent,
    price: modalPrice.textContent
  });

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert("Added to cart 🌸");
}

function updateCartCount() {
  const el = document.getElementById("cart-count");
  if (el) el.textContent = `(${cart.length})`;
}

function openCart() {
  const modal = document.getElementById("cart-modal");
  const list = document.getElementById("cart-items");

  list.innerHTML = "";
  cart.forEach(item => {
    list.innerHTML += `
      <div class="cart-item">
        <span>${item.name}</span>
        <span>${item.price}</span>
      </div>
    `;
  });

  modal.style.display = "flex";
}

function closeCart() {
  document.getElementById("cart-modal").style.display = "none";
}

// ================= WISHLIST =================
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
updateWishlistCount();

function toggleWishlist(name, price, img, btn) {
  const index = wishlist.findIndex(i => i.name === name);

  if (index === -1) {
    wishlist.push({ name, price, img });
    btn.classList.add("active");
  } else {
    wishlist.splice(index, 1);
    btn.classList.remove("active");
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  updateWishlistCount();
}

function updateWishlistCount() {
  const el = document.getElementById("wishlist-count");
  if (el) el.textContent = `(${wishlist.length})`;
}

function openWishlist() {
  const modal = document.getElementById("wishlist-modal");
  const list = document.getElementById("wishlist-items");

  list.innerHTML = "";
  wishlist.forEach(item => {
    list.innerHTML += `
      <div class="wishlist-item">
        <span>${item.name}</span>
        <span>${item.price}</span>
      </div>
    `;
  });

  modal.style.display = "flex";
}

function closeWishlist() {
  document.getElementById("wishlist-modal").style.display = "none";
}

// ================= TELEGRAM CHECKOUT =================
function checkoutTelegram() {
  if (!window.Telegram || !window.Telegram.WebApp) {
    alert("Telegram WebApp not found");
    return;
  }

  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }

  const tg = window.Telegram.WebApp;

  tg.sendData(JSON.stringify({
    items: cart,
    total: cart.length
  }));

  cart = [];
  localStorage.removeItem("cart");
  updateCartCount();
  closeCart();

  alert("Order sent to Telegram ✅");
}
