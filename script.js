// ================= CONFIG =================
const API_URL = "https://taveine.com/wp-json/wc/v3/products";
const CK = "ck_xxxxxxxxxxxxxxxxx";
const CS = "cs_xxxxxxxxxxxxxxxxx";

// ================= MENU =================
function toggleMenu() {
  document.getElementById("side-menu").classList.toggle("active");
}

document.querySelector(".menu-btn").addEventListener("click", toggleMenu);

function toggleSub(id) {
  const el = document.getElementById(id);
  const icon = document.getElementById("icon-" + id);

  if (el.style.display === "block") {
    el.style.display = "none";
    icon.innerText = "+";
  } else {
    el.style.display = "block";
    icon.innerText = "−";
  }
}

// ================= LOAD PRODUCTS FROM WP =================
async function renderProducts(categorySlug, titleText) {
  const container = document.getElementById("content");
  container.innerHTML = `<p style="padding:20px">Loading...</p>`;

  const url = `${API_URL}?category=${categorySlug}&consumer_key=${CK}&consumer_secret=${CS}`;

  const res = await fetch(url);
  const products = await res.json();

  let html = `
    <section class="section">
      <h2>${titleText}</h2>
      <div class="grid">
  `;

  products.forEach(p => {
    html += `
      <div class="grid-card" onclick="openProduct('${p.name}','${p.price} AED','${p.images[0]?.src}')">
        <img src="${p.images[0]?.src}">
        <h4>${p.name}</h4>
        <span>${p.price} AED</span>
      </div>
    `;
  });

  html += `</div></section>`;
  container.innerHTML = html;

  toggleMenu();
  window.scrollTo(0, 0);
}

// ================= PRODUCT MODAL =================
const modal = document.getElementById("product-modal");

function openProduct(name, price, img) {
  document.getElementById("modal-title").innerText = name;
  document.getElementById("modal-price").innerText = price;
  document.getElementById("modal-img").src = img;
  modal.style.display = "flex";
}

function closeProduct() {
  modal.style.display = "none";
}

// ================= CART =================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart() {
  cart.push({
    name: document.getElementById("modal-title").innerText,
    price: document.getElementById("modal-price").innerText
  });

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert("Added to cart 🌸");
}

function updateCartCount() {
  const el = document.getElementById("cart-count");
  if (el) el.innerText = `(${cart.length})`;
}

function openCart() {
  document.getElementById("cart-modal").style.display = "flex";
}

function closeCart() {
  document.getElementById("cart-modal").style.display = "none";
}

// ================= TELEGRAM =================
function checkoutTelegram() {
  const tg = window.Telegram.WebApp;
  tg.sendData(JSON.stringify(cart));
  alert("Order sent to Telegram ✅");
  cart = [];
  localStorage.clear();
  updateCartCount();
  closeCart();
}

updateCartCount();
