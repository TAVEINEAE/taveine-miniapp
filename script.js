/********************************************************
 * CONFIG
 ********************************************************/
const SITE_URL = "https://taveine.com";
const CK = "ck_120a4df77ad763e48ac07372e08af1eb48e40dcb";
const CS = "cs_1bee08c5b8030a07cbd4b46a8c0edfa636bb4a44";

/********************************************************
 * ELEMENTS
 ********************************************************/
const content = document.getElementById("content");
const modal = document.getElementById("product-modal");
const modalTitle = document.getElementById("modal-title");
const modalPrice = document.getElementById("modal-price");
const modalImg = document.getElementById("modal-img");

/********************************************************
 * MENU
 ********************************************************/
function toggleMenu() {
  document.getElementById("side-menu").classList.toggle("active");
}
document.querySelector(".menu-btn").addEventListener("click", toggleMenu);

function toggleSub(id) {
  const el = document.getElementById(id);
  const icon = document.getElementById("icon-" + id);
  const open = el.style.display === "block";
  el.style.display = open ? "none" : "block";
  icon.innerText = open ? "+" : "−";
}

/********************************************************
 * PRODUCT MODAL
 ********************************************************/
function openProduct(title, price, img) {
  modalTitle.innerText = title;
  modalPrice.innerHTML = price;
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
        <img src="${item.img}">
        <div>
          <strong>${item.name}</strong>
          <div>${item.price}</div>
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
        <img src="${item.img}">
        <div>
          <strong>${item.name}</strong>
          <div>${item.price}</div>
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
 * WOOCOMMERCE FETCH (CATEGORY ID!)
 ********************************************************/
async function fetchProductsByCategory(categoryId) {
  const url = `${SITE_URL}/wp-json/wc/v3/products?category=${categoryId}&consumer_key=${CK}&consumer_secret=${CS}&per_page=20`;
  const res = await fetch(url);
  return await res.json();
}

/********************************************************
 * RENDER COLLECTION
 ********************************************************/
async function renderProducts(categoryId, title) {
  content.innerHTML = `
    <section class="section">
      <h2>${title}</h2>
      <p style="padding:20px">Loading...</p>
    </section>
  `;

  toggleMenu();
  scrollToTop();

  try {
    const products = await fetchProductsByCategory(categoryId);

    let html = `
      <section class="section">
        <h2>${title}</h2>
        <div class="grid">
    `;

    products.forEach(p => {
      const img = p.images?.[0]?.src || "";
      const price = p.price_html || `${p.price} AED`;

      html += `
        <div class="grid-card" onclick="openProduct('${p.name}','${price}','${img}')">
          <img src="${img}">
          <button class="heart-btn"
            onclick="toggleWishlist('${p.name}','${price}','${img}', this); event.stopPropagation()">♥</button>
          <h4>${p.name}</h4>
          <span>${price}</span>
        </div>
      `;
    });

    html += `</div></section>`;
    content.innerHTML = html;

  } catch (e) {
    content.innerHTML = "<p>Error loading products</p>";
  }
}
