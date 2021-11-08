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
const offeringStatus = [];

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
  let menuPrompt = `${con()} ${menus.buyermenu.viewProducts}`;
  menuPrompt += menus.footer;
  message = menuPrompt;
  return message;
};

export const checkBuyerSelection = async (textValue, text) => {
  if (textValue === 1) {
    message = renderBuyerMenus();
  } else if (textValue === 2) {
    message = await buyermenus.renderProductCategories();
  } else if (textValue === 3) {
    const selection = parseInt(text.split('*')[2], 10);
    console.log('Selection is', selection);
    message = await buyermenus.renderProducts(selection);
  } else if (textValue === 4) {
    const selection = parseInt(text.split('*')[3], 10);
    const result = await buyermenus.renderOfferings(client, selection);
    console.log('Farm offering status', result.status);
    offeringStatus.push(result.status);
    message = result.message;

    console.log('Farm offerings', message);
  } else if (textValue === 5 && text.split('*')[4] !== '67') {
    const selection = text.split('*')[4];
    message = buyermenus.checkGroupAndIndividualPrice(offeringStatus[0][selection]);
  } else if (textValue === 6 && text.split('*')[5] === '1') {
    message = buyermenus.askForQuantity();
  } else if (textValue === 7 && parseInt(text.split('*')[6], 10) > 0) {
    const userQuantity = parseInt(text.split('*')[6], 10);
    message = buyermenus.confirmQuantityWithPrice(client, offersArray, userQuantity);
  } else if (textValue === 8 && text.split('*')[7] === '1') {
    message = buyermenus.addToCart(buyermenus.itemSelection, buyermenus.totalCost);
  } else if (textValue === 9 && text.split('*')[8] === '67') {
    message = await buyermenus.displayCartItems(client);
  } else if (textValue === 10 && text.split('*')[9] === '1') {
    message = buyermenus.checkOut();
  } else if (textValue === 11 && text.split('*')[9] === '1' && text.split('*')[10] === '2') {
    message = buyermenus.checkoutUsingDifferentNumber();
  } else if (textValue === 11 && text.split('*')[9] === '1' && text.split('*')[10] === '1') {
    message = buyermenus.displayTotalCost(client);
  } else if (textValue === 10 && text.split('*')[9] === '2') {
    message = buyermenus.updateCart();
  } else if (textValue === 11 && text.split('*')[10] === '1') {
    message = buyermenus.updateType('remove');
  } else if (textValue === 11 && text.split('*')[10] === '2') {
    message = buyermenus.updateType('updateQuantity');
  } else if (textValue === 12 && text.split('*')[10] === '1') {
    const offeringId = text.split('*')[11];
    message = buyermenus.removeItemFromCart(offeringId);
  } else if (textValue === 12 && text.split('*')[10] === '2') {
    const offeringId = text.split('*')[11];
    message = buyermenus.updateQuantityinCart(offeringId);
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
