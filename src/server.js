import express from "express";
import bodyParser from "body-parser";
import logger from "morgan";
import { registerUser, clearData } from "./core/usermanagement.mjs";
const port = process.env.PORT || 3030;

const app = express();

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/ussd", (req, res) => {
  let message = "";
  let userDetails = {
    name: "",
    Id: "",
    phone: "",
    password: "",
    role: "",
  };
  
  let sessionId = req.body.sessionId
  let text = req.body.text
  let phoneNumber = req.body.phoneNumber
  let serviceCode = req.body.serviceCode

  let textValue = text.split("*").length;
  if (text === "") {
    message = `CON Welcome to Mamlaka Foods\n 1. Proceed`;
    
    res.send(message);
  } else if (textValue === 1) {
    message = `CON Enter your name`
    userDetails.name = text.split("*")[1];
    res.send(message);
  } else if (textValue === 3) {
    message = `CON What is your ID number`;
    userDetails.Id = text.split("*")[2];
    res.send(message);
  } else if (textValue === 4) {
    message = `CON Which phone number would you like us to reach you at?`;
    userDetails.phone = text.split("*")[3];
    res.send(message);
  } else if (textValue === 5) {
    message = `CON Enter your password`;
    userDetails.password = text.split("*")[4];
  } else if (textValue === 6) {
    message = `CON Who are you?
    1. Farmer
    2. Buyer
    `;
    userDetails.role = text.split("*")[5];
    res.send(message);
  } else if (textValue === 7) {
    message = `CON Complete registration
    1. Yes
    2. No`;
    res.send(message);
    if (text.split("*")[6] === "Yes") {
      registerUser(userDetails, sessionId, phoneNumber);
      clearData(userDetails);
      message = `END Thank you for registering`;
      res.send(message);
    }
  } else {
    message = `END Thank you for trying out Mamlaka Foods`;
    clearData(userDetails);
    res.send(message);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}, `);
});
