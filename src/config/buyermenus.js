/* eslint-disable import/extensions */
import axios from 'axios';
import { menus } from './menuoptions.js';
import { promptToShow } from './prompts.js';
import { fetchCategories, fetchFarmOfferings, fetchProducts } from '../core/productmanagement.js';

let message = '';
const con = () => 'CON';
const end = () => 'END';

export const renderProductCategories = async () => {
  const response = await fetchCategories();
  if (response) {
    message = `${con()} Choose a category\n ${response}`;
  } else {
    message = `${end()} Could not fetch categories at the moment, try later`;
  }
  return message;
};

export const renderProducts = async (id) => {
  const response = await fetchProducts(id);
  if (response) {
    message = `${con()} Choose a product to buy\n ${response}`;
  } else {
    message = `${con()} Could not fetch products at the moment try again later`;
  }
  return message;
};
export const renderOfferings = async () => {
  const farmOffering = await axios.get('https://599f-197-232-124-171.ngrok.io/singleproductwithprice/1');
  let offeringText;
  if (farmOffering) {
    console.log('Farm offering', farmOffering);
    farmOffering.data.forEach((index, offering) => {
      offeringText = `${index}. ${offering.message.product_name} from ${offering.message.farm_name}. Grade: ${offering.message.grade}\n GroupPrice: ${offering.message.group_price} Individual Price: ${offering.message.unit_price}`;
    });
    message = `${con()} Choose a product to buy\n ${offeringText}`;
  } else {
    message = `${con()} Could not fetch the produce`;
  }
  return message;
};