/* eslint-disable import/prefer-default-export */
import { text } from 'express';
import { menus } from './menus.js';

const con = () => 'CON';
const end = () => 'END';
let message = '';

let isLogin;

// Register Menus
let completedStatus = false;
export const renderRegisterMenu = (textValue) => {
  if (textValue === 1) {
    let menuPrompt = `${con()} ${menus.register.firstname}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else if (textValue === 2) {
    let menuPrompt = `${con()} ${menus.register.lastname}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else if (textValue === 3) {
    let menuPrompt = `${con()} ${menus.register.idNumber}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else if (textValue === 4) {
    let menuPrompt = `${con()} ${menus.register.gender}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else if (textValue === 5) {
    let menuPrompt = `${con()} ${menus.register.password}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else if (textValue === 6) {
    let menuPrompt = `${con()} ${menus.register.confirmPassword}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else if (textValue === 7) {
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
export const renderLoginMenus = (textValue) => {
  if (textValue === 1) {
    let menuPrompt = `${con()} ${menus.login.password}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else {
    completedStatus = true;
  }
  return { message, completedStatus };
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

const renderFarmerAddProductMenu = () => {
  let menuPrompt = `${con()} ${menus.farmer.addProduct}`;
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