const SITE_URL = "https://taveine.com";
const CK = "ck_120a4df77ad763e48ac07372e08af1eb48e40dcb";
const CS = "cs_1bee08c5b8030a07cbd4b46a8c0edfa636bb4a44";

const content = document.getElementById("content");
const modal = document.getElementById("product-modal");
const modalTitle = document.getElementById("modal-title");
const modalPrice = document.getElementById("modal-price");
const modalImg = document.getElementById("modal-img");

function toggleMenu() {
  document.getElementById("side-menu").classList.toggle("active");
}

document.querySelector(".menu-btn").onclick = toggleMenu;

function toggleSub(id) {
  const el = document.getElementById(id);
  el.style.display = el.style.display === "block" ? "none" : "block";
}

async function loadCategory(categoryId, title) {
  toggleMenu();
  content.innerHTML = `<h2 style="padding:16px">${title}</h2>`;

  const res = await fetch(
    `${SITE_URL}/wp-json/wc/v3/products?category=${categoryId}&consumer_key=${CK}&consumer_secret=${CS}`
  );

  const products = await res.json();

  let html = `<section class="grid">`;

  products.forEach(p => {
    html += `
      <div class="grid-card" onclick="openProduct('${p.name}','${p.price} AED','${p.images[0]?.src}')">
        <img src="${p.images[0]?.src}">
        <h4>${p.name}</h4>
        <span>${p.price} AED</span>
      </div>
    `;
  });

  html += `</section>`;
  content.innerHTML += html;
}

function openProduct(t,p,i){
  modalTitle.innerText=t;
  modalPrice.innerText=p;
  modalImg.src=i;
  modal.style.display="flex";
}

function closeProduct(){ modal.style.display="none"; }
function openCart(){ document.getElementById("cart-modal").style.display="flex"; }
function closeCart(){ document.getElementById("cart-modal").style.display="none"; }
function openSearch(){ document.getElementById("search-modal").style.display="flex"; }
function closeSearch(){ document.getElementById("search-modal").style.display="none"; }
function scrollToTop(){ window.scrollTo({top:0,behavior:"smooth"}); }
