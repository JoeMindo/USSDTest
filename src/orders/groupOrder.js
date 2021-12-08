import axios from 'axios';
import { retreiveCachedItems } from '../core/services.js';
import { renderOffers } from '../products/renderProducts.js';
import client from '../server.js';

import { BASEURL } from '../core/urls.js';
import { menus } from '../menus/menuoptions.js';
import {
  askForQuantity, renderProductCategories,
} from '../users/buyer/buyermenus.js';

export const checkIfUserIsInGroup = async () => {
  const user = await retreiveCachedItems(client, ['user_id']);
  const data = {
    // TODO: Custom ID
    user_id: Math.floor(Math.random() * 100),
  };
  const response = await axios.post(`${BASEURL}/api/isuseringroup`, data);
  if (response.data.status === 'success') {
    return response.data.group_ID;
  }
  return false;
};

export const actionToTake = async (state) => {
  let message = '';
  if (state === false) {
    message = `CON ${menus.buyermenu.createGroup}`;
  } else if (typeof state === 'number') {
    message = `CON ${menus.buyermenu.groupToJoin}`;
  }
  message += menus.footer;
  return message;
};

export const createGroup = async (groupdata) => {
  const response = await axios.post(`${BASEURL}/api/saveusergroup`, groupdata);
  return response.data.status;
};
export const requestGroupName = () => 'CON What is the name of your group?\n';
export const groupCreationMessage = (status) => {
  let message;
  if (status === 'success') {
    message = 'CON Group created successfully\n 1. Add items to buy';
  } else {
    message = 'CON Could not create group. Try again\n';
  }
  message += menus.footer;
  return message;
};

export const renderGroupPricedItems = async (productId) => {
  try {
    let offers = await axios.get(`${BASEURL}/api/productsbyproductid/${productId}`);
    offers = offers.data.message.data;
    const message = renderOffers(offers, [], client);
    return message;
  } catch (err) {
    throw new Error(err);
  }
};
export const groupPricedItems = async (textValue, text) => {
  let message;
  if (textValue === 5) {
    message = await renderProductCategories();
  } else if (textValue === 6) {
    const selection = parseInt(text.split('*')[5], 10);
    message = await renderProducts(selection);
  } else if (textValue === 7) {
    const id = parseInt(text.split('*')[6], 10);
    message = await renderGroupPricedItems(id);
  } else if (textValue === 8) {
    message = askForQuantity();
  }
  message += menus.footer;
  return message;
};
export default checkIfUserIsInGroup;
