export const orders = JSON.parse(localStorage.getItem("orders")) || [];

export function addOrder(order) {
  orders.unshift(order); //add the new product on the first
  saveToStorage();
  console.log(orders);
}

function saveToStorage() {
  localStorage.setItem("orders", JSON.stringify(orders));
}
