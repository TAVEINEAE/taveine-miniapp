/********************************************************
 * CONFIG — ОБЯЗАТЕЛЬНО ЗАПОЛНИ
 ********************************************************/
const SITE_URL = "https://taveine.com";
const CK = "ck_XXXXXXXXXXXXXXXXXXXXXXXX";
const CS = "cs_XXXXXXXXXXXXXXXXXXXXXXXX";

/********************************************************
 * ELEMENTS
 ********************************************************/
const modal = document.getElementById("product-modal");
const modalTitle = document.getElementById("modal-title");
const modalPrice = document.getElementById("modal-price");
const modalImg = document.getElementById("modal-img");

const content = document.getElementById("content");

/********************************************************
 * MENU
 ********************************************************/
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
}

/********************************************************
 * PRODUCT MODAL
 ********************************************************/
function openProduct(title, price, img) {
  modalTitle.innerText = title;
  modalPrice.innerText = price;
  modalImg.src = img;
  modal.style.display = "flex";
}

function closeProduct() {
  modal.style.display = "none";
}

/********************************************************
 * SCROLL
 ********************************************************/
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/********************************************************
 * CART
 ********************************************************/
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateCartCount() {
  const el = document.getElementById("cart-count");
  if (el) el.innerText = `(${cart.length})`;
}

updateCartCount();

function addToCart() {
  cart.push({
    name: modalTitle.innerText,
    price: modalPrice.innerText,
    img: modalImg.src
  });

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert("Added to cart 🌸");
}

function openCart() {
  const modal = document.getElementById("cart-modal");
  const list = document.getElementById("cart-items");

  list.innerHTML = "";

  cart.forEach(item => {
    list.innerHTML += `
      <div class="cart-item">
        <img src="${item.img}" width="40">
        <div>
          <div>${item.name}</div>
          <small>${item.price}</small>
        </div>
      </div>
    `;
  });

  modal.style.display = "flex";
}

function closeCart() {
  document.getElementById("cart-modal").style.display = "none";
}

/********************************************************
 * WISHLIST
 ********************************************************/
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

function updateWishlistCount() {
  const el = document.getElementById("wishlist-count");
  if (el) el.innerText = `(${wishlist.length})`;
}

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

function openWishlist() {
  const modal = document.getElementById("wishlist-modal");
  const list = document.getElementById("wishlist-items");

  list.innerHTML = "";

  wishlist.forEach(item => {
    list.innerHTML += `
      <div class="cart-item">
        <img src="${item.img}" width="40">
        <div>
          <div>${item.name}</div>
          <small>${item.price}</small>
        </div>
      </div>
    `;
  });

  modal.style.display = "flex";
}

function closeWishlist() {
  document.getElementById("wishlist-modal").style.display = "none";
}

/********************************************************
 * WOOCOMMERCE FETCH
 ********************************************************/
async function fetchProductsByCategory(slug) {
  const url = `${SITE_URL}/wp-json/wc/v3/products?category=${slug}&consumer_key=${CK}&consumer_secret=${CS}`;

  const res = await fetch(url);
  return await res.json();
}

/********************************************************
 * RENDER PRODUCTS (COLLECTIONS)
 ********************************************************/
async function renderProducts(categorySlug, title) {
  content.innerHTML = `
    <section class="section">
      <h2>${title}</h2>
      <p style="padding:20px">Loading...</p>
    </section>
  `;

  toggleMenu();
  scrollToTop();

  try {
    const products = await fetchProductsByCategory(categorySlug);

    let html = `
      <section class="section">
        <h2>${title}</h2>
        <div class="grid">
    `;

    products.forEach(p => {
      html += `
        <div class="grid-card" onclick="openProduct('${p.name}','${p.price} AED','${p.images[0]?.src || ""}')">
          <img src="${p.images[0]?.src || ""}">
          <button class="heart-btn"
            onclick="toggleWishlist('${p.name}','${p.price} AED','${p.images[0]?.src || ""}', this); event.stopPropagation()">♥</button>
          <h4>${p.name}</h4>
          <span>${p.price} AED</span>
        </div>
      `;
    });

    html += `</div></section>`;
    content.innerHTML = html;

  } catch (e) {
    content.innerHTML = "<p>Error loading products</p>";
  }
}

/********************************************************
 * TELEGRAM CHECKOUT
 ********************************************************/
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
    cart: cart,
    total: cart.length
  }));

  alert("Order sent to Telegram ✅");

  cart = [];
  localStorage.removeItem("cart");
  updateCartCount();
  closeCart();
}
