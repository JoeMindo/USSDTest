/* eslint-disable import/extensions */
import { menus } from './menuoptions.js';
import { fetchCategories, fetchFarmOfferings, fetchProducts } from '../core/productmanagement.js';

let message = '';
const con = () => 'CON';
const end = () => 'END';

export const renderProductCategories = (res) => {
  console.log('Function is called');
  fetchCategories().then((response) => {
    console.log('Response at logging product', response);
    if (response) {
      let menuPrompt = '';
      menuPrompt += response;
      message = `${con()} Choose a category`;
      message += menuPrompt;
      message += menus.footer;
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
      console.log('New product', response);
      let menuPrompt = '';
      menuPrompt += response;
      message = `${con()} Choose a product\n`;
      message += menuPrompt;
      message += menus.footer;
      res.send(message);
    } else {
      message = `${con()} Could not fetch`;
      message += menus.footer;
      res.send(message);
    }
  });
};
export const renderFarmOfferings = (res, id) => {
  fetchFarmOfferings(id).then((response) => {
    if (response) {
      console.log('New product', response);
      let menuPrompt = '';
      menuPrompt += response;
      message = `${con()} Choose an offer\n`;
      message += menuPrompt;
      message += menus.footer;
      res.send(message);
    } else {
      message = `${con()} Could not fetch`;
      message += menus.footer;
      res.send(message);
    }
  });
};