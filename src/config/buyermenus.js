/* eslint-disable import/extensions */
import { menus } from './menuoptions.js';
import { promptToShow } from './prompts.js';
import { fetchCategories, fetchFarmOfferings, fetchProducts } from '../core/productmanagement.js';

let message = '';
const con = () => 'CON';
const end = () => 'END';

export const renderProductCategories = (res) => {
  console.log('Here');
  fetchCategories().then((response) => {
    console.log('Response at logging categories', response);
    if (response) {
      message = promptToShow(response, 'productcategories');
      res.send(message);
    } else {
      message = `${end()} Could not fetch categories at the moment, try later`;
      res.send(message);
    }
  });
};
export const renderProducts = (res, id) => {
  fetchProducts(id).then((response) => {
    if (response) {
      message = promptToShow(response, 'products');
      res.send(message);
    } else {
      message = `${con()} Could not fetch products at the moment try again later`;
      res.send(message);
    }
  });
};
export const renderFarmOfferings = (res, id) => {
  fetchFarmOfferings(id).then((response) => {
    if (response) {
      message = promptToShow(response, 'farmofferings');
      res.send(message);
    } else {
      message = `${con()} Could not fetch the farms that sell this produce`;
      message += menus.footer;
      res.send(message);
    }
  });
};