import { getOrders, orders } from "../data/orders.js";
import { getProduct, loadProductsFetch } from "../data/products.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import { updateHeaderCartQuantity } from "./utils/headerCart.js";

const url = new URL(window.location.href);
const orderId = url.searchParams.get("orderId");
const productId = url.searchParams.get("productId");

let trackingHTML = ``;

console.log(orders);
const order = getOrders(orderId);
console.log(order);

async function loadPage() {
  await loadProductsFetch();
  loadTracking();
  updateHeaderCartQuantity();
}

loadPage();

function loadTracking() {
  const productTracked = getProduct(productId);

  const matchingProduct = order.products.find((product) => {
    return product.productId === productId;
  });

  const arrivingDate = dayjs(matchingProduct.estimatedDeliveryTime);
  const placeOrderDate = dayjs(order.orderTime);
  const today = dayjs();
  const elapsedTime = today.diff(placeOrderDate);
  const totalTime = arrivingDate.diff(placeOrderDate);
  const arrivalPercentage = Math.max(
    0,
    Math.min(100, (elapsedTime / totalTime) * 100),
  );

  const quantity = matchingProduct.quantity;

  trackingHTML = `
            <a class="back-to-orders-link link-primary" href="orders.html">
                View all orders
            </a>

            <div class="delivery-date">
                Arriving on ${arrivingDate.format("dddd, MMMM D")}
            </div>

            <div class="product-info">
                ${productTracked.name}
            </div>

            <div class="product-info">
                Quantity: ${quantity}
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

  const progressBar = document.querySelector(".progress-bar");

  setTimeout(() => {
    progressBar.style.width = `${arrivalPercentage}%`;
  }, 100);
}
