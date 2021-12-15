/* eslint-disable import/extensions */
/* eslint-disable import/no-cycle */
/* eslint-disable import/prefer-default-export */

import { menus } from './menuoptions.js';
import * as farmerMenus from './farmermenus.js';
import * as buyermenus from './buyermenus.js';
import * as groupOrderMenus from './groupOrder.js';
import { client } from '../server.js';
import { offersArray } from './buyermenus.js';
import { retreiveCachedItems } from '../core/services.js';

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
  menuPrompt += `${menus.buyermenu.myCart}\n`;
  menuPrompt += `${menus.buyermenu.myOrders}\n`;
  menuPrompt += `${menus.buyermenu.groupOrder}\n`;
  menuPrompt += menus.footer;
  message = menuPrompt;
  return message;
};

export const checkBuyerSelection = async (textValue, text) => {
  console.log('The text value is', textValue);
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
      } else if (textValue === 5 && text.split('*')[2] === '1' && text.split('*')[3] === '1') {
        // TODO: Make payment
        message = await buyermenus.cartOperations(text, 'outer', 9);
      } else if (textValue === 5 && text.split('*')[3] === '1') {
        const id = parseInt(text.split('*')[4], 10);
        message = await buyermenus.cartOperations(text, 'outer', 4, id);
      } else if (textValue === 5 && text.split('*')[3] === '2') {
        const id = parseInt(text.split('*')[4], 10);
        message = await buyermenus.cartOperations(text, 'outer', 5, id);
      } else if (textValue === 6 && text.split('*')[3] === '1' && text.split('*')[5] === '67') {
        message = await buyermenus.cartOperations(text, 'outer', 0);
      } else if (textValue === 6 && text.split('*')[3] === '2') {
        const id = parseInt(text.split('*')[4], 10);
        const newQuantity = parseInt(text.split('*')[5], 10);
        message = await buyermenus.cartOperations(text, 'outer', 6, id, newQuantity);
      } else if (textValue === 7 && text.split('*')[3] === '2') {
        const id = parseInt(text.split('*')[4], 10);
        message = await buyermenus.cartOperations(text, 'outer', 6, id);
      }
    } else if (selection === '3') {
      let userId = await retreiveCachedItems(client, ['user_id']);
      userId = parseInt(userId[0], 10);
      const result = await buyermenus.viewOrders(userId);
      message = `${con()} ${result}`;
      message += menus.footer;
    } else if (selection === '4') {
      // const status = await groupOrderMenus.checkIfUserIsInGroup();
      message = groupOrderMenus.actionToTake(false);
      if (textValue === 3) {
        message = groupOrderMenus.requestGroupName();
      } else if (textValue === 4) {
        let userId = await retreiveCachedItems(client, ['user_id']);
        userId = parseInt(userId[0], 10);
        const groupData = {
          dean_id: 4,
          group_name: text.split('*')[3],
          group_type: 2,
          status: 1,
        };
        const response = await groupOrderMenus.createGroup(groupData);
        message = groupOrderMenus.groupCreationMessage(response);
      } else {
        // const groupMembershipStatus = await groupOrderMenus.checkIfUserIsInGroup();
        // if (typeof groupMembershipStatus === 'number') {
        //   // const groupID = groupMembershipStatus;
        //   console.log('The next stop');
        // }
        message = await groupOrderMenus.groupPricedItems(textValue, text);
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
