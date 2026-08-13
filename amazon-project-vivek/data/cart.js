export const cart = [];

export function addToCart(productID, quantity) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productID === cartItem.productID) {
      matchingItem = cartItem; //both variables point to the same object in the cart
    }
  });

  if (matchingItem) {
    matchingItem.quantity += quantity; //so this is the changing the qunatity in the main cart
  } else {
    cart.push({
      productID: productID,
      quantity: quantity,
    });
  }
}
