/**************** CONFIG ****************/
const SITE_URL = "https://taveine.com";
const CK = "ck_120a4df77ad763e48ac07372e08af1eb48e40dcb";
const CS = "cs_1bee08c5b8030a07cbd4b46a8c0edfa636bb4a44";

/**************** ELEMENTS ****************/
const content = document.getElementById("content");
const modal = document.getElementById("product-modal");
const modalTitle = document.getElementById("modal-title");
const modalPrice = document.getElementById("modal-price");
const modalImg = document.getElementById("modal-img");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

/**************** MENU ****************/
function toggleMenu(){
  document.getElementById("side-menu").classList.toggle("active");
}
document.querySelector(".menu-btn").onclick = toggleMenu;

/**************** LOAD CATEGORIES ****************/
async function loadCategories(){
  const res = await fetch(
    `${SITE_URL}/wp-json/wc/v3/products/categories?per_page=50&consumer_key=${CK}&consumer_secret=${CS}`
  );
  const cats = await res.json();

  const list = document.getElementById("collections-list");
  list.innerHTML = "";

  cats.forEach(c=>{
    if(c.count > 0){
      list.innerHTML += `
        <a onclick="loadProducts(${c.id},'${c.name}')">${c.name}</a>
      `;
    }
  });
}
loadCategories();

/**************** LOAD PRODUCTS ****************/
async function loadProducts(catId, title){
  toggleMenu();
  content.innerHTML = `<h2 style="padding:16px">${title}</h2>`;

  const res = await fetch(
    `${SITE_URL}/wp-json/wc/v3/products?category=${catId}&per_page=50&consumer_key=${CK}&consumer_secret=${CS}`
  );
  const products = await res.json();

  let html = `<section class="grid desktop-grid">`;

  products.forEach(p=>{
    html += `
      <div class="product-card" onclick="openProduct('${p.name}','${p.price} AED','${p.images[0]?.src}')">
        <img src="${p.images[0]?.src}">
        <h4>${p.name}</h4>
        <span>${p.price} AED</span>
      </div>
    `;
  });

  html += `</section>`;
  content.innerHTML += html;
}

/**************** PRODUCT ****************/
function openProduct(t,p,i){
  modalTitle.innerText=t;
  modalPrice.innerText=p;
  modalImg.src=i;
  modal.style.display="flex";
}
function closeProduct(){ modal.style.display="none"; }

/**************** CART ****************/
function addToCart(){
  cart.push({
    name: modalTitle.innerText,
    price: modalPrice.innerText,
    img: modalImg.src
  });
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert("Added to cart");
}

function updateCartCount(){
  document.getElementById("cart-count").innerText = cart.length;
}
updateCartCount();

function openCart(){
  const list = document.getElementById("cart-items");
  list.innerHTML = "";
  cart.forEach(i=>{
    list.innerHTML += `<div>${i.name} – ${i.price}</div>`;
  });
  document.getElementById("cart-modal").style.display="flex";
}
function closeCart(){
  document.getElementById("cart-modal").style.display="none";
}

/**************** PAYMENTS ****************/
function checkoutTelegram(){
  if(!window.Telegram?.WebApp){
    alert("Telegram not available");
    return;
  }
  Telegram.WebApp.sendData(JSON.stringify({cart}));
  alert("Order sent to Telegram");
}

function payCrypto(){
  // пример: NOWPayments / Crypto invoice
  const amount = cart.reduce((s,i)=>s+parseFloat(i.price),0);
  window.open(`https://nowpayments.io/payment?amount=${amount}&currency=USDT`, "_blank");
}

/**************** UTIL ****************/
function scrollToTop(){
  window.scrollTo({top:0,behavior:"smooth"});
}
