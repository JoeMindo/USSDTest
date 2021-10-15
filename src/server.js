/* eslint-disable max-len */
/* eslint-disable import/extensions */
/* eslint-disable prefer-destructuring */
import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import redis from 'redis';
import bluebird from 'bluebird';
import { ussdRouter } from 'ussd-router';
import * as menuItems from './config/rendermenu.js';
import { registerUser, loginUser, addLocation } from './core/usermanagement.mjs';

import { getRegions, getLocations, splitText } from './core/listlocations.js';
import {
  fetchCategories, fetchProducts, addProduct, getSpecificProduct,
} from './core/productmanagement.js';
import { addFarm, addFarmerKYC } from './core/farmmanagement.js';

const port = process.env.PORT || 3031;

const app = express();

const client = redis.createClient({ host: 'redis-19100.c251.east-us-mz.azure.cloud.redislabs.com', port: 19100, password: 'T6SXoEq1tyztu6oLYGpSO2cbE2dE1gDH' });
bluebird.promisifyAll(redis.RedisClient.prototype);

client.on('connect', () => {
  console.log('connected');
});
client.on('error', (error) => {
  throw new Error(error);
});

app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.set('trust proxy', 1);
app.use(
  session({
    resave: true,
    secret: '123456',
    path: '/',
    saveUninitialized: true,
  }),
);

