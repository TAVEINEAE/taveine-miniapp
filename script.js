const tg = window.Telegram.WebApp;
tg.expand();

const container = document.getElementById("products");

fetch("https://taveine.com/wp-json/miniapp/v1/products")
  .then(r => r.json())
  .then(products => {
    products.slice(0, 10).forEach(p => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${p.image}">
        <h3>${p.name}</h3>
        <span>${p.price} AED</span>
      `;
      container.appendChild(card);
    });
  });
