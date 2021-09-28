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

import { registerUser, loginUser, addLocation } from './core/usermanagement.mjs';

import { getRegions, getLocations, splitText } from './core/listlocations.js';
import {
  fetchCategories, fetchProducts, addProduct, getSpecificProduct,
} from './core/productmanagement.js';
import { addFarm } from './core/farmmanagement.js';

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
  console.log(`incoming text ${text}`);
  const textValue = text.split('*').length;

  if (text === '') {
    message = 'CON Welcome to Mamlaka Foods\n 1. Register \n 2. Login';

    res.send(message);
  } else if (textValue === 1 && text === '2') {
    message = 'CON Enter phone';
    message += footer;
    res.send(message);
  } else if (textValue === 2 && isLogin) {
    message = 'CON Enter password';
    message += footer;
    res.send(message);
  } else if (textValue === 3 && isLogin) {
    req.session.login = text.split('*');
    [userLogin.phone_no, userLogin.password] = [req.session.login[1], req.session.login[2]];
    loginUser(userLogin).then((response) => {
      console.log(response);

      message = 'CON 1. Update location\n 2. Add Farm details\n 3. Add products';
      message += footer;
      res.send(message);
      client.set('user_id', `${response.data.user_id}`, redis.print);
    });
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
  } else if (textValue === 4 && isRegistration) {
    message = 'CON Enter phone';
    message += footer;
    res.send(message);
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
  } else if ((textValue === 1 && isRegistration) || (isLogin && textValue === 4)) {
    message = 'CON Enter your first name';
    message += footer;
    res.send(message);
  } else if ((textValue === 2 && isRegistration) || (isLogin && textValue === 5)) {
    message = 'CON Enter your last name';
    message += footer;
    res.send(message);
  } else if ((textValue === 3 && isRegistration) || (isLogin && textValue === 6)) {
    message = 'CON What is your ID number';
    message += footer;
    res.send(message);
  } else if ((textValue === 4 && isRegistration) || (isLogin && textValue === 7)) {
    message = 'CON What is your gender?\n1.Male\n2.Female\n3.Prefer not to say';
    message += footer;
    res.send(message);
  } else if ((textValue === 5 && isRegistration) || (isLogin && textValue === 8)) {
    message = 'CON Enter your password (Atleast 8 characters)';
    message += footer;
    res.send(message);
  } else if ((textValue === 6 && isRegistration) || (isLogin && textValue === 9)) {
    message = 'CON Confirm your password';
    message += footer;
    res.send(message);
  } else if ((textValue === 7 && isRegistration) || (isLogin && textValue === 10)) {
    message = `CON Who are you?
      1. Farmer
      2. Buyer
      3. DEAN
      `;
    message += footer;
    res.send(message);
  } else if (textValue === 8 && text.split('*')[0] === '1') {
    req.session.registration = text.split('*');
    const userDetails = {
      first_name: req.session.registration[1],
      last_name: req.session.registration[2],
      id_no: req.session.registration[3],
      gender: 'Male',
      password: req.session.registration[5],
      password_confirmation: req.session.registration[6],
      role_id: req.session.registration[7],
      phone_no: req.session.registration[4],
      // email: req.session.registration[9],
    };
    const out = registerUser(userDetails);
    out.then((response) => {
      message = 'END Thank you!';
      console.log(response.status);

      res.send(message);
    });
  } else {
    message = 'Hmm someting went wrong';
    res.send(message);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}, `);
});
