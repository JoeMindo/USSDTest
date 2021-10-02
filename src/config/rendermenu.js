const { is } = require('bluebird');
const menus = require('../../config/menus.json');

const con = () => 'CON';
const end = () => 'END';
let message = '';

// Register Menus
const renderRegisterMenu = (selection, textValue) => {
  if (selection === isRegistration && textValue === 1) {
    let menuPrompt = `${con()} ${menus.register.firstname}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else if (selection === isRegistration && textValue === 2) {
    let menuPrompt = `${con()} ${menus.register.lastname}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else if (selection === isRegistration && textValue === 3) {
    let menuPrompt = `${con()} ${menus.register.idNumber}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else if (selection === isRegistration && textValue === 4) {
    let menuPrompt = `${con()} ${menus.register.gender}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else if (selection === isRegistration && textValue === 5) {
    let menuPrompt = `${con()} ${menus.register.password}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else if (selection === isRegistration && textValue === 6) {
    let menuPrompt = `${con()} ${menus.register.confirmPassword}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else if (selection === isRegistration && textValue === 7) {
    let menuPrompt = `${con()} ${menus.register.role}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  }
};

// Login Menu
const renderRegisterMenus = (selection, textValue) => {
  if (selection === isRegistration && textValue === 1) {
    let menuPrompt = `${con()} ${menus.register.firstname}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else if (selection === isRegistration && textValue === 2) {
    let menuPrompt = `${con()} ${menus.register.lastname}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else if (selection === isRegistration && textValue === 3) {
    let menuPrompt = `${con()} ${menus.register.idNumber}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else if (selection === isRegistration && textValue === 4) {
    let menuPrompt = `${con()} ${menus.register.gender}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else if (selection === isRegistration && textValue === 5) {
    let menuPrompt = `${con()} ${menus.register.password}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else if (selection === isRegistration && textValue === 6) {
    let menuPrompt = `${con()} ${menus.register.confirmPassword}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else if (selection === isRegistration && textValue === 7) {
    let menuPrompt = `${con()} ${menus.register.role}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  }
  return message;
};
// Login Menu
const renderLoginMenus = (selection, textValue) => {
  if (selection === isLogin && textValue === 1) {
    let menuPrompt = `${con()} ${menus.login.phone}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else {
    let menuPrompt = `${con()} ${menus.login.password}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  }
  return message;
};

// Farmer Menus
const renderUpdateLocationMenu = () => {
  let menuPrompt = `${con()} ${menus.farmer.updateLocation}`;
  menuPrompt += menus.footer;
  message = menuPrompt;
  return message;
};
const renderAddFarmDetailsMenu = () => {
  let menuPrompt = `${con()} ${menus.farmer.addFarmDetails}`;
  menuPrompt += menus.footer;
  message = menuPrompt;
  return message;
};
const renderAddProductMenu = () => {
  let menuPrompt = `${con()} ${menus.farmer.addProduct}`;
  menuPrompt += menus.footer;
  message = menuPrompt;
  return message;
};
const renderFarmerUpdateDetailsMenu = () => {
  let menuPrompt = `${con()} ${menus.farmer.updateDetails}`;
  menuPrompt += menus.footer;
  message = menuPrompt;
  return message;
};


export default { renderRegisterMenu, renderLoginMenus };