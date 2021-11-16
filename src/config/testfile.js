import axios from 'axios';

const makeOrder = async (orderDetails) => {
  try {
    const makeOrderRequest = axios.post('mamlaka.adalabsafrica.com/api/savebasicorder', orderDetails);
    console.log('The order is', makeOrderRequest);
  } catch (err) {
    throw new Error(err);
  }
};

const orderDets = {
  center_id: 5,
  user_id: 1,
  products: [
    {
      id: 1,
      cost: 23,
      units: 24,
      individual: true,
    },
    {
      id: 2,
      cost: 45,
      units: 45,
    },
  ],
  amount: 450,
  units: 15,
  order_priority: 'medium',
};

console.log(makeOrder(orderDets));