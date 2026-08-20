import { orders, getOrders } from "../data/orders.js";
import { getProduct, loadProductsFetch, products } from "../data/products.js";

const url = new URL(window.location.href);
const orderId = url.searchParams.get("orderId");
const productId = url.searchParams.get("productId");

let trackingHTML = "";

console.log(orders);

async function loadPage(params) {
  await loadProductsFetch();
  loadTracking();
}

loadPage();

function loadTracking() {
  const productTracked = getProduct(productId);
  console.log(productTracked);

  trackingHTML = `
            <a class="back-to-orders-link link-primary" href="orders.html">
                View all orders
            </a>

            <div class="delivery-date">
                Arriving on Monday, June 13
            </div>

            <div class="product-info">
                ${productTracked.name}
            </div>

            <div class="product-info">
                Quantity: 1
            </div>

            <img class="product-image" src="${productTracked.image}">

            <div class="progress-labels-container">
                <div class="progress-label"> Preparing</div>

                <div class="progress-label current-status">Shipped</div>

                <div class="progress-label">Delivered</div>
            </div>

            <div class="progress-bar-container">
                <div class="progress-bar"></div>
            </div>`;

  document.querySelector(".order-tracking").innerHTML = trackingHTML;
}
