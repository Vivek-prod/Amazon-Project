import { loadCart } from "../data/cart.js";
import { loadProducts } from "../data/products.js";
import { renderOrderSummary } from "./Checkout/orderSummary.js";
import { rederPaymentSummary } from "./Checkout/paymentSummary.js";

// import "../data/cart-class.js";

// import "../data/backend-practice.js";

Promise.all([
  new Promise((resolve) => {
    loadProducts(() => {
      resolve("value1");
    });
  }),
  new Promise((resolve) => {
    loadCart(() => {
      resolve("value2");
    });
  }),
]).then((values) => {
  console.log(values);
  renderOrderSummary();
  rederPaymentSummary();
});

/*

new Promise((resolve) => {
  loadProducts(() => {
    resolve("value1");
  });
})

  .then((value) => {
    //whatever we give to resovle up is saved here
    console.log(value); //display value1

    return new Promise((resolve) => {
      loadCart(() => {
        resolve();
      });
    });
  })

  .then(() => {
    renderOrderSummary();
    rederPaymentSummary();
  });
*/
/*
loadProducts(() => {
  loadCart(() => {
    renderOrderSummary();
    rederPaymentSummary();
  });
});
*/

//there is less nesting in promise which is better than using callback
