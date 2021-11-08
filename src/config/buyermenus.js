/* eslint-disable import/extensions */
import axios from 'axios';
import { fetchCategories, fetchProducts } from '../core/productmanagement.js';
import { menus } from './menuoptions.js';
import { BASEURL } from './urls.js';
import { retreiveCachedItems } from '../core/services.js';

let message = '';
const con = () => 'CON';
const end = () => 'END';
const userViewOffers = {};
export const offersArray = [];
export const cartItems = [];
export const totalCost = {};
export const itemSelection = {};

export const renderProductCategories = async () => {
  try {
    const response = await fetchCategories();
    console.log('Response at categories', response);
    if (response) {
      message = `${con()} Choose a category\n ${response}`;
    } else {
      message = `${end()} Could not fetch categories at the moment, try later`;
    }
    return message;
  } catch (err) {
    throw new Error(err);
  }
};

export const renderProducts = async (id) => {
  try {
    const response = await fetchProducts(id);
    if (response) {
      message = `${con()} Choose a product to buy\n ${response}`;
    } else {
      message = `${con()} Could not fetch products at the moment try again later`;
    }
    return message;
  } catch (err) {
    throw new Error(err);
  }
};
export const renderOfferings = async (client, id) => {
  const status = {};
  try {
    const endpointUrl = `${BASEURL}/api/productsbyproductid`;
    const productOffering = await axios.get(`${endpointUrl}/${id}`);
    let offeringText = '';
    if (productOffering.data.message.data.status !== '3' && productOffering.data.status !== 'error') {
      const offers = productOffering.data.message.data;
      console.log('Here are the offers', offers);
      offers.forEach((offer) => {
        offeringText += `\n${offer.id}. ${offer.product_name} from ${offer.farm_name} Grade: ${offer.grade} `;
        userViewOffers.id = `${offer.id}`;
        userViewOffers.product = `${offer.product_name}`;
        userViewOffers.farmName = `${offer.farm_name}`;
        userViewOffers.grade = `${offer.grade}`;
        userViewOffers.availableUnits = `${offer.available_units}`;

        if (offer.status === '0') {
          offeringText += `KES ${offer.unit_price}`;
          userViewOffers.unitPrice = `${offer.unit_price}`;
          status[offer.id] = 'unit';
        } else if (offer.status === '1') {
          offeringText += `KES ${offer.group_price}`;
          status[offer.id] = 'group';
          userViewOffers.groupPrice = `${offer.group_price}`;
        } else {
          offeringText += `Group price: ${offer.group_price}, Unit Price: ${offer.unit_price}`;
          userViewOffers.unitPrice = `${offer.unit_price}`;
          userViewOffers.groupPrice = `${offer.group_price}`;
          status[offer.id] = 'both';
        }
        offersArray.push(userViewOffers);
      });
      offeringText += menus.viewCart;

      message = `${con()} Choose a product to buy. ${offeringText}`;
    } else {
      message = `${con()} Product not available`;
      message += menus.footer;
    }
    return {
      message,
      status,
    };
  } catch (err) {
    throw new Error(err);
  }
};

export const checkGroupAndIndividualPrice = (status) => {
  console.log('Status of group');
  if (status === 'both') {
    message = `${con} Select the price you want to buy at\n 1. Group\n 2. Unit price \n`;
  } else if (status === 'unit') {
    message = `${con()} Buy item at unit price\n 1. Yes\n `;
  } else if (status === 'group') {
    message = `${con()} Buy item at group price 1. Yes\n `;
  }
  message += menus.footer;
  return message;
};

export const askForQuantity = () => {
  message = `${con()} Enter quantity you want to buy\n`;
  message += menus.footer;
  return message;
};

export const confirmQuantityWithPrice = (client, arrayOfOffers, userQuantity) => {
  let availableUnits = 0;
  availableUnits = arrayOfOffers[0].availableUnits;

  if (userQuantity > availableUnits) {
    message = `${con()} The amount you set is higher than the available units go back and choose a smaller quantity`;
  } else {
    const total = userQuantity * arrayOfOffers[0].unitPrice;
    console.log('User quantity is', userQuantity);
    const prompt = `${arrayOfOffers[0].product} from ${arrayOfOffers[0].farmName} of grade:${arrayOfOffers[0].grade} at ${arrayOfOffers[0].unitPrice}`;
    itemSelection.product = `${arrayOfOffers[0].product}`;
    itemSelection.farmName = `${arrayOfOffers[0].farmName}`;
    itemSelection.grade = `${arrayOfOffers[0].grade}`;
    itemSelection.totalCost = total;
    client.set('totalCost', total);
    message = `${con()} Buy ${prompt}\n Total ${total}\n 1. Add to cart`;
  }
  message += menus.footer;
  return message;
};

export const addToCart = (itemsObject, totalPriceObject) => {
  if (itemsObject && totalPriceObject) {
    cartItems.push(itemsObject);
    cartItems.push(totalPriceObject);
    message = `${con()} Cart Items added successfully\n`;
    console.log('Cart Items are', cartItems);
    message += '67. View Cart';
  } else {
    message = `${con()} You have not selected any item to add to cart`;
  }
  message += menus.footer;
  return message;
};

export const displayCartItems = async (client) => {
  try {
    let prompt = '';
    cartItems.forEach((item, index) => {
      prompt += `${index}. ${item.product}, ${item.farmName}, ${item.grade} ${item.totalCost}\n`;
    });
    const total = await retreiveCachedItems(client, ['totalCost']);
    message = `${con()} Your cart items are\n ${prompt} Total ${total}\n 1. Checkout\n 2. Update Cart`;
    return message;
  } catch (error) {
    throw new Error(error);
  }
};

export const updateCart = () => {
  message = `${con()} Choose an operation\n 1. Remove Item\n 2. Change Item quantity`;
  message += menus.footer;
  return message;
};
export const checkOut = () => {
  message = `${con()} Checkout using\n 1. This Number\n 2. Other number`;
  return message;
};

export const checkoutUsingDifferentNumber = () => {
  message = `${con()} Enter phone number to checkout with`;
  message += menus.footer;
  return message;
};

export const showCartItems = () => {
  let prompt = '';
  console.log('Cart items show', cartItems);
  cartItems.forEach((item, index) => {
    prompt += `${index}. ${item.product}, ${item.farmName}, ${item.grade} ${item.totalCost}\n`;
  });
  return prompt;
};

export const updateType = (type) => {
  if (type === 'remove') {
    message = `${con()} Select an item to remove\n`;
  } else {
    message = `${con()} Select an item to update\n`;
  }
  const cartItems = showCartItems();
  message += cartItems;
  message += menus.footer;
  return message;
};

export const removeItemFromCart = async (id) => {
  try {
    const response = await axios.delete(`${BASEURL}/api/cart/${id}`);
    if (response.status === 200) {
      message = `${con()} Cart Item removed successfully`;
    } else {
      message = `${con()} Something went wrong`;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const updateQuantityinCart = async (id) => {
  try {
    const response = await axios.put(`${BASEURL}/api/cart/${id}`);
    if (response.status === 200) {
      message = `${con()} Cart Item removed successfully`;
    } else {
      message = `${con()} Something went wrong`;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const displayTotalCost = async (client) => {
  try {
    const chargeToUser = await retreiveCachedItems(client, ['totalCost']);
    message = `${con()} Proceed to pay KES ${chargeToUser}\n 1. Yes`;
    message += menus.footer;
  } catch (error) {
    throw new Error(error);
  }
  return message;
};