app.post('/ussd', (req, res) => {
  let message = '';
  const footer = '\n99: Back 98: Home';

  const userLogin = {
    phone_no: '',
    password: '',
  };
  const grades = {
    1: 'GRADE A',
    2: 'GRADE B',
    3: 'GRADE C',
    4: 'GRADE D',
    5: 'GRADE E',
  };
  const rawtext = req.body.text;
  const text = ussdRouter(rawtext, '99', '98');
  // TODO: Migrate this to usermanagement
  const isRegistration = text.split('*')[0] === '1';
  const isLogin = text.split('*')[0] === '2';
  const isAddFarmDetails = text.split('*')[3] === '2';
  const isAddProduct = text.split('*')[3] === '3';
  const isUpdateFarmerDetails = text.split('*')[3] === '4';
  console.log(`incoming text ${text}`);
  const textValue = text.split('*').length;

  if (text === '') {
    message = 'CON Welcome to Mamlaka Foods\n 1. Register \n 2. Login';

    res.send(message);
  } else if (isLogin) {
    let error = 'END ';
    const menus = menuItems.renderLoginMenus(textValue);
    let message = menus.message;
    if (menus.completedStatus === true) {
      message = 'END Success';
      req.session.login = text.split('*');
      userLogin.phone_no = req.body.phoneNumber;
      userLogin.password = req.session.login[1];
      console.log(userLogin.phone_no);
      const result = loginUser(userLogin).then((response) => {
        console.log('Login Response', response);
        if (response.status === 'error') {
          Object.keys(response.errors).forEach((key) => {
            error += `${response.errors[key].toString()}`;
            console.log(key, response.errors[key].toString());
          });
          return error;
        }
        client.set('user_id', `${response.data.user_id}`, redis.print);
        client.set('userLoggedIn', true);
        message = menuItems.renderFarmerMenus();
        return message;
      });
      result.then((response) => {
        console.log('Message at login end', response);
        res.send(response);
      });
    }
  } else if (textValue === 4 && isLogin && isAddFarmDetails) {
    message = 'CON Enter farm name';
    message += footer;
    res.send(message);
  } else if (textValue === 5 && isLogin && isAddFarmDetails) {
    const farmName = text.split('*')[4];
    client.set('farm_name', farmName, redis.print);
    message = 'CON Enter farm location';
    message += footer;
    res.send(message);
  } else if (textValue === 6 && isLogin && isAddFarmDetails) {
    const farmLocation = text.split('*')[5];
    client.set('farm_location', farmLocation);
    const categories = fetchCategories();
    categories.then((data) => {
      message = `CON Choose a category of foods that you grow\n ${data}`;
      message += footer;
      res.send(message);
    });
  } else if (textValue === 7 && isLogin && isAddFarmDetails) {
    const category = text.split('*')[6];
    const products = fetchProducts(category);
    products.then((data) => {
      message = `CON Choose a product\n ${data}`;
      message += footer;
      res.send(message);
    });
  } else if (textValue === 8 && isLogin && isAddFarmDetails) {
    const productID = text.split('*')[7];
    client.set('productID', productID);
    message = 'CON What is the capacity per harvest in bags';
    message += footer;
    res.send(message);
  } else if (textValue === 9 && isLogin && isAddFarmDetails) {
    const capacity = text.split('*')[8];
    client.set('capacity', capacity);
    const farmName = text.split('*')[4];
    const farmLocation = text.split('*')[5];
    const productID = text.split('*')[7];
    const capacityPerHarvest = text.split('*')[8];
    const getFarmValues = () => {
      const userId = client.getAsync('user_id').then((reply) => reply);
      return Promise.all([userId]);
    };
    getFarmValues().then((results) => {
      const capturedUser = {};
      capturedUser.user_id = results[0];

      const farmDetails = {
        farm_name: farmName,
        farm_location: farmLocation,
        product_id: productID,
        capacity: capacityPerHarvest,
        user_id: capturedUser.user_id,
      };
      console.log(farmDetails);

      addFarm(farmDetails).then((response) => {
        console.log('Farm response ID', response.data.success.id);
        client.set('farm_id', response.data.success.id);
        message = 'END Farm added successfully';
        res.send(message);
      });
    });
  } else if (textValue === 4 && isLogin && isUpdateFarmerDetails) {
    message = 'CON Enter the variety of produce you grow';

    message += footer;
    res.send(message);
  } else if (textValue === 5 && isLogin && isUpdateFarmerDetails) {
    const variety = text.split('*')[4];
    client.set('variety', variety);
    message = 'CON Enter the number of bags per harvest';
    message += footer;
    res.send(message);
  } else if (textValue === 6 && isLogin && isUpdateFarmerDetails) {
    const bagsPerHarvest = text.split('*')[5];
    client.set('bagsPerHarvest', bagsPerHarvest);
    message = 'CON What is the total size of land you own';
    message += footer;
    res.send(message);
  } else if (textValue === 7 && isLogin && isUpdateFarmerDetails) {
    const landSize = text.split('*')[6];
    client.set('landSize', landSize);
    message = 'CON What is your KRA-PIN?';
    message += footer;
    res.send(message);
  } else if (textValue === 8 && isLogin && isUpdateFarmerDetails) {
    const krapin = text.split('*')[7];
    client.set('krapin', krapin);
    message = 'CON What sort of equipment do you own (Separate them by commas)?';
    message += footer;
    res.send(message);
  } else if (textValue === 9 && isLogin && isUpdateFarmerDetails) {
    const equipment = text.split('*')[8];
    client.set('equipment', equipment);
    message = 'CON What is your produce return levels ?';
    message += footer;
    res.send(message);
  } else if (textValue === 10 && isLogin && isUpdateFarmerDetails) {
    const returnLevel = text.split('*')[9];
    client.set('returnLevel', returnLevel);
    message = 'CON What is your land ownership status?';
    message += footer;
    res.send(message);
  } else if (textValue === 11 && isLogin && isUpdateFarmerDetails) {
    const landOwnership = text.split('*')[10];
    client.set('landOwnership', landOwnership);
    message = 'CON What is your business registration status?';
    message += footer;
    res.send(message);
  } else if (textValue === 12 && isLogin && isUpdateFarmerDetails) {
    const businessRegistration = text.split('*')[11];
    client.set('businessRegistration', businessRegistration);
    message = 'CON What is your group membership status?';
    message += footer;
    res.send(message);
  } else if (textValue === 13 && isLogin && isUpdateFarmerDetails) {
    const groupMembership = text.split('*')[12];
    client.set('groupMembership', groupMembership);
    message = 'CON What is your total production cost per season?';
    message += footer;
    res.send(message);
  } else if (textValue === 14 && isLogin && isUpdateFarmerDetails) {
    const productionCost = text.split('*')[13];
    client.set('productionCost', productionCost);

    const getFarmerKYC = () => {
      const varieties = client.getAsync('variety').then((reply) => reply);
      const quantity = client.getAsync('bagsPerHarvest').then((reply) => reply);
      const size = client.getAsync('landSize').then((reply) => reply);
      const krapin = client.getAsync('krapin').then((reply) => reply);
      const equipment = client.getAsync('equipment').then((reply) => reply);
      const returnLevel = client.getAsync('returnLevel').then((reply) => reply);
      const landOwnership = client.getAsync('landOwnership').then((reply) => reply);
      const businessRegistration = client.getAsync('businessRegistration').then((reply) => reply);
      const groupMembership = client.getAsync('groupMembership').then((reply) => reply);
      const productionCostGiven = client.getAsync('productionCost').then((reply) => reply);
      const userId = client.getAsync('user_id').then((reply) => reply);
      return Promise.all([varieties, quantity, size, krapin, equipment, returnLevel, landOwnership, businessRegistration, groupMembership, productionCostGiven, userId]);
    };
    getFarmerKYC().then((results) => {
      const farmerKyc = {
        product_varieties: results[0],
        product_quantities: results[1],
        land_size: results[2],
        kra_pin: results[3],
        equipment_owned: results[4],
        produce_return_levels: results[5],
        land_ownership_status: results[6],
        business_reg_status: results[7],
        group_membership_status: results[8],
        production_cost: results[9],
      };
      const id = results[10];
      addFarmerKYC(farmerKyc, id).then((response) => {
        console.log('Farmer KYC response', response);
        message = 'END Farmer KYC added successfully';
        res.send(message);
      });
    });
  } else if (textValue === 4 && isLogin && isAddProduct) {
    const getFarmProduce = () => {
      const productId = client.getAsync('productID').then((reply) => reply);
      return Promise.all([productId]);
    };
    getFarmProduce().then((results) => {
      const productID = results[0];
      getSpecificProduct(productID).then((response) => {
        console.log(response);
        message = `CON Enter the quantity of ${response.data.product_name}`;
        message += footer;
        res.send(message);
      });
    });
  } else if (textValue === 5 && isLogin && isAddProduct) {
    const units = text.split('*')[4];
    client.set('units', units);

    message = `CON How would you grade your produce?\n1.${grades[1]}\n2.${grades[2]}\n3.${grades[3]}\n4. ${grades[4]}\n5. ${grades[5]}`;
    message += footer;
    res.send(message);
  } else if (textValue === 6 && isLogin && isAddProduct) {
    const grade = text.split('*')[5];
    const units = text.split('*')[4];
    const getFarmValues = () => {
      const farmId = client.getAsync('farm_id').then((reply) => reply);
      const productId = client.getAsync('productID').then((reply) => reply);
      return Promise.all([farmId, productId]);
    };
    getFarmValues().then((results) => {
      const produceDetails = {
        farm_id: results[0],
        product_id: results[1],
        units,
        grade: grades[grade],
      };
      console.log(produceDetails);
      addProduct(produceDetails).then((response) => {
        console.log(response);
        message = 'END Produce added successfully';
        res.send(message);
      });
    });
  } else if (textValue === 4 && isLogin) {
    const regions = getRegions();
    const output = regions.then((data) => data);
    output.then((list) => {
      message = `CON Select region\n ${list.items}`;
      message += footer;

      res.send(message);
    });
  } else if (textValue === 5 && isLogin) {
    let userInput = splitText(text, 4);
    userInput = parseInt(userInput, 10);
    // Get regionID
    const regions = getRegions();
    const output = regions.then((data) => data);
    output.then((regionIDs) => {
      const counties = getLocations(
        'counties',
        regionIDs.ids[userInput],
        'county_name',
      );
      client.set('region_id', regionIDs.ids[userInput]);
      const countyData = counties.then((data) => {
        console.log(data);
        return data;
      });
      countyData.then((list) => {
        console.log('List', list);
        message = `CON Select county\n ${list.items}`;
        message += footer;
        res.send(message);
      });
    });
  }
  // Sub county list
  else if (textValue === 6 && text.split('*')[0] === '2') {
    let regionInput = splitText(text, 4);
    const countyInput = splitText(text, 5);
    regionInput = parseInt(regionInput, 10);
    // Get regionID
    const regions = getRegions();
    const output = regions.then((data) => data);
    output.then((regionIDs) => {
      const counties = getLocations(
        'counties',
        regionIDs.ids[regionInput],
        'county_name',
      );
      const countyData = counties.then((data) => {
        console.log(data);
        return data;
      });
      countyData.then((countyIds) => {
        const subcounties = getLocations(
          'subcounties',
          countyIds.ids[countyInput],
          'sub_county_name',
        );
        client.set('county_id', countyIds.ids[countyInput]);
        const subcountyData = subcounties.then((data) => data);
        subcountyData.then((list) => {
          console.log('List', list.ids);
          message = `CON Select subcounty\n ${list.items}`;
          message += footer;
          res.send(message);
        });
      });
    });
  }
  // Locations
  else if (textValue === 7 && text.split('*')[0] === '2') {
    let regionInput = splitText(text, 4);
    const countyInput = splitText(text, 5);
    const subcountyInput = splitText(text, 6);
    regionInput = parseInt(regionInput, 10);
    // Get regionID
    const regions = getRegions();
    const output = regions.then((data) => data);
    output.then((regionIDs) => {
      const counties = getLocations(
        'counties',
        regionIDs.ids[regionInput],
        'county_name',
      );
      const countyData = counties.then((data) => {
        console.log(data);
        return data;
      });
      countyData.then((countyIds) => {
        const subcounties = getLocations(
          'subcounties',
          countyIds.ids[countyInput],
          'sub_county_name',
        );

        const subcountyData = subcounties.then((data) => data);
        subcountyData.then((locationIds) => {
          console.log('Subcounty list', locationIds.ids);
          const locations = getLocations(
            'locations',
            locationIds.ids[subcountyInput],
            'location_name',
          );
          client.set('subcounty_id', locationIds.ids[subcountyInput]);
          const locationData = locations.then((data) => data);
          locationData.then((list) => {
            console.log('Locations', list);

            message = `CON Select locations\n ${list.items}`;
            message += footer;
            res.send(message);
          });
        });
      });
    });
  } else if (textValue === 8 && text.split('*')[0] === '2') {
    let regionInput = splitText(text, 4);
    const countyInput = splitText(text, 5);
    const subcountyInput = splitText(text, 6);
    const locationInput = splitText(text, 7);
    regionInput = parseInt(regionInput, 10);
    // Get regionID
    const regions = getRegions();
    const output = regions.then((data) => data);
    output.then((regionIDs) => {
      const counties = getLocations(
        'counties',
        regionIDs.ids[regionInput],
        'county_name',
      );
      const countyData = counties.then((data) => {
        console.log(data);
        return data;
      });
      countyData.then((countyIds) => {
        const subcounties = getLocations(
          'subcounties',
          countyIds.ids[countyInput],
          'sub_county_name',
        );

        const subcountyData = subcounties.then((data) => data);
        subcountyData.then((locationIds) => {
          console.log('Subcounty list', locationIds.ids);
          const locations = getLocations(
            'locations',
            locationIds.ids[subcountyInput],
            'location_name',
          );
          client.set('subcounty_id', locationIds.ids[subcountyInput]);
          const locationData = locations.then((data) => data);
          locationData.then((finalLocationIds) => {
            client.set('location_id', finalLocationIds.ids[locationInput]);

            message = 'CON Enter your area';
            message += footer;
            res.send(message);
          });
        });
      });
    });
  } else if (textValue === 9 && isLogin) {
    message = 'END Thank you for registering with Mamlaka ';
    client.set('area', text.split('*')[8]);
    const getLabelValues = () => {
      const userId = client.getAsync('user_id').then((reply) => reply);
      const regionId = client.getAsync('region_id').then((reply) => reply);
      const countyId = client.getAsync('county_id').then((reply) => reply);
      const subcountyId = client.getAsync('subcounty_id').then((reply) => reply);
      const locationId = client.getAsync('location_id').then((reply) => reply);
      const area = client.getAsync('area').then((reply) => reply);
      return Promise.all([userId, regionId, countyId, subcountyId, locationId, area]);
    };
    getLabelValues().then((results) => {
      const capturedLocation = {};

      capturedLocation.user_id = results[0];
      capturedLocation.region_id = results[1];
      capturedLocation.county_id = results[2];
      capturedLocation.subcounty_id = results[3];
      capturedLocation.location_id = results[4];
      capturedLocation.area = results[5];

      const postLocation = {
        sub_county_id: capturedLocation.subcounty_id,
        location_id: capturedLocation.location_id,
        area: capturedLocation.area,

      };
      const postID = parseInt(capturedLocation.user_id, 10);
      addLocation(postLocation, postID).then((response) => {
        console.log(response);
      });
    });

    res.send(message);
  } else if ((isRegistration)) {
    let error = 'END ';
    const menus = menuItems.renderRegisterMenu(textValue);
    let message = menus.message;
    if (menus.completedStatus === true) {
      message = 'END Success';
      req.session.registration = text.split('*');
      const userDetails = {
        first_name: req.session.registration[1],
        last_name: req.session.registration[2],
        id_no: req.session.registration[3],
        gender: 'Male',
        password: req.session.registration[5],
        password_confirmation: req.session.registration[6],
        role_id: req.session.registration[7],
        // email: req.session.registration[9],
      };
      console.log('DetailsHere', userDetails);
      const out = registerUser(userDetails);
      const result = out.then((response) => {
        console.log('Registation', response);
        if (response.status === 'error') {
          Object.keys(response.errors).forEach((key) => {
            error += `${response.errors[key].toString()}`;

            console.log(key, response.errors[key].toString());
          });
          return error;
        }
        return message;
      });
      result.then((response) => {
        console.log('Message at end', response);
        res.send(response);
      });
    } else {
      res.send(message);
    }
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}, `);
});
