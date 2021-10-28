/* eslint-disable import/no-cycle */
/* eslint-disable import/prefer-default-export */
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
// import cors from 'cors';
import { ussdRouter } from 'ussd-router';
import * as menuItems from './config/rendermenu.js';
import { registerUser, loginUser, checkIfUserExists } from './core/usermanagement.js';
import { retreiveCachedItems } from './core/services.js';
import { menus } from './config/menuoptions.js';

const port = process.env.PORT || 3032;

const app = express();

export const client = redis.createClient({
  host: 'redis-19100.c251.east-us-mz.azure.cloud.redislabs.com',
  port: 19100,
  password: 'T6SXoEq1tyztu6oLYGpSO2cbE2dE1gDH',
});
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
  console.log(`request payload${JSON.stringify(req.body)}`);
  const message = '';

  const userLogin = {
    phone_no: '',
    password: '',
  };
  const userGender = {
    1: 'Male',
    2: 'Female',
  };

  const rawtext = req.body.text;
  const text = ussdRouter(rawtext, '99', '98');
  // TODO: Migrate this to usermanagement

  console.log(`incoming text ${text}`);
  const textValue = text.split('*').length;
  console.log('Textvalue', textValue);
  console.log('Length of text', text.length);
  const userStatus = await checkIfUserExists(req.body.phoneNumber);
  console.log('User Status', userStatus);

  if (userStatus === false) {
    console.log('Here is registering', textValue);
    let error = 'END ';
    const menus = menuItems.renderRegisterMenu(textValue, text);
    let message = menus.message;
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
      console.log('DetailsHere', userDetails);
      const out = registerUser(userDetails, req.body.phoneNumber);
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
  } else if (userStatus === true) {
    let message;
    // message = menuItems.renderLoginMenus();
    // res.send(message);
    if (text.length === 0) {
      message = menuItems.renderLoginMenus();
    } else if (text.length > 0) {
      req.session.login = text.split('*');
      userLogin.phone_no = req.body.phoneNumber;
      userLogin.password = req.session.login[0];
      console.log('Login', userLogin);
      const response = await loginUser(userLogin);
      if (response.status === 200 && response.data.role === 'farmer') {
        console.log('Farmer here');
        client.set('role', 'farmer');
        client.set('user_id', `${response.data.user_id}`, redis.print);
        message = await menuItems.checkFarmerSelection(text, textValue);
      } else if (response.status === 200 && response.data.role === 'buyer') {
        client.set('role', 'buyer');
        client.set('user_id', `${response.data.user_id}`, redis.print);
        message = await menuItems.checkBuyerSelection(textValue, text);
      } else if (response.status === 404) {
        message = 'CON User not found';
      } else {
        message = 'END Invalid credentials';
      }
    } else {
      message = 'END Something went wrong on our end, try again later';
    }
    res.send(message);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}, `);
});
