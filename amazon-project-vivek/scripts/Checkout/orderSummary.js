import {
  cart,
  removeFromCart,
  updateQuantity,
  updateDeliveryOption,
} from "../../data/cart.js"; //named export

import { products, getProduct, loadProducts } from "../../data/products.js";

import { formatCurrency } from "../utils/money.js";

import { hello } from "https://unpkg.com/supersimpledev@1.0.1/hello.esm.js";

import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js"; //default export is used here. used when we want only 1 thing from the module

import {
  deliveryOptions,
  getDeliveryOption,
} from "../../data/deliveryOptions.js";

import { rederPaymentSummary } from "./paymentSummary.js";

function deliveryOptionsHTML(matchingProduct, cartItem) {
  let html = "";

  deliveryOptions.forEach((deliveryOption) => {
    const today = dayjs();
    const deliverDate = today.add(deliveryOption.deliveryDays, "days");
    const dateString = deliverDate.format("dddd, MMMM D");

    const priceString =
      deliveryOption.priceCents === 0
        ? "FREE"
        : `${formatCurrency(deliveryOption.priceCents)} -`;

    const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

    html += `
            <div class="delivery-option js-delivery-option" data-product-id='${matchingProduct.id}' data-delivery-option-id="${deliveryOption.id}">
              <input type="radio" ${isChecked ? "checked" : " "} class="delivery-option-input" name="delivery-option-${matchingProduct.id}">
              <div>
                  <div class="delivery-option-date">${dateString}</div>
                  <div class="delivery-option-price">${priceString} Shipping</div>
              </div>
            </div>
            `;
  });

  return html;
}

export function renderOrderSummary() {
  let cartSummaryHTML = "";

  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    cartQuantity += cartItem.quantity;

    const matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const today = dayjs();
    const deliverDate = today.add(deliveryOption.deliveryDays, "days");
    const dateString = deliverDate.format("dddd, MMMM D");

    cartSummaryHTML += `
          <div class="cart-item-container js-cart-item-container js-cart-item-container-${matchingProduct.id}" data-product-id='${matchingProduct.id}'>
                          <div class="delivery-date js-delivery-date">Delivery date: ${dateString}</div>

                          <div class="cart-item-details-grid">
                              <img class="product-image" src="${matchingProduct.image}">

                              <div class="cart-item-details">
                                  <div class="product-name">
                                      ${matchingProduct.name}
                                  </div>
                                  <div class="product-price">${matchingProduct.getPrice()}</div>
                                  
                                  <div class="product-quantity js-product-quantity-${matchingProduct.id}">
                                      <span>
                                          Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                                      </span>
                                      <input class='quantity-input' type="number" value=${cartItem.quantity}>
                                      <span class="update-quantity-link link-primary js-update-link" data-product-id='${matchingProduct.id}'>Update</span>
                                      
                                      <span class='save-quantity-link link-primary js-save-link' data-product-id='${matchingProduct.id}'>Save</span>
                                      <span class="delete-quantity-link link-primary js-delete-link js-delete-link-${matchingProduct.id}" data-product-id='${matchingProduct.id}'>Delete</span>
                                  </div>
                              </div>

                              <div class="delivery-options">
                                  <div class="delivery-options-title">Choose a delivery opiton:</div>

                                  ${deliveryOptionsHTML(matchingProduct, cartItem)}
                                  
                                  </div>
                              </div>
                          </div>  
                      </div>
          
          
          
          `;
  });

  let totalItem = document.querySelector(".js-item-in-cart");
  totalItem.innerHTML = cartQuantity;

  // document.querySelector("js-cart-quantity").innerHTML = cartQuantity;

  document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;

      removeFromCart(productId);

      const container = document.querySelector(
        `.js-cart-item-container-${productId}`,
      );

      container.remove();

      rederPaymentSummary();
    });
  });

  document.querySelectorAll(".js-update-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;

      console.log(productId);
      const container = document.querySelector(
        `.cart-item-container[data-product-id="${productId}"]`,
      );
      container.classList.add("is-editing-quantity");
    });
  });

  document.querySelectorAll(".js-save-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;

      const container = link.closest(".cart-item-container");

      const input = container.querySelector(".quantity-input");
      const quantityLabel = container.querySelector(".quantity-label");
      const newQuantity = Number(input.value);
      quantityLabel.innerHTML = newQuantity;

      updateQuantity(productId, newQuantity);

      container.classList.remove("is-editing-quantity");

      rederPaymentSummary();
    });
  });

  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", () => {
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      rederPaymentSummary();
    });
  });
}
