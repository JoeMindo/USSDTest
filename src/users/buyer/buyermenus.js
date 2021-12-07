import axios from 'axios';
import {
  fetchCategories,
  fetchProducts,
} from '../../products/productmanagement.js';
import { menus } from '../../menus/menuoptions.js';
import { BASEURL } from '../../core/urls.js';
import { retreiveCachedItems } from '../../core/services.js';
import { cartOperations } from '../../cart/cartoperations.js';

let message = '';
const con = () => 'CON';
const end = () => 'END';

export const offersArray = [];
export const cartItems = [];
export const totalCost = {};
export const itemSelection = {};
const offeringStatus = [];

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
    client.set('viewedProductID', id);

    let offeringText = '';
    if (
      productOffering.data.message.status !== '3'
      && productOffering.data.status !== 'error'
    ) {
      const offers = productOffering.data.message.data;

      offers.forEach((offer) => {
        const userViewOffers = {};
        offeringText += `\n${offer.id}. ${offer.product_name} from ${offer.farm_name} Grade: ${offer.grade} `;
        userViewOffers.id = `${offer.id}`;
        userViewOffers.product = `${offer.product_name}`;
        userViewOffers.farmName = `${offer.farm_name}`;
        userViewOffers.grade = `${offer.grade}`;
        userViewOffers.product_id = `${offer.product_id}`;
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
      // offeringText += menus.viewCart;

      message = `${con()} Choose one of the available options to buy. ${offeringText}`;
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

export const askForQuantity = () => {
  message = `${con()} Enter quantity you want to buy\n`;
  message += menus.footer;
  return message;
};
// Array of offers should be cached

export const confirmQuantityWithPrice = async (
  userQuantity,
  productID,
  status,
  client,
) => {
  let availableUnits = 0;
  let pricePoint;
  let offers = await retreiveCachedItems(client, ['offersArray']);
  offers = JSON.parse(offers);
  const buyerSelection = offers.filter((item) => item.id === productID);

  availableUnits = buyerSelection[0].availableUnits;

  if (userQuantity > availableUnits) {
    message = `${con()} The amount you set is higher than the available units go back and choose a smaller quantity`;
  } else {
    if (status === 'unit') {
      pricePoint = parseInt(buyerSelection[0].unitPrice, 10);
    } else if (status === 'group') {
      pricePoint = parseInt(buyerSelection[0].groupPrice, 10);
    }

    const total = userQuantity * pricePoint;

    const prompt = `${buyerSelection[0].product} from ${buyerSelection[0].farmName} of grade:${buyerSelection[0].grade} at ${pricePoint}`;

    itemSelection.id = parseInt(`${buyerSelection[0].id}`, 10);
    itemSelection.product = `${buyerSelection[0].product}`;
    itemSelection.farmName = `${buyerSelection[0].farmName}`;
    itemSelection.grade = `${buyerSelection[0].grade}`;
    // TODO: This should return an integer
    itemSelection.product_id = parseInt(`${buyerSelection[0].product_id}`, 10);
    itemSelection.userQuantity = parseInt(`${userQuantity}`, 10);
    itemSelection.unitPrice = pricePoint;
    itemSelection.totalCost = total;
    message = `${con()} Buy ${prompt}\n Total ${total}\n 1. Add to cart`;
  }
  message += menus.footer;
  return message;
};

export const checkoutUsingDifferentNumber = () => {
  message = `${con()} Enter phone number to checkout with`;
  message += menus.footer;
  return message;
};

export const chooseCenter = (administrativeID) => {
  let message = `${con()} Choose a place where you will pick your goods\n`;
  const center = centersMapping[`${administrativeID}`];
  message += `1. ${center}`;
  return message;
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

    offeringStatus.push(result.status);

    message = result.message;
  } else if (textValue === 5) {
    const selection = parseInt(text.split('*')[4], 10);
    message = checkGroupAndIndividualPrice(
      offeringStatus[offeringStatus.length - 1][selection],
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
