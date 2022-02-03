/* eslint-disable import/no-cycle */
import axios from 'axios';
import {
  fetchCategories,
  fetchProducts,
  confirmQuantityWithPrice,
  itemSelection,
} from './productmanagement.js';
import { con, end } from '../menus/rendermenu.js';
import { BASEURL } from '../core/urls.js';
import { menus } from '../menus/menuoptions.js';
import {
  cartOperations,
  askForQuantity,
  priceToUse,
  addToCart,
} from '../cart/cartoperations.js';

let message;
export const offersArray = [];
export const cartItems = [];
export const totalCost = {};

export const offeringStatus = [];

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
export const renderOffers = (offers, offersArray, client) => {
  const status = {};
  let offeringText = '';
  offers.forEach((offer) => {
    const userViewOffers = {};

    if (offer.status !== '0') {
      offeringText += `\n${offer.id}. ${offer.product_name} from ${offer.farm_name} Grade: ${offer.grade} KES ${offer.group_price}`;
      userViewOffers.id = `${offer.id}`;
      userViewOffers.product = `${offer.product_name}`;
      userViewOffers.farmName = `${offer.farm_name}`;
      userViewOffers.grade = `${offer.grade}`;
      userViewOffers.product_id = `${offer.product_id}`;
      userViewOffers.availableUnits = `${offer.available_units}`;
      userViewOffers.groupPrice = `${offer.group_price}`;
      status[offer.id] = 'group';
    }
    offersArray.push(userViewOffers);

    client.set('groupOffersArray', JSON.stringify(offersArray));
  });
  const message = `CON Choose one of the available options to buy. ${offeringText}`;
  return message;
};
export const renderProductCategories = async () => {
  try {
    const response = await fetchCategories();

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
export const checkGroupAndIndividualPrice = (status) => {
  if (status === 'both') {
    message = `${con()} Select the price you want to buy at\n 1. Unit Price\n 2. Group price \n`;
  } else if (status === 'unit') {
    message = `${con()} Buy item at unit price\n 1. Yes\n `;
  } else if (status === 'group') {
    message = `${con()} Buy item at group price 1. Yes\n `;
  }
  message += menus.footer;
  return message;
};

export const renderOfferings = async (client, id) => {
  const status = {};

  const endpointUrl = `${BASEURL}/ussd/productwithprice/product`;
  const productOffering = await axios.get(`${endpointUrl}/${id}`).catch((err) => err.response);
  client.set('viewedProductID', id);

  let offeringText = '';
  if (
    productOffering.status === 200
  ) {
    const offers = productOffering.data.message.data;

    offers.forEach((offer) => {
      const userViewOffers = {};
      offeringText += `\n${offer.id}. ${offer.product_name} from ${offer.farm_name} Grade: ${offer.grade}\nKES ${offer.unit_price} `;
      userViewOffers.id = `${offer.id}`;
      userViewOffers.product = `${offer.product_name}`;
      userViewOffers.farmName = `${offer.farm_name}`;
      userViewOffers.grade = `${offer.grade}`;
      userViewOffers.product_id = `${offer.product_id}`;
      userViewOffers.availableUnits = `${offer.available_units}`;
      userViewOffers.unitPrice = `${offer.unit_price}`;
      status[offer.id] = 'unit';
      offersArray.push(userViewOffers);
      client.set('offersArray', JSON.stringify(offersArray));
    });

    message = `${con()} Choose one of the available options to buy. ${offeringText}`;
  } else {
    message = `${con()} Product not available`;
    message += menus.footer;
  }
  return {
    message,
    status,
  };
};

export const showAvailableProducts = async (client, textValue, text) => {
  // Added client
  if (textValue === 1) {
    message = await renderProductCategories();
  } else if (textValue === 2) {
    const selection = parseInt(text.split('*')[1], 10);
    message = await renderProducts(selection);
  } else if (textValue === 3) {
    const selection = parseInt(text.split('*')[2], 10);
    const result = await renderOfferings(client, selection);
    offeringStatus.push(result.status);

    message = result.message;
  } else if (textValue === 4) {
    const selection = parseInt(text.split('*')[3], 10);
    message = checkGroupAndIndividualPrice(
      offeringStatus[`${offeringStatus.length - 1}`][`${selection}`],
    );
  } else if (textValue === 5) {
    message = askForQuantity();
  } else if (textValue === 6 && parseInt(text.split('*')[5], 10) > 0) {
    const userQuantity = parseInt(text.split('*')[5], 10);
    const id = text.split('*')[3];
    const typeOfOffering = offeringStatus[offeringStatus.length - 1];
    const selection = parseInt(text.split('*')[3], 10);
    const purchasingOption = text.split('*')[4];
    const availablePrice = typeOfOffering[`${selection}`];
    const price = priceToUse(availablePrice, purchasingOption);
    message = await confirmQuantityWithPrice(userQuantity, id, price, client);
  } else if (textValue === 7 && text.split('*')[6] === '1') {
    message = await addToCart(client, itemSelection, totalCost);
  } else if (textValue === 8 && text.split('*')[7] === '1') {
    message = await cartOperations(text, 'inner', 1);
  } else if (textValue === 8 && text.split('*')[7] === '67') {
    message = await cartOperations(text, 'inner', 0);
  } else if (textValue === 9 && text.split('*')[8] === '1') {
    message = await cartOperations(text, 'inner', 8);
  } else if (textValue === 9 && text.split('*')[8] === '2') {
    message = await cartOperations(text, 'inner', 1);
  } else if (textValue === 10 && text.split('*')[9] === '1') {
    message = await cartOperations(text, 'inner', 2);
  } else if (textValue === 10 && text.split('*')[9] === '2') {
    message = await cartOperations(text, 'inner', 3);
  } else if (textValue === 11 && text.split('*')[9] === '1') {
    // TODO: Convert to a string
    const itemID = parseInt(text.split('*')[10], 10);
    message = await cartOperations(text, 'inner', 4, itemID);
  } else if (textValue === 11 && text.split('*')[9] === '2') {
    // TODO: Convert to a string
    const itemID = parseInt(text.split('*')[10], 10);
    message = await cartOperations(text, 'inner', 5, itemID);
  } else if (textValue === 12 && text.split('*')[10] === '2') {
    const itemID = parseInt(text.split('*')[10], 10);
    const index = parseInt(text.split('*')[11], 10);
    // Point A

    message = await cartOperations(text, 'inner', 6, itemID, index);
  } else if (
    textValue === 13
    && text.split('*')[10] === '1'
    && text.split('*')[12] === '67'
  ) {
    message = await cartOperations(text, 'inner', 0);
  }
  return message;
};

export default renderOffers;
