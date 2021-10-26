/* eslint-disable import/extensions */
/* eslint-disable import/no-cycle */
/* eslint-disable import/prefer-default-export */

import { menus } from './menuoptions.js';
import * as farmerMenus from './farmermenus.js';
import * as buyermenus from './buyermenus.js';

export const con = () => 'CON';
export const end = () => 'END';
let message = '';

// Register Menus
let completedStatus = false;
export const renderRegisterMenu = (textValue, text) => {
  if (textValue === 1 && text.length === 0) {
    let menuPrompt = `${con()} ${menus.register.firstname}`;
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
export const renderLoginMenus = (textValue, text) => {
  if (textValue === 1 && text.length === 0) {
    let menuPrompt = `${con()} ${menus.login.password}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else {
    completedStatus = true;
  }

  return { message, completedStatus };
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
  let menuPrompt = `${con()} ${menus.buyermenu.viewProducts}`;
  menuPrompt += menus.footer;
  message = menuPrompt;
  return message;
};

export const checkBuyerSelection = (res, textValue, text) => {
  if (textValue === 1) {
    buyermenus.renderProductCategories(res);
  } else if (textValue === 2) {
    const selection = parseInt(text.split('*')[1], 10);
    buyermenus.renderProducts(res, selection);
  } else if (textValue === 3) {
    const selection = parseInt(text.split('*')[2], 10);
    buyermenus.renderFarmOfferings(res, selection);
  }
};
export const checkFarmerSelection = (text, res, textValue) => {
  const selection = text.split('*')[1];
  if (selection === '1') {
    farmerMenus.renderUpdateLocationMenu(res, textValue, text);
  } else if (selection === '2') {
    farmerMenus.renderAddFarmDetailsMenu(res, textValue, text);
  } else if (selection === '3') {
    farmerMenus.renderFarmerAddProductMenu(res, textValue, text);
  } else if (selection === '4') {
    farmerMenus.renderFarmerUpdateDetailsMenu(res, textValue, text);
  } else {
    res.send('CON Invalid Choice');
  }
};
