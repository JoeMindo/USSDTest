import express from "express";
import bodyParser from "body-parser";
import logger from "morgan";
import cookieParser from "cookie-parser";
import session from 'express-session'
import { registerUser, clearData } from "./core/usermanagement.mjs";
const port = process.env.PORT || 3030;

const app = express();

app.use(logger("dev"));
app.use(cookieParser());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({secret: "Shh, its a secret!"}));
app.post("/ussd",  (req, res) => {
  var userDetailsRegister = {
    first_name: "",
    last_name: "",
    id_no: "",
    phone_no: "",
    gender: "",
    email: "",
    password: "",
    location: "",
    password_confirmation: "",
  };
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
    userLogin.phone_no = text.split("*")[1];
  } else if (textValue === 2 && (text.split("*")[0]) === "2") {
    message = `CON Enter password`;
    userLogin.password = text.split("*")[2];
  } else if (textValue === 1) {
    message = `CON Enter your first name`;
    req.session.first_name = text.split("*")[1]
    userDetailsRegister.first_name = text.split("*")[1];
  } else if (textValue === 2) {
    message = `CON Enter your last name ${req.session.first_name}`;
    userDetailsRegister.last_name = text.split("*")[2];
  } else if (textValue === 3) {
    message = `CON What is your ID number`;
    userDetailsRegister.id_no = text.split("*")[3];
  } else if (textValue === 4) {
    message = `CON Which phone number would you like us to reach you at?`;
    userDetailsRegister.phone_no = text.split("*")[4];
  } else if (textValue === 5) {
    message = `CON What is your gender?\n1.Male\n2.Female\n3.Prefer not to say`;
    userDetailsRegister.gender = text.split("*")[5];
  } else if (textValue === 6) {
    message = `CON Enter your password`;
    userDetailsRegister.password = text.split("*")[6];
  } else if (textValue === 7) {
    message = `CON Confirm your password`;
    userDetailsRegister.password_confirmation = text.split("*")[7];
    // } else if (textValue === 8) {
    //   message = `CON Who are you?
    //   1. Farmer
    //   2. Buyer
    //   3. DEAN
    //   `;
    //   userDetailsRegister.role = text.split("*")[8];
    //     } else if (textValue === 8) {
    message = `CON Complete registration
    1. Yes
    `;
    registerUser(userDetailsRegister, phoneNumber);
  } else {
    message = `END Thank you! ${JSON.stringify(userDetailsRegister)}`;
  }
  res.send(message)
});

app.listen(port, () => {
  console.log(`Server running on port ${port}, `);
});
