import express from "express";
import bodyParser from "body-parser";
import logger from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import redis from "redis";
import connectRedis from "connect-redis";
import { registerUser, clearData, loginUser } from "./core/usermanagement.mjs";
import { getRegions } from "./core/listlocations.js";

const port = process.env.PORT || 3030;

const app = express();

const RedisStore = connectRedis(session);
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
  let message = "";

  let userLogin = {
    phone_no: "",
    password: "",
  };

  let sessionId = req.body.sessionId;
  let text = req.body.text;
  let phoneNumber = req.body.phoneNumber;
  let serviceCode = req.body.serviceCode;
  console.log("incoming text" + text);
  let textValue = text.split("*").length;
  if (text === "") {
    message = `CON Welcome to Mamlaka Foods\n 1. Register \n 2. Login`;
  } else if (textValue === 1 && text == "2") {
    message = `CON Enter phone`;
  } else if (textValue === 2 && text.split("*")[0] === "2") {
    message = `CON Enter password`;
  } else if (textValue === 3 && text.split("*")[0] === "2") {
    req.session.login = text.split("*");
    userLogin.phone_no = req.session.login[1];
    userLogin.password = req.session.login[2];
    loginUser(userLogin);
  } else if (textValue === 1) {
    message = `CON Enter your first name`;
  } else if (textValue === 2) {
    message = `CON Enter your last name`;
  } else if (textValue === 3) {
    message = `CON What is your ID number`;
  } else if (textValue === 4) {
    message = `CON Which phone number would you like us to reach you at?`;
  } else if (textValue === 5) {
    message = `CON What is your gender?\n1.Male\n2.Female\n3.Prefer not to say`;
  } else if (textValue === 6) {
    message = `CON Enter your password (Atleast 8 characters)`;
  } else if (textValue === 7) {
    message = `CON Confirm your password`;
  } else if (textValue === 8) {
    message = `CON Who are you?
      1. Farmer
      2. Buyer
      3. DEAN
      `;
  } else if (textValue === 9) {
    message = `CON What is your email?`;
  } else if (textValue === 10) {
    let regions = getRegions();
    regions.then((output) => {
     
      console.log(output);
      message = `CON Select your region\n${output}`;
      res.send(message);
    });
    
    

  } else if (textValue === 11) {
    message = `CON Complete registration
    1. Yes
    `;
  } else {
    req.session.registration = text.split("*");
    let userDetails = {
      first_name: req.session.registration[1],
      last_name: req.session.registration[2],
      id_no: req.session.registration[3],
      phone_no: req.session.registration[4],
      gender: "Male",
      password: req.session.registration[6],
      password_confirmation: req.session.registration[7],
      role_id: req.session.registration[8],
      email: req.session.registration[9],
    };
    let out = registerUser(userDetails);
    out.then((result) => {
      message = `END Thank you! ${result}`;
      console.log(result);
    });
  }
  res.send(message);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}, `);
});
