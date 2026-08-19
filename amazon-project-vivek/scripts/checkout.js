import { loadCart } from "../data/cart.js";
import { loadProductsFetch } from "../data/products.js";
import { renderOrderSummary } from "./Checkout/orderSummary.js";
import { rederPaymentSummary } from "./Checkout/paymentSummary.js";

// import "../data/cart-class.js";

// import "../data/backend-practice.js";

async function loadPage() {
  try {
    // throw "error1";

    await loadProductsFetch(); //let us get the response from the backend and hence we dont need to use .then

    const value = await new Promise((resolve, reject) => {
      // throw "error2";

      loadCart(() => {
        // reject("error3");

        resolve("value3");
      });
    });
  } catch (error) {
    console.log("unexpected error, please try again later");
  }

  renderOrderSummary();
  rederPaymentSummary();

  return "value2"; //this value is saved as a parameter in the next step like in resolve(parameter)
}

//async returns a promise

loadPage();

/*
Promise.all([
  loadProductsFetch(), //this returns a promise

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

*/

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

/*
try {
  doesnotexist();
  console.log("next line"); //will be skipped if there is an error
} catch (error) {
  console.log("error");
}
*/
