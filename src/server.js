import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import logger from "morgan";
import axios from "axios";
import { use } from "chai";
import { registerUser, clearData } from "./core/usermanagement";

dotenv.config();
const port = process.env.PORT || 3030;

let app = express();
let message = "";
let userDetails = {
  name: "",
  Id: "",
  phone: "",
  password: "",
  role: "",
};

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/ussd", (req, res) => {
  let { sessionId, serviceCode, phoneNumber, text } = req.body;
  let textValue = text.split("*").length;

  if (text == "") {
    message = `CON Welcome to Mamlaka Foods\n 1. Proceed`;
  } else if (textValue === 1) {
    message = `CON
    Enter your name
    `;
    userDetails.name = text;
  } else if (textValue === 2) {
    message = `CON What is your ID number`;
    userDetails.Id = text.split("*")[1];
  } else if (textValue === 3) {
    message = `CON Which phone number would you like us to reach you at?`;
    userDetails.phone = text.split("*")[2];
  } else if (textValue === 4) {
    message = `CON Enter your password`;
    userDetails.password = text.split("*")[3];
  } else if (textValue === 5) {
    message = `CON Who are you?
    1. Farmer
    2. Buyer
    `;
    userDetails.role = text.split("*")[4];
  } else if (textValue === 6) {
    message = `CON Complete registration
    1. Yes
    2. No`;
    if (text.split("*")[5] === "Yes") {
      registerUser(userDetails, sessionId, phoneNumber);
      clearData();
      message = `END Thank you for registering`;
    }
  } else {
    message = `END Thank you for trying out Mamlaka Foods`;
    clearData();
  }
  res.send(message,200)
});
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}, `);
});

export { server, app };
