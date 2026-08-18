import { loadProducts } from "../data/products.js";
import { renderOrderSummary } from "./Checkout/orderSummary.js";

import { rederPaymentSummary } from "./Checkout/paymentSummary.js";

// import "../data/cart-class.js";

// import "../data/backend-practice.js";

loadProducts(() => {
  renderOrderSummary();
  rederPaymentSummary();
});
