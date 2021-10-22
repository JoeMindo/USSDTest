/* eslint-disable import/no-cycle */
/* eslint-disable import/prefer-default-export */
/* eslint-disable max-len */
/* eslint-disable import/extensions */
/* eslint-disable prefer-destructuring */
import express from "express";
import bodyParser from "body-parser";
import logger from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import redis from "redis";
import bluebird from "bluebird";
import { ussdRouter } from "ussd-router";
import * as menuItems from "./config/rendermenu.js";
import { registerUser, loginUser } from "./core/usermanagement.js";
import { retreiveCachedItems } from "./core/services.js";
import { menus } from "./config/menuoptions.js";

const port = process.env.PORT || 3031;

const app = express();

export const client = redis.createClient({
  host: "redis-19100.c251.east-us-mz.azure.cloud.redislabs.com",
  port: 19100,
  password: "T6SXoEq1tyztu6oLYGpSO2cbE2dE1gDH",
});
bluebird.promisifyAll(redis.RedisClient.prototype);

client.on("connect", () => {
  console.log("connected");
});
client.on("error", (error) => {
  throw new Error(error);
});

app.use(logger("dev"));
app.use(cookieParser());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.set("trust proxy", 1);
app.use(
  session({
    resave: true,
    secret: "123456",
    path: "/",
    saveUninitialized: true,
  })
);

app.post("/ussd", (req, res) => {
  console.log("request payload" + req);
  let message = "";

  const userLogin = {
    phone_no: "",
    password: "",
  };

  const rawtext = req.body.text;
  const text = ussdRouter(rawtext, "99", "98");
  // TODO: Migrate this to usermanagement
  const isRegistration = text.split("*")[0] === "1";
  const isLogin = text.split("*")[0] === "2";
  console.log(`incoming text ${text}`);
  const textValue = text.split("*").length;
  console.log(textValue);

  if (text === "") {
    message = "CON Welcome to Mamlaka Foods\n 1. Register \n 2. Login";
    res.send(message);
  } else if (isLogin && textValue <= 2) {
    const menus = menuItems.renderLoginMenus(res, textValue);
    let message = menus.message;

    if (menus.completedStatus === true) {
      req.session.login = text.split("*");
      userLogin.phone_no = req.body.phoneNumber;
      userLogin.password = req.session.login[1];

      loginUser(userLogin).then((response) => {
        console.log("Login Response", response);
        if (response.status === 200 && response.data.role === "farmer") {
          console.log("Farmer here");
          client.set("role", "farmer");
          client.set("user_id", `${response.data.user_id}`, redis.print);
          message = menuItems.renderFarmerMenus();
          res.send(message);
        } else if (response.status === 200 && response.data.role === "buyer") {
          console.log("Buyer detected", response);
          client.set("role", "buyer");
          client.set("user_id", `${response.data.user_id}`, redis.print);
          message = menuItems.renderBuyerMenus();
          res.send(message);
        } else if (response.status === 404) {
          message = "CON User not found";
          res.send(message);
        } else {
          message = "END Invalid credentials";
          res.send(message);
        }
      });
    }
  } else if (isRegistration) {
    let error = "END ";
    const menus = menuItems.renderRegisterMenu(textValue);
    console.log("TextValue at register", textValue);
    let message = menus.message;
    if (menus.completedStatus === true) {
      message = "END Success";
      req.session.registration = text.split("*");
      const userDetails = {
        first_name: req.session.registration[1],
        last_name: req.session.registration[2],
        id_no: req.session.registration[3],
        gender: "Male",
        password: req.session.registration[5],
        password_confirmation: req.session.registration[6],
        role_id: req.session.registration[7],
        // email: req.session.registration[9],
      };
      console.log("DetailsHere", userDetails);
      const out = registerUser(userDetails, req.body.phoneNumber);
      const result = out.then((response) => {
        console.log("Registation", response);
        if (response.status === "error") {
          Object.keys(response.errors).forEach((key) => {
            error += `${response.errors[key].toString()}`;

            console.log(key, response.errors[key].toString());
          });
          return error;
        }
        return message;
      });
      result.then((response) => {
        console.log("Message at end", response);
        res.send(response);
      });
    } else {
      res.send(message);
    }
  } else {
    retreiveCachedItems(client, ["role"]).then((response) => {
      console.log("Response of other", response);
      if (response[0] === "farmer") {
        console.log("Farmer menus here");
        const isUpdateLocation = text.split("*")[2] === "1";
        const isAddFarmDetails = text.split("*")[2] === "2";
        const isAddProduct = text.split("*")[2] === "3";
        const isUpdateFarmerDetails = text.split("*")[2] === "4";
        if (isUpdateLocation) {
          menuItems.checkFarmerSelection(text, res, textValue);
        } else if (isAddFarmDetails) {
          menuItems.checkFarmerSelection(text, res, textValue);
        } else if (isAddProduct) {
          menuItems.checkFarmerSelection(text, res, textValue);
        } else if (isUpdateFarmerDetails) {
          menuItems.checkFarmerSelection(text, res, textValue);
        } else {
          message = "CON Invalid choice";
          message += menus.footer;
          res.send(message);
        }
      } else if (response[0] === "buyer") {
        menuItems.checkBuyerSelection(res, textValue, text);
      } else {
        message = "END Something went wrong on our end, try again later";
        res.send(message);
      }
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}, `);
});
