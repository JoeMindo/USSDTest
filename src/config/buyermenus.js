/* eslint-disable import/extensions */
import axios from 'axios';
import { fetchCategories, fetchProducts } from '../core/productmanagement.js';
import { BASEURL } from './urls.js';

let message = '';
const con = () => 'CON';
const end = () => 'END';

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
export const renderOfferings = async () => {
  try {
    const productOffering = await axios.get(`${BASEURL}/api/singleproductwithprice/1`);
    let offeringText;
    if (productOffering.data.message.status !== '3') {
      const offer = productOffering.data.message;
      console.log('Farm offering', productOffering);
      offeringText = `${offer.product_name} from ${offer.farm_name} Grade: ${offer.grade} `;
      if (offer.status === '0') {
        offeringText += `KES ${offer.unit_price}`;
      } else if (offer.status === '1') {
        offeringText += `KES ${offer.group_price}`;
      } else {
        offeringText += `Group price: ${offer.group_price}, Unit Price: ${offer.unit_price}`;
      }
      message = `${con()} Choose a product to buy\n ${offeringText}`;
    } else {
      message = `${con()} Product not available`;
    }
    console.log('Farm offering', productOffering);
    return message;
  } catch (err) {
    throw new Error(err);
  }
};