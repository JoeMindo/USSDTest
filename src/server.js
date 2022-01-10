/* eslint-disable import/no-cycle */
import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import redis from 'redis';
import bluebird from 'bluebird';
import { ussdRouter } from 'ussd-router';
import * as menuItems from './menus/rendermenu.js';
import { registerUser, checkIfUserExists } from './core/usermanagement.js';
import checkFarmerSelection from './users/farmer/farmerselection.js';
import checkBuyerSelection from './users/buyer/buyerselection.js';

const port = process.env.PORT || 3032;

const app = express();

const client = redis.createClient({
  host: 'redis-19100.c251.east-us-mz.azure.cloud.redislabs.com',
  port: 19100,
  password: 'T6SXoEq1tyztu6oLYGpSO2cbE2dE1gDH',
});

bluebird.promisifyAll(redis.RedisClient.prototype);

client.on('connect', () => {});
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

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, POST, GET, PATCH, DELETE',
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.post('/ussd', async (req, res) => {
  const userGender = {
    1: 'Male',
    2: 'Female',
  };

  const rawtext = req.body.text;
  const text = ussdRouter(rawtext, '0', '00');
  // TODO: Migrate this to usermanagement

  const textValue = text.split('*').length;
  console.log('The text value is', textValue);

  const userStatus = await checkIfUserExists(req.body.phoneNumber);
  let message;

  if (userStatus === false) {
    let error = 'END ';
    const menus = menuItems.renderRegisterMenu(textValue, text);
    let { message } = menus;
    if (menus.completedStatus === true) {
      message = 'END Success';
      req.session.registration = text.split('*');

      const userDetails = {
        first_name: req.session.registration[0],
        last_name: req.session.registration[1],
        id_no: req.session.registration[2],
        gender: userGender[parseInt(req.session.registration[3], 10)],
        password: req.session.registration[4],
        password_confirmation: req.session.registration[5],
        role_id: req.session.registration[6],
      };

      const response = await registerUser(userDetails, req.body.phoneNumber).catch((error) => {
        message = `END ${error.response.data.message}`;
      });
      if (response === undefined) {
        message = 'END Something went wrong try later';
        return message;
      }
      if (response.status === 'error') {
        Object.keys(response.errors).forEach((key) => {
          error += `${response.errors[`${key}`].toString()}`;
        });
        return error;
      }
      return message;
    }
    res.send(message);
  } else if (userStatus.exists === true) {
    client.set('user_id', userStatus.user_id);
    if (userStatus.role === 'FARMER') {
      client.set('role', 'farmer');
      message = await checkFarmerSelection(text, textValue);
    } else if (userStatus.role === 'BUYER') {
      client.set('role', 'buyer');
      message = await checkBuyerSelection(textValue, text);
    } else if (userStatus.message === false) {
      message = 'CON User not found';
    }
  } else {
    message = 'END Something went wrong on our end, try again later';
  }
  res.send(message);
});

app.listen(port, () => {});

export default client;
