const productsEl = document.getElementById("products");

fetch("https://taveine.com/wp-json/miniapp/v1/products")
  .then(res => res.json())
  .then(products => {
    productsEl.innerHTML = "";

    products.forEach(p => {
      const card = document.createElement("div");
      card.className = "product-card";

      card.innerHTML = `
        <img src="${p.image}" alt="${p.name}">
        <div class="product-info">
          <h3>${p.name}</h3>
          <span>${p.price} AED</span>
        </div>
      `;

      productsEl.appendChild(card);
    });
  })
  .catch(err => {
    productsEl.innerHTML = "Failed to load products";
    console.error(err);
  });
