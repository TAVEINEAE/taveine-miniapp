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
}
