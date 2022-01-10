import { con } from '../menus/rendermenu.js';
import { menus } from '../menus/menuoptions.js';

const makePayment = () => `${con()} Make payment here`;
export const checkoutUsingDifferentNumber = () => {
  let message;
  message = `${con()} Enter phone number to checkout with`;
  message += menus.footer;
  return message;
};

export default makePayment;
