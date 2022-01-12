import axios from 'axios';
import { BASEURL } from '../core/urls.js';

export const getOrders = async (id) => {
  let result;
  try {
    const viewOrdersRequest = await axios.get(
      `${BASEURL}/ussd/showmyorders/${id}`,
    );
    if (viewOrdersRequest.data.status === 'error') {
      result = viewOrdersRequest.data.message;
    } else {
      result = viewOrdersRequest.data.message.data;
    }
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
export const viewOrders = async (id) => {
  let message;
  let prompt = '';
  const orders = await getOrders(id);
  if (typeof orders === 'string') {
    message = orders;
  } else if (typeof orders === 'object') {
    let paymentStatus = '';
    orders.forEach((order, index) => {
      if (order.payment_status === null) {
        paymentStatus = 'Not paid';
      }
      prompt += `${index}. ${order.order_id} KES${order.amount} Payment-Status:${paymentStatus} \n`;
    });
    message = prompt;
  }

  return message;
};

export default viewOrders;
