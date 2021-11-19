import axios from 'axios';

const changeQuantity = (amount, object) => {
  const newTotalCost = object.unitPrice * amount;
  object.totalCost = newTotalCost;
  return object;
};

const item = {
  id: '2',
  product: 'Tomatoes',
  farmName: 'Primes Tomato Farm',
  grade: 'C',
  unitPrice: 3000,
  totalCost: 9000,
};
console.log(changeQuantity(2, item));