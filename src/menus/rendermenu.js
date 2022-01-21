import { menus } from './menuoptions.js';

export const con = () => 'CON';
export const end = () => 'END';
let message = '';

let completedStatus = false;
/**
 * It takes in the text value and text from the user and checks if the text value is equal to the
number of the text value in the menus.register object. If it is, it returns the corresponding text
from the menus.register object. If it isn't, it returns the message 'CON Invalid choice'.
 * @param textValue - The current text value of the user.
 * @param text - The user's input
 * @returns {
 *   message: 'CON Welcome to Mamlaka\nWhat is your first name?',
 *   completedStatus: false,
 * }
 */
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

/**
 * This function renders the login menu prompt.
 * @returns A string that is the prompt for the user to enter their password.
 */
export const renderLoginMenus = () => {
  let menuPrompt = `${con()} ${menus.login.password}`;
  menuPrompt += menus.footer;
  message = menuPrompt;
  return message;
};

/**
 * This function renders the menus for the farmer.
 * @returns A string that is the message that is displayed to the user.
 */
export const renderFarmerMenus = () => {
  let menuPrompt = `${con()} ${menus.farmer.updateLocation}`;
  menuPrompt += menus.farmer.addFarmDetails;
  menuPrompt += menus.farmer.addProduct;
  menuPrompt += menus.farmer.updateDetails;
  menuPrompt += menus.farmer.updateListedProduce;
  menuPrompt += menus.more;
  message = menuPrompt;
  return message;
};

/**
 * This function renders the second level of the farmer menu.
 * @returns A string that is the message that is being displayed to the user.
 */
export const renderFarmerMenusLevelTwo = () => {
  let menuPrompt = `${con()} ${menus.farmer.joinGroup}`;
  menuPrompt += `${menus.farmer.cropCalendar}`;
  message = menuPrompt;
  return message;
};

export const renderCropCalendarMenus = () => {
  const menuPrompt = `${con()} ${menus.farmer.cropCalendarMenus}`;
  message = menuPrompt;
  return message;
};
/**
 * This function renders the buyer menu.
 * @returns A string that is the message that is to be sent to the user.
 */
export const renderBuyerMenus = () => {
  let menuPrompt = `${con()} ${menus.buyermenu.viewProducts}\n`;
  menuPrompt += `${menus.buyermenu.myCart}\n`;
  menuPrompt += `${menus.buyermenu.myOrders}\n`;
  menuPrompt += `${menus.buyermenu.groupOrder}\n`;
  menuPrompt += menus.footer;
  message = menuPrompt;
  return message;
};
