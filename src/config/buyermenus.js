/* eslint-disable import/extensions */
import axios from 'axios';

import { fetchCategories, fetchProducts } from '../core/productmanagement.js';
import { menus } from './menuoptions.js';
import { BASEURL } from './urls.js';
import { retreiveCachedItems } from '../core/services.js';
import { client } from '../server.js';

let message = '';
const con = () => 'CON';
const end = () => 'END';
const userViewOffers = {};
export const offersArray = [];
export const cartItems = [];
export const totalCost = {};
export const itemSelection = {};
const offeringStatus = [];

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
    console.log('Product offering', productOffering.data.message);
    let offeringText = '';
    if (productOffering.data.message.status !== '3' && productOffering.data.status !== 'error') {
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
        client.set('offersArray', JSON.stringify(offersArray));
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
    message = `${con()} Select the price you want to buy at\n 1. Group\n 2. Unit price \n`;
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
// Array of offers should be cached

export const confirmQuantityWithPrice = async (userQuantity) => {
  let availableUnits = 0;
  let offers = await retreiveCachedItems(client, ['offersArray']);
  offers = JSON.parse(offers);
  availableUnits = offers.availableUnits;

  if (userQuantity > availableUnits) {
    message = `${con()} The amount you set is higher than the available units go back and choose a smaller quantity`;
  } else {
    const pricePoint = parseInt(offers[0].unitPrice, 10);
    const total = userQuantity * pricePoint;

    [offers] = offers;

    const prompt = `${offers.product} from ${offers.farmName} of grade:${offers.grade} at ${offers.unitPrice}`;

    itemSelection.id = `${offers.id}`;
    itemSelection.product = `${offers.product}`;
    itemSelection.farmName = `${offers.farmName}`;
    itemSelection.grade = `${offers.grade}`;
    itemSelection.totalCost = total;
    message = `${con()} Buy ${prompt}\n Total ${total}\n 1. Add to cart`;
  }
  message += menus.footer;
  return message;
};

export const addToCart = (client, itemsObject, totalPriceObject) => {
  if (itemsObject && totalPriceObject) {
    cartItems.push(itemsObject);
    client.set('cartItems', JSON.stringify(cartItems));
    message = `${con()} Cart Items added successfully\n`;
    message += '1. Checkout\n';
    message += '67. View Cart';
  } else {
    message = `${con()} You have not selected any item to add to cart`;
  }
  message += menus.footer;
  return message;
};

export const confirmNewQuantity = (client, itemsObject, totalPriceObject) => {
  if (itemsObject && totalPriceObject) {
    cartItems.push(itemsObject);
    client.set('cartItems', JSON.stringify(cartItems));
    message = `${con()} Cart Items updated successfully\n`;
    message += '1. Checkout\n';
  } else {
    message = `${con()} You have not selected an item to update`;
  }
  message += menus.footer;
  return message;
}

export const displayCartItems = async (client) => {
  try {
    let prompt = '';
    let fetchCartItems = await retreiveCachedItems(client, ['cartItems']);
    console.log('Cached cart items', fetchCartItems);
    fetchCartItems = JSON.parse(fetchCartItems);
    if (fetchCartItems.length > 0) {
      fetchCartItems.forEach((item) => {
        prompt += `${item.id}. ${item.product} from ${item.farmName} grade: ${item.grade}  at KES ${item.totalCost}\n`;
      });
      const availableTotal = fetchCartItems.reduce((total, obj) => obj.totalCost + total, 0);
      message = `${con()} Your cart items are\n ${prompt} Total ${availableTotal}\n 1. Checkout\n 2. Update Cart`;
    } else {
      message = `${con()} You have no items at the moment\n Go home and add products`;
      message += menus.footer;
    }
    return message;
  } catch (error) {
    throw new Error(error);
  }
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

export const showCartItems = async (client) => {
  let prompt = '';
  let fetchCartItems = await retreiveCachedItems(client, ['cartItems']);
  fetchCartItems = JSON.parse(fetchCartItems);
  fetchCartItems.forEach((item) => {
    prompt += `${item.id}. ${item.product}, ${item.farmName}, ${item.grade} ${item.totalCost}\n`;
  });
  return prompt;
};

export const updateType = async (type) => {
  if (type === 'remove') {
    message = `${con()} Select an item to remove\n`;
  } else {
    message = `${con()} Select an item to update\n`;
  }
  const cartItems = await showCartItems(client);

  message += cartItems;
  message += menus.footer;
  return message;
};

export const removeItemFromCart = async (id) => {
  try {
    let cartItems = await retreiveCachedItems(client, ['cartItems']);
    cartItems = JSON.parse(cartItems);

    cartItems.forEach((item) => {
      if (item.id === id) {
        const indexOfItem = cartItems.indexOf(item);
        cartItems.splice(indexOfItem, 1);
        client.set('cartItems', JSON.stringify(cartItems));
        message = `${con()} Item removed successfully\n`;
        message += '67. View cart';
        message += menus.footer;
      } else {
        message = `${con()} Item not found`;
      }
    });
    return message;
  } catch (error) {
    throw new Error(error);
  }
};

export const updateQuantityinCart = async (id) => {
  const price = [];
  try {
    let cartItems = await retreiveCachedItems(client, ['cartItems']);
    cartItems = JSON.parse(cartItems);

    cartItems.forEach((item) => {
      if (item.id === id) {
        message = `${con()} What is the quantity you want?`;
        const index = cartItems.indexOf(item);
        price.push(cartItems[index].totalCost);
      }
    });

    return { message, price: price[0] };
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

export const updateRequest = (request) => {
  const array = request.body.text.split('*');
  array.splice(2, array.length);
  request.text = array.join('*');
  return request;
};

export const showAvailableProducts = async (textValue, text) => {
  if (textValue === 2) {
    message = await renderProductCategories();
  } else if (textValue === 3) {
    const selection = parseInt(text.split('*')[2], 10);
    message = await renderProducts(selection);
  } else if (textValue === 4) {
    const selection = parseInt(text.split('*')[3], 10);
    const result = await renderOfferings(client, selection);
    console.log('Farm offering status', result.status);
    offeringStatus.push(result.status);
    message = result.message;
  } else if (textValue === 5 && text.split('*')[4] !== '67') {
    const selection = text.split('*')[4];
    message = checkGroupAndIndividualPrice(offeringStatus[0][selection]);
  } else if (textValue === 6 && text.split('*')[5] === '1') {
    message = askForQuantity();
  } else if (textValue === 7 && parseInt(text.split('*')[6], 10) > 0) {
    const userQuantity = parseInt(text.split('*')[6], 10);
    message = confirmQuantityWithPrice(client, offersArray, userQuantity);
  } else if (textValue === 8 && text.split('*')[7] === '1') {
    message = addToCart(client, itemSelection, totalCost);
  } else if (textValue === 9 && text.split('*')[8] === '67') {
    message = await displayCartItems(client);
  } else if (textValue === 10 && text.split('*')[9] === '1') {
    message = checkOut();
    // } else if (textValue === 11 && text.split('*')[9] === '1' && text.split('*')[10] === '2') {
    //   message = checkoutUsingDifferentNumber();
    // } else if (textValue === 11 && text.split('*')[9] === '1' && text.split('*')[10] === '1') {
    //   message = displayTotalCost(client);
  } else if (textValue === 10 && text.split('*')[9] === '2') {
    message = updateCart();
  } else if (textValue === 11 && text.split('*')[10] === '1') {
    message = await updateType('remove');
  } else if (textValue === 11 && text.split('*')[10] === '2') {
    message = updateType('updateQuantity');
  } else if (textValue === 12 && text.split('*')[10] === '1') {
    const offeringId = text.split('*')[11];
    message = removeItemFromCart(offeringId);
  } else if (textValue === 12 && text.split('*')[10] === '2') {
    const offeringId = text.split('*')[11];
    const prompt = await updateQuantityinCart(offeringId);
    console.log('Prompt is', prompt);
    message = prompt.message;
  } else {
    message = `${con()} Option not found`;
    message += menus.footer;
  }
  return message;
};

export const updateCart = async (operation, id = null) => {
  if (operation === 'firstscreen') {
    message = `${con()} Choose an operation\n 1. Remove Item\n 2. Change Item quantity`;
    message += menus.footer;
  } else if (operation === 'removeItem') {
    message = await removeItemFromCart(id);
  } else if (operation === 'updateItemCount') {
    message = await updateQuantityinCart(id);
  } else {
    message = `${end()} Selection not found`;
  }
  return message;
};

export const cartOperations = async (text, textValue) => {
  const selection = text.split('*')[2];
  if (textValue === 2) {
    message = await displayCartItems(client);
    console.log('Cart stuff', message);
  } else if (selection === '1' && textValue === 3) {
    message = checkOut();
  } else if (selection === '2' && textValue === 3) {
    message = updateCart('firstscreen');
  } else if (textValue === 4 && text.split('*')[3] === '1') {
    message = await updateType('remove');
  } else if (textValue === 4 && text.split('*')[3] === '2') {
    message = await updateType('updateItemCount');
  } else if (textValue === 5 && text.split('*')[3] === '1') {
    const id = text.split('*')[4];
    message = await removeItemFromCart(id);
    console.log('Here is remove', message);
  } else if (textValue === 5 && text.split('*')[3] === '2') {
    const id = text.split('*')[4];
    const response = await updateQuantityinCart(id);
    message = response.message;
  } else if (textValue === 6 && text.split('*')[3] === '2') {
    const userQuantity = parseInt(text.split('*')[5], 10);
    console.log('User Quantity Text', userQuantity);
    message = await confirmQuantityWithPrice(userQuantity);
  } else if (textValue === 7 && text.split('*')[6] === '1') {
    message = confirmNewQuantity(client, itemSelection, totalCost);
  }
  return message;
};

// export const compareNewQuantity = async () => {
//   const offers = await retreiveCachedItems(client, ['offersArray']);
//   if ()
