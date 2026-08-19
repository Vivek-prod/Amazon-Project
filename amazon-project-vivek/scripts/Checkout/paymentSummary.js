import { calculateCartQuantity, cart, clearCart } from "../../data/cart.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import { addOrder, orders } from "../../data/orders.js";

import { getProduct } from "../../data/products.js";

import formatCurrency from "../utils/money.js";
import { renderOrderSummary } from "./orderSummary.js";

let orderButtonHTML;

export function rederPaymentSummary() {
  if (calculateCartQuantity() === 0) {
    orderButtonHTML = `<button class="place-order-button button-primary js-place-order payment-buttons-disabled" disabled>
    Place Order</button>`;
  } else {
    orderButtonHTML = `<button class="place-order-button button-primary js-place-order" >
    Place Order</button>`;
  }

  let productPriceCents = 0;
  let shippingPriceCents = 0;

  cart.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    productPriceCents += product.priceCents * cartItem.quantity;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);

    shippingPriceCents += deliveryOption.priceCents;
  });

  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;

  const taxCents = totalBeforeTaxCents * 0.1;

  const totalCents = totalBeforeTaxCents + taxCents;

  const paymentSummaryHTML = `

    <div class="payment-summary-title">Order Summary</div>

    <div class="payment-summary-row">
        <div>Items (${calculateCartQuantity()}:)</div>
        <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
    </div>

    <div class="payment-summary-row">
        <div>Shipping &amp; handling</div>
        <div class="payment-summary-money">$${formatCurrency(shippingPriceCents)}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
        <div>Total before tax</div>
        <div class="payment-summary-money">$${formatCurrency(totalBeforeTaxCents)}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
        <div>Estimated tax (10%)</div>
        <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
    </div>

    <div class="payment-summary-row total-row">
        <div>Order total:</div>
        <div class="payment-summary-money">$${formatCurrency(totalCents)}</div>
    </div>

    ${orderButtonHTML}
  
  `;

  document.querySelector(".js-payment-summary").innerHTML = paymentSummaryHTML;

  if (calculateCartQuantity() > 0) {
    document
      .querySelector(".js-place-order")
      .addEventListener("click", async () => {
        try {
          const response = await fetch(
            "https://supersimplebackend.dev/orders",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                cart: cart,
              }),
            },
          );

          const order = await response.json();

          addOrder(order);

          clearCart();
          renderOrderSummary();
          rederPaymentSummary();

          console.log(cart);

          // window.location.href = "orders.html";
        } catch (error) {
          console.log("unexpected error", error);
        }
      });
  }
}
console.log(cart);
