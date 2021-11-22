/* eslint-disable import/extensions */
/* eslint-disable import/no-cycle */
/* eslint-disable import/prefer-default-export */

import { menus } from './menuoptions.js';
import * as farmerMenus from './farmermenus.js';
import * as buyermenus from './buyermenus.js';
import { client } from '../server.js';
import { offersArray } from './buyermenus.js';

export const con = () => 'CON';
export const end = () => 'END';
let message = '';

let completedStatus = false;
export const renderRegisterMenu = (textValue, text) => {
  if (textValue === 1 && text.length === 0) {
    let menuPrompt = `${con()} Welcome to Mamlaka\n${menus.register.firstname}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else if (textValue === 1) {
    let menuPrompt = `${con()} ${menus.register.lastname}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else if (textValue === 2) {
    let menuPrompt = `${con()} ${menus.register.idNumber}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else if (textValue === 3) {
    let menuPrompt = `${con()} ${menus.register.gender}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else if (textValue === 4) {
    let menuPrompt = `${con()} ${menus.register.password}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else if (textValue === 5) {
    let menuPrompt = `${con()} ${menus.register.confirmPassword}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else if (textValue === 6) {
    let menuPrompt = `${con()} ${menus.register.role}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else {
    let menuPrompt = `${con()} ${menus.submitDetails}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
    completedStatus = true;
  }
  return {
    message,
    completedStatus,
  };
};

// Login Menu
export const renderLoginMenus = () => {
  let menuPrompt = `${con()} ${menus.login.password}`;
  menuPrompt += menus.footer;
  message = menuPrompt;
  return message;
};

export const renderFarmerMenus = () => {
  let menuPrompt = `${con()} ${menus.farmer.updateLocation}`;
  menuPrompt += menus.farmer.addFarmDetails;
  menuPrompt += menus.farmer.addProduct;
  menuPrompt += menus.farmer.updateDetails;
  menuPrompt += menus.footer;
  message = menuPrompt;
  return message;
};
export const renderBuyerMenus = () => {
  let menuPrompt = `${con()} ${menus.buyermenu.viewProducts}\n`;
  // menuPrompt += `${menus.buyermenu.myCart}\n`;
  menuPrompt += menus.footer;
  message = menuPrompt;
  return message;
};

export const checkBuyerSelection = async (textValue, text) => {
  if (textValue === 1) {
    message = renderBuyerMenus();
  } else {
    const selection = text.split('*')[1];
    if (selection === '1') {
      message = await buyermenus.showAvailableProducts(textValue, text);
    } else if (selection === '2') {
      if (textValue === 2) {
        message = await buyermenus.cartOperations(text, 'outer', 0);
      } else if (textValue === 3 && text.split('*')[2] === '1') {
        message = await buyermenus.cartOperations(text, 'outer', 1);
      } else if (textValue === 3 && text.split('*')[2] === '2') {
        message = await buyermenus.cartOperations(text, 'outer', 1);
      } else if (textValue === 4 && text.split('*')[2] === '1' && text.split('*')[3] === '1') {
        message = await buyermenus.cartOperations(text, 'outer', 8);
      } else if (textValue === 4 && text.split('*')[3] === '1') {
        message = await buyermenus.cartOperations(text, 'outer', 2);
      } else if (textValue === 4 && text.split('*')[3] === '2') {
        message = await buyermenus.cartOperations(text, 'outer', 3);
      } else if (textValue === 5 && text.split('*')[3] === '1') {
        const id = text.split('*')[4];
        message = await buyermenus.cartOperations(text, 'outer', 4, id);
      } else if (textValue === 5 && text.split('*')[3] === '2') {
        const id = text.split('*')[4];
        message = await buyermenus.cartOperations(text, 'outer', 5, id);
      } else if (textValue === 6 && text.split('*')[3] === '1' && text.split('*')[5] === '67') {
        message = await buyermenus.cartOperations(text, 'outer', 0);
      } else if (textValue === 6 && text.split('*')[3] === '2') {
        message = await buyermenus.cartOperations(text, 'outer', 7);
      }
    }
  }

  return message;
};
export const checkFarmerSelection = async (text, textValue) => {
  if (textValue === 1) {
    message = renderFarmerMenus();
  } else {
    const selection = text.split('*')[1];
    if (selection === '1') {
      message = await farmerMenus.renderUpdateLocationMenu(textValue, text);
    } else if (selection === '2') {
      message = await farmerMenus.renderAddFarmDetailsMenu(textValue, text);
    } else if (selection === '3') {
      message = farmerMenus.renderFarmerAddProductMenu(textValue, text);
    } else if (selection === '4') {
      message = farmerMenus.renderFarmerUpdateDetailsMenu(textValue, text);
    } else {
      message = 'CON Invalid choice, try again';
    }
  }
  return message;
};
