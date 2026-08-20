import { calculateCartQuantity } from "../../data/cart.js";

export function updateHeaderCartQuantity() {
  document.querySelector(".js-cart-quantity").innerHTML =
    calculateCartQuantity();
}
