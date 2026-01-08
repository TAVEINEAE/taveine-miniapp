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

document.querySelector(".menu-btn")?.addEventListener("click", toggleMenu);

function toggleSub(id) {
  const block = document.getElementById(id);
  const icon = document.getElementById("icon-" + id);

  if (!block) return;

  if (block.style.display === "block") {
    block.style.display = "none";
    if (icon) icon.innerText = "+";
  } else {
    block.style.display = "block";
    if (icon) icon.innerText = "−";
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
  const modalCart = document.getElementById("cart-modal");
  const list = document.getElementById("cart-items");

  list.innerHTML = "";

  if (cart.length === 0) {
    list.innerHTML = "<p>Your cart is empty</p>";
  } else {
    cart.forEach(item => {
      list.innerHTML += `
        <div class="cart-item">
          <img src="${item.img}">
          <div>
            <div>${item.name}</div>
            <small>${item.price}</small>
          </div>
        </div>
      `;
    });
  }

  modalCart.style.display = "flex";
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
    btn?.classList.add("active");
  } else {
    wishlist.splice(index, 1);
    btn?.classList.remove("active");
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  updateWishlistCount();
}

function openWishlist() {
  const modalWish = document.getElementById("wishlist-modal");
  const list = document.getElementById("wishlist-items");

  list.innerHTML = "";

  if (wishlist.length === 0) {
    list.innerHTML = "<p>Your wishlist is empty</p>";
  } else {
    wishlist.forEach(item => {
      list.innerHTML += `
        <div class="cart-item">
          <img src="${item.img}">
          <div>
            <div>${item.name}</div>
            <small>${item.price}</small>
          </div>
        </div>
      `;
    });
  }

  modalWish.style.display = "flex";
}

function closeWishlist() {
  document.getElementById("wishlist-modal").style.display = "none";
}

/********************************************************
 * PRODUCTS (LOCAL — ВРЕМЕННО)
 ********************************************************/
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

/********************************************************
 * RENDER COLLECTIONS
 ********************************************************/
function renderProducts(category, title) {
  const filtered = products.filter(p => p.category === category);

  let html = `
    <section class="section">
      <h2>${title}</h2>
      <div class="grid">
  `;

  if (filtered.length === 0) {
    html += `<p style="padding:20px">No products found</p>`;
  } else {
    filtered.forEach(p => {
      html += `
        <div class="grid-card" onclick="openProduct('${p.name}','${p.price}','${p.img}')">
          <img src="${p.img}" alt="${p.name}">
          <h4>${p.name}</h4>
          <span>${p.price}</span>
        </div>
      `;
    });
  }

  html += `
      </div>
    </section>
  `;

  content.innerHTML = html;
  toggleMenu();
  scrollToTop();
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
    items: cart.length
  }));

  alert("Order sent to Telegram ✅");

  cart = [];
  localStorage.removeItem("cart");
  updateCartCount();
  closeCart();
}