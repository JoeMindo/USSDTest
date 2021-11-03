/* eslint-disable import/extensions */
import axios from 'axios';
import { fetchCategories, fetchProducts } from '../core/productmanagement.js';
import { retreiveHashItems } from '../core/services.js';
import { menus } from './menuoptions.js';
import { BASEURL } from './urls.js';

let message = '';
const con = () => 'CON';
const end = () => 'END';
const userViewOffers = {};
const offersArray = [];

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
    let offeringText;
    if (productOffering.data.message.data.status !== '3' && productOffering.data.status !== 'error') {
      const offers = productOffering.data.message.data;
      offers.forEach((offer) => {
        offeringText = `${offer.id}. ${offer.product_name} from ${offer.farm_name} Grade: ${offer.grade} `;
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
      console.log('User offers are', userViewOffers);
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

export const confirmQuantityWithPrice = async (arrayOfOffers) => {
  // TODO:confirm quantity
  let availableUnits;
  // let unitPrice;
  // if (quantity <= availableUnits) {
  //   const price = quantity * unitPrice;
  //   message = `${con()} Buying ${quantity} ${item} from ${relevantFarm} Grade${itemGrade} at ${price}\n 1. Add To Cart`;
  // } else {
  //   message = `${con()} The quantity you requested is more than the available`;
  // }
  // message += menus.footer;
  // return message;
  arrayOfOffers.forEach((offer) => {
    offer[0].available_units;
  });
};