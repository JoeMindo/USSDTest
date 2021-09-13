
import express from "express";
import bodyParser from "body-parser";
import logger from "morgan";
import { registerUser, clearData } from "./core/usermanagement";
const port = process.env.PORT || 3030;

const app = express();
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

app.post("*", (req, res) => {
  let { sessionId, serviceCode, phoneNumber, text } = req.body;
  let textValue = text.split("*").length;

  if (text == "") {
    message = `CON Welcome to Mamlaka Foods\n 1. Proceed`;
    res.send(message)
  } else if (textValue === 1) {
    message = `CON
    Enter your name
    `;
    userDetails.name = text;
    res.send(message)
  } else if (textValue === 2) {
    message = `CON What is your ID number`;
    userDetails.Id = text.split("*")[1];
    res.send(message)
  } else if (textValue === 3) {
    message = `CON Which phone number would you like us to reach you at?`;
    userDetails.phone = text.split("*")[2];
    res.send(message)
  } else if (textValue === 4) {
    message = `CON Enter your password`;
    userDetails.password = text.split("*")[3];
  } else if (textValue === 5) {
    message = `CON Who are you?
    1. Farmer
    2. Buyer
    `;
    userDetails.role = text.split("*")[4];
    res.send(message)
  } else if (textValue === 6) {
    message = `CON Complete registration
    1. Yes
    2. No`;
    res.send(message)
    if (text.split("*")[5] === "Yes") {
      registerUser(userDetails, sessionId, phoneNumber);
      clearData();
      message = `END Thank you for registering`;
      res.send(message)
    }
  } else {
    message = `END Thank you for trying out Mamlaka Foods`;
    clearData();
    res.send(message)
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}, `);
});

