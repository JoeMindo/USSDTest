import { menus } from './menuoptions.js';

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
  } else if (textValue === 7) {
    let menuPrompt = `${con()} ${menus.submitDetails}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else if (textValue === 8 && text.split('*')[7] === '1') {
    completedStatus = true;
  } else {
    message = 'CON Invalid choice';
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
  menuPrompt += menus.farmer.updateListedProduce;
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
