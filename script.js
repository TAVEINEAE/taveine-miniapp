const SITE_URL = "https://taveine.com";
const CK = "ck_XXXX";
const CS = "cs_XXXX";

const content = document.getElementById("content");

function toggleMenu(){document.getElementById("side-menu").classList.toggle("active")}
document.querySelector(".menu-btn").onclick = toggleMenu;

function toggleSub(id){
  const el=document.getElementById(id);
  el.style.display = el.style.display==="block"?"none":"block";
}

function openProduct(t,p,i){
  modalTitle.innerText=t;
  modalPrice.innerText=p;
  modalImg.src=i;
  modal.style.display="flex";
}
function closeProduct(){modal.style.display="none"}

function scrollToTop(){window.scrollTo({top:0,behavior:"smooth"})}

// CART
let cart=JSON.parse(localStorage.getItem("cart"))||[];
function updateCart(){document.getElementById("cart-count").innerText=`(${cart.length})`}
updateCart();

function addToCart(){
  cart.push({name:modalTitle.innerText,price:modalPrice.innerText,img:modalImg.src});
  localStorage.setItem("cart",JSON.stringify(cart));
  updateCart();
}

function openCart(){
  const box=document.getElementById("cart-items");
  box.innerHTML="";
  cart.forEach(i=>box.innerHTML+=`<div class="cart-item"><img src="${i.img}"><div>${i.name}<br>${i.price}</div></div>`);
  document.getElementById("cart-modal").style.display="flex";
}
function closeCart(){document.getElementById("cart-modal").style.display="none"}

// WISHLIST
let wishlist=JSON.parse(localStorage.getItem("wishlist"))||[];
function openWishlist(){
  const box=document.getElementById("wishlist-items");
  box.innerHTML="";
  wishlist.forEach(i=>box.innerHTML+=`<div class="cart-item"><img src="${i.img}"><div>${i.name}<br>${i.price}</div></div>`);
  document.getElementById("wishlist-modal").style.display="flex";
}
function closeWishlist(){document.getElementById("wishlist-modal").style.display="none"}

// SEARCH
function openSearch(){document.getElementById("search-modal").style.display="flex"}
function closeSearch(){document.getElementById("search-modal").style.display="none"}

// WOOCOMMERCE
async function fetchProducts(slug){
  const res=await fetch(`${SITE_URL}/wp-json/wc/v3/products?category=${slug}&consumer_key=${CK}&consumer_secret=${CS}`);
  return await res.json();
}

async function renderProducts(slug,title){
  toggleMenu();
  content.innerHTML=`<section class="section"><h2>${title}</h2><p>Loading…</p></section>`;
  const products=await fetchProducts(slug);

  let html=`<section class="section"><h2>${title}</h2><div class="grid">`;
  products.forEach(p=>{
    html+=`
      <div class="grid-card" onclick="openProduct('${p.name}','${p.price} AED','${p.images[0]?.src||""}')">
        <img src="${p.images[0]?.src||""}">
        <h4>${p.name}</h4>
        <span>${p.price} AED</span>
      </div>`;
  });
  html+=`</div></section>`;
  content.innerHTML=html;
}

// TELEGRAM
function checkoutTelegram(){
  Telegram.WebApp.sendData(JSON.stringify(cart));
}
