import {
  fetchCategories,
} from '../../products/productmanagement.js';
import { menus } from '../../menus/menuoptions.js';

let message = '';
const con = () => 'CON';
const end = () => 'END';

const centersMapping = {
  1: 'Center 1',
  2: 'Center 2',
  3: 'Center 4',
};

export const priceToUse = (availablePriceType, choice) => {
  let status;
  if (
    (availablePriceType === 'both' && choice === '1')
    || availablePriceType === 'unit'
  ) {
    status = 'unit';
  } else if (
    (availablePriceType === 'both' && choice === '2')
    || availablePriceType === 'group'
  ) {
    status = 'group';
  }

  return status;
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

export const askForQuantity = () => {
  message = `${con()} Enter quantity you want to buy\n`;
  message += menus.footer;
  return message;
};
// Array of offers should be cached


export const chooseCenter = (administrativeID) => {
  let message = `${con()} Choose a place where you will pick your goods\n`;
  const center = centersMapping[`${administrativeID}`];
  message += `1. ${center}`;
  return message;
};

export const showAvailableProducts = async (client, textValue, text) => {
  // Added client
  if (textValue === 2) {
    message = await renderProductCategories();
  } else if (textValue === 3) {
    const selection = parseInt(text.split('*')[2], 10);
    message = await renderProducts(selection);
  } else if (textValue === 4) {
    const selection = parseInt(text.split('*')[3], 10);
    const result = await renderOfferings(client, selection);

    offeringStatus.push(result.status);

    message = result.message;
  } else if (textValue === 5) {
    const selection = parseInt(text.split('*')[4], 10);
    message = checkGroupAndIndividualPrice(
      offeringStatus[`${offeringStatus.length - 1}`][`${selection}`],
    );
  } else if (textValue === 6) {
    message = askForQuantity();
  } else if (textValue === 7 && parseInt(text.split('*')[6], 10) > 0) {
    const userQuantity = parseInt(text.split('*')[6], 10);
    const id = text.split('*')[4];
    const typeOfOffering = offeringStatus[offeringStatus.length - 1];
    const selection = parseInt(text.split('*')[4], 10);
    const purchasingOption = text.split('*')[5];
    const availablePrice = typeOfOffering[`${selection}`];
    const price = priceToUse(availablePrice, purchasingOption);
    message = confirmQuantityWithPrice(userQuantity, id, price);
  } else if (textValue === 8 && text.split('*')[7] === '1') {
    message = await addToCart(client, itemSelection, totalCost);
  } else if (textValue === 9 && text.split('*')[8] === '1') {
    message = await cartOperations(text, 'inner', 1);
  } else if (textValue === 9 && text.split('*')[8] === '67') {
    message = await cartOperations(text, 'inner', 0);
  } else if (textValue === 10 && text.split('*')[9] === '1') {
    message = await cartOperations(text, 'inner', 8);
  } else if (textValue === 10 && text.split('*')[9] === '2') {
    message = await cartOperations(text, 'inner', 1);
  } else if (textValue === 11 && text.split('*')[10] === '1') {
    message = await cartOperations(text, 'inner', 2);
  } else if (textValue === 11 && text.split('*')[10] === '2') {
    message = await cartOperations(text, 'inner', 3);
  } else if (textValue === 12 && text.split('*')[10] === '1') {
    // TODO: Convert to a string
    const itemID = parseInt(text.split('*')[11], 10);
    message = await cartOperations(text, 'inner', 4, itemID);
  } else if (textValue === 12 && text.split('*')[10] === '2') {
    // TODO: Convert to a string
    const itemID = parseInt(text.split('*')[11], 10);
    message = await cartOperations(text, 'inner', 5, itemID);
  } else if (textValue === 13 && text.split('*')[10] === '2') {
    const itemID = parseInt(text.split('*')[11], 10);
    const index = parseInt(text.split('*')[12], 10);
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

export const makePayment = () => `${con()} Make payment here`;
