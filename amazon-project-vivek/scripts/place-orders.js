import { orders } from "../data/orders.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import formatCurrency from "./utils/money.js";
import { getProduct, loadProductsFetch } from "../data/products.js";

import { addToCart } from "../data/cart.js";
import { updateHeaderCartQuantity } from "./utils/headerCart.js";

async function loadPage() {
  await loadProductsFetch();

  renderOrders();
  updateHeaderCartQuantity();
}

function renderOrders() {
  let orderHistoryHTML = "";

  orders.forEach((order) => {
    const orderDate = dayjs(order.orderTime);
    const formattedDate = orderDate.format("dddd D");
    const formattedTotalCost = formatCurrency(order.totalCostCents);

    orderHistoryHTML += `
    <div class="order-container">

        <div class="order-header">

            <div class="order-header-left-section">
                <div class="order-date">
                    <div class="order-header-label">Order Placed:</div>
                    <div>${formattedDate}</div>
                </div>

                <div class="order-total">
                    <div class="order-header-label">Total:</div>
                    <div>$${formattedTotalCost}</div>
                </div>
            </div>

            <div class="order-header-right-section">
                <div class="order-header-label">Order ID:</div>
                <div>${order.id}</div>
            </div>
        </div>
        ${renderPlacedProducts(order)}
    </div>`;
  });
  document.querySelector(".orders-grid").innerHTML = orderHistoryHTML;

  document.querySelectorAll(".js-buy-again").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.productId;

      addToCart(productId, 1);
      updateHeaderCartQuantity();

      addedMessage(button);
    });
  });

  document.querySelectorAll(".js-track-button").forEach((track) => {
    track.addEventListener("click", () => {
      const productId = track.dataset.productId;
      const orderId = track.dataset.orderId;
      window.location.href = `tracking.html?orderId=${orderId}&productId=${productId}`;
    });
  });
}

function renderPlacedProducts(order) {
  let placedProductsHTML = "";

  const placedProducts = order.products;

  placedProducts.forEach((product) => {
    const matchingProduct = getProduct(product.productId);

    placedProductsHTML += `
        <div class="order-details-grid">

            <div class="product-image-container">
                <img src="${matchingProduct.image}">
            </div>

            <div class="product-detials">

                <div class="product-name">
                    ${matchingProduct.name}
                </div>
                <div class="product-delivery-date">
                    Arriving on:${dayjs(product.estimatedDeliveryTime).format("dddd, MMMM D")}
                </div>
                <div class="product-quantity">
                    Quantity: ${product.quantity}
                </div>
                <button class="buy-again-button button-primary js-buy-again" data-product-id="${product.productId}">
                    <img class="buy-again-icon" src="images/icons/buy-again.png" >
                    <span class="buy-again-message " >Buy it again</span>  
                </button>

            </div>

            <div class="product-actions">
                    <button class="track-package-button button-secondary js-track-button" data-product-id="${product.productId}" data-order-id="${order.id}">
                    Track package</button>
            </div>
        </div>`;
  });
  return placedProductsHTML;
}

loadPage();

function addedMessage(button) {
  button.classList.add("is-added");
  button.innerHTML = "✓ Added";

  clearTimeout(button.timeoutId);
  button.timeoutId = setTimeout(() => {
    button.classList.remove("is-added");
    button.innerHTML = `
                <img class="buy-again-icon" src="images/icons/buy-again.png" >
                <span class="buy-again-message " >Buy it again</span>  `;
  }, 2000);
}

console.log(orders);
