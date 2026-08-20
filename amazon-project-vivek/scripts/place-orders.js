import { orders } from "../data/orders.js";

console.log(orders);

import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import formatCurrency from "./utils/money.js";
import { getProduct, loadProductsFetch } from "../data/products.js";

async function loadPage() {
  await loadProductsFetch();

  renderOrders();
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
                    <div>${formattedTotalCost}</div>
                </div>
            </div>

            <div class="order-header-right-section">
                <div class="order-header-label">Order ID:</div>
                <div>${order.id}</div>
            </div>
        </div>
        ${renderPlacedProducts(order)}
    </div>`;

    // console.log(order);
    // console.log(formattedDate);
    // console.log(formattedTotalCost);
    // console.log(order.id);

    document.querySelector(".orders-grid").innerHTML = orderHistoryHTML;
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
                    ${dayjs(product.estimatedDeliveryTime).format("dddd, MMMM D")}
                </div>
                <div class="product-quantity">
                    Quantity: ${product.quantity}
                </div>
                <button class="buy-again-button button-primary">
                    <img class="buy-again-icon" src="images/icons/buy-again.png" >
                    <span class="buy-again-message">Buy it again</span>
                </button>

            </div>

            <div class="product-actions">
                <a href="tracking.html">
                    <button class="track-package-button button-secondary">Track package</button>
                </a>
            </div>
        </div>`;
  });
  return placedProductsHTML;
}

loadPage();
