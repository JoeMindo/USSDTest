/* eslint-disable import/extensions */
import axios from 'axios';
import { fetchCategories, fetchProducts } from '../core/productmanagement.js';

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
    const productOffering = await axios.get('https://032f-197-232-124-171.ngrok.io/singleproductwithprice/1');
    // let offeringText = 'this';
    // if (farmOffering) {
    //   console.log('Farm offering', farmOffering);
    //   // farmOffering.data.forEach((index, offering) => {
    //   //   offeringText = `${index}. ${offering.message.product_name} from ${offering.message.farm_name}. Grade: ${offering.message.grade}\n GroupPrice: ${offering.message.group_price} Individual Price: ${offering.message.unit_price}`;
    //   // });
    //   message = `${con()} Choose a product to buy\n ${offeringText}`;
    // } else {
    //   message = `${con()} Could not fetch the produce`;
    // }
    console.log('Farm offering', productOffering);
    return message;
  } catch (err) {
    throw new Error(err);
  }
};