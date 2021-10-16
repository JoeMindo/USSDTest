/* eslint-disable import/no-cycle */
/* eslint-disable import/prefer-default-export */
import { getLocations, getRegions } from '../core/listlocations.js';
import { menus } from './menus.js';
import { client } from '../server.js';
import { addLocation } from '../core/usermanagement.js';
import { retreiveCachedItems } from '../core/services.js';
import { fetchCategories, fetchProducts } from '../core/productmanagement.js';
import { addFarm } from '../core/farmmanagement.js';

const con = () => 'CON';
const end = () => 'END';
let message = '';

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
export const renderUpdateLocationMenu = (res, textValue, text) => {
  if (textValue === 3) {
    let menuPrompt = `${con()} ${menus.updateLocation[0]}`;
    const regions = getRegions();
    const output = regions.then((data) => data);
    output.then((list) => {
      menuPrompt += `${list.items}`;
      menuPrompt += menus.footer;
      message = menuPrompt;
      res.send(message);
    });
  } else if (textValue === 4) {
    let regionId = parseInt(text.split('*')[3], 10);
    regionId += 1;
    let menuPrompt = `${con()} ${menus.updateLocation[1]}`;
    const counties = getLocations('counties', regionId, 'county_name');
    const output = counties.then((data) => data);
    output.then((list) => {
      console.log('List of counties', list.items);
      menuPrompt += `${list.items}`;

      client.set('usercountyIds', list.ids.toString());
      menuPrompt += menus.footer;
      message = menuPrompt;
      res.send(message);
    });
  } else if (textValue === 5) {
    const countyId = parseInt(text.split('*')[4], 10);

    retreiveCachedItems(client, ['usercountyIds'])
      .then((countyIds) => {
        let userCountySelection = countyIds[0].split(',')[countyId];
        userCountySelection = parseInt(userCountySelection, 10);
        const subcounties = getLocations('subcounties', userCountySelection, 'sub_county_name');
        subcounties.then((list) => {
          let menuPrompt = `${con()} ${menus.updateLocation[2]}`;
          menuPrompt += `${list.items}`;
          client.set('userSubcountyIds', list.ids.toString());
          menuPrompt += menus.footer;
          message = menuPrompt;
          res.send(message);
        });
      });
  } else if (textValue === 6) {
    const subcountyId = parseInt(text.split('*')[5], 10);
    retreiveCachedItems(client, ['userSubcountyIds'])
      .then((subcountyIds) => {
        let userSubcountySelection = subcountyIds[0].split(',')[subcountyId];
        userSubcountySelection = parseInt(userSubcountySelection, 10);
        client.set('userSubCountySelection', userSubcountySelection);
        const locations = getLocations('locations', userSubcountySelection, 'location_name');
        locations.then((list) => {
          let menuPrompt = `${con()} ${menus.updateLocation[3]}`;
          menuPrompt += `${list.items}`;
          client.set('userLocationIds', list.ids.toString());
          menuPrompt += menus.footer;
          message = menuPrompt;
          res.send(message);
        });
      });
  } else if (textValue === 7) {
    const locationId = parseInt(text.split('*')[6], 10);
    retreiveCachedItems(client, ['userLocationIds'])
      .then((locationIds) => {
        let userLocationSelection = locationIds[0].split(',')[locationId];
        userLocationSelection = parseInt(userLocationSelection, 10);
        client.set('userLocationSelection', userLocationSelection);
        let menuPrompt = `${con()} ${menus.updateLocation[4]}`;
        menuPrompt += menus.footer;
        message = menuPrompt;
        res.send(message);
      });
  } else {
    client.set('userArea', text.split('*')[7]);
    retreiveCachedItems(client, ['userSubCountySelection', 'userLocationSelection', 'userArea', 'user_id'])
      .then((postLocationDetails) => {
        const postDetails = {
          sub_county_id: postLocationDetails[0],
          location_id: postLocationDetails[1],
          area: postLocationDetails[2],
        };
        const userId = parseInt(postLocationDetails[3], 10);
        addLocation(postDetails, userId).then((response) => {
          // TODO: Add a success message and failure message
          console.log(response);
        });
      });
    const menuPrompt = `${end()} ${menus.updateLocation.success}`;
    message = menuPrompt;
    res.send(message);
  }
};
export const renderAddFarmDetailsMenu = (res, textValue, text) => {
  // TODO: Add a check for KYC
  if (textValue === 3) {
    console.log('Hey', textValue);
    let menuPrompt = `${con()} ${menus.addfarmDetails[0]}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
    res.send(message);
  } else if (textValue === 4) {
    let menuPrompt = `${con()} ${menus.addfarmDetails[1]}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
    client.set('farm_name', text.split('*')[3]);
    res.send(message);
  } else if (textValue === 5) {
    client.set('farm_location', text.split('*')[4]);

    const categories = fetchCategories();
    categories.then((data) => {
      let menuPrompt = `${con()} ${menus.addfarmDetails[2]}`;
      menuPrompt += `${data}`;
      menuPrompt += menus.footer;
      message = menuPrompt;
      res.send(message);
    });
  } else if (textValue === 6) {
    const category = text.split('*')[5];
    const product = fetchProducts(category);
    product.then((data) => {
      let menuPrompt = `${con()} ${menus.addfarmDetails[3]}`;
      menuPrompt += `${data}`;
      menuPrompt += menus.footer;
      message = menuPrompt;
      res.send(message);
    });
  } else if (textValue === 7) {
    const productId = parseInt(text.split('*')[6], 10);
    client.set('productID', productId);
    let menuPrompt = `${con()} ${menus.addfarmDetails[4]}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
    res.send(message);
  } else {
    client.set('capacity', parseInt(text.split('*')[7], 10));
    retreiveCachedItems(client, ['farm_name', 'farm_location', 'productID', 'capacity', 'user_id'])
      .then((farmDetails) => {
        const postDetails = {
          farm_name: farmDetails[0],
          farm_location: farmDetails[1],
          product_id: farmDetails[2],
          capacity: farmDetails[3],
          user_id: farmDetails[4],
        };

        addFarm(postDetails).then((response) => {
          if (response.status === 200) {
            const menuPrompt = `${end()} ${menus.addfarmDetails.success}`;
            message = menuPrompt;
            client.set('farm_id', response.data.success.id);
            res.send(message);
          } else {
            const menuPrompt = `${end()} ${menus.addfarmDetails.failure}`;
            message = menuPrompt;
            res.send(message);
          }
        });
      });
  }
};

export const renderFarmerUpdateDetailsMenu = () => {
  const counter = 0;
  if (counter === 0) {
    let menuPrompt = `${con()} ${menus.updateFarmerDetails[counter]}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else if (counter === 1) {
    let menuPrompt = `${con()} ${menus.updateFarmerDetails[counter]}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else if (counter === 2) {
    let menuPrompt = `${con()} ${menus.updateFarmerDetails[counter]}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else if (counter === 3) {
    let menuPrompt = `${con()} ${menus.updateFarmerDetails[counter]}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else if (counter === 4) {
    let menuPrompt = `${con()} ${menus.updateFarmerDetails[counter]}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else if (counter === 5) {
    let menuPrompt = `${con()} ${menus.updateFarmerDetails[counter]}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else if (counter === 6) {
    let menuPrompt = `${con()} ${menus.updateFarmerDetails[counter]}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else if (counter === 7) {
    let menuPrompt = `${con()} ${menus.updateFarmerDetails[counter]}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else if (counter === 8) {
    let menuPrompt = `${con()} ${menus.updateFarmerDetails[counter]}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else if (counter === 9) {
    let menuPrompt = `${con()} ${menus.updateFarmerDetails[counter]}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  }

  return message;
};

export const renderFarmerAddProductMenu = () => {
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

export const checkFarmerSelection = (text, res, textValue) => {
  const selection = text.split('*')[2];
  if (selection === '1') {
    renderUpdateLocationMenu(res, textValue, text);
  } else if (selection === '2') {
    renderAddFarmDetailsMenu(res, textValue, text);
  } else if (selection === '3') {
    renderFarmerAddProductMenu(res, textValue, text);
  } else {
    renderFarmerUpdateDetailsMenu(res, textValue, text);
  }
};