import express from "express";
import bodyParser from "body-parser";
import logger from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import redis from "redis";
import connectRedis from "connect-redis";
import { registerUser, clearData, loginUser } from "./core/usermanagement.mjs";
import { getRegions, getLocations, splitText } from "./core/listlocations.js";

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
  var countyIDS = [];
  var subcountyIDS = [];
  let sessionId = req.body.sessionId;
  let text = req.body.text;
  let phoneNumber = req.body.phoneNumber;
  let serviceCode = req.body.serviceCode;
  var locationIDS = [];
  console.log("incoming text" + text);
  let textValue = text.split("*").length;
  if (text === "") {
    message = `CON Welcome to Mamlaka Foods\n 1. Register \n 2. Login`;
    res.send(message);
  } else if (textValue === 1 && text == "2") {
    message = `CON Enter phone`;
    res.send(message);
  } else if (textValue === 2 && text.split("*")[0] === "2") {
    message = `CON Enter password`;
    res.send(message);
  } else if (textValue === 3 && text.split("*")[0] === "2") {
    req.session.login = text.split("*");
    userLogin.phone_no = req.session.login[1];
    userLogin.password = req.session.login[2];
    loginUser(userLogin);
  } else if (textValue === 1) {
    message = `CON Enter your first name`;
    res.send(message);
  } else if (textValue === 2) {
    message = `CON Enter your last name`;
    res.send(message);
  } else if (textValue === 3) {
    message = `CON What is your ID number`;
    res.send(message);
  } else if (textValue === 4) {
    message = `CON Which phone number would you like us to reach you at?`;
    res.send(message);
  } else if (textValue === 5) {
    message = `CON What is your gender?\n1.Male\n2.Female\n3.Prefer not to say`;
    res.send(message);
  } else if (textValue === 6) {
    message = `CON Enter your password (Atleast 8 characters)`;
    res.send(message);
  } else if (textValue === 7) {
    message = `CON Confirm your password`;
    res.send(message);
  } else if (textValue === 8) {
    message = `CON Who are you?
      1. Farmer
      2. Buyer
      3. DEAN
      `;
    res.send(message);
  } else if (textValue === 9) {
    message = `CON What is your email?`;
    res.send(message);
  } else if (textValue === 10) {
    let regions = getRegions();
    let output = regions.then((data) => {
      return data;
    });
    output.then((list) => {
      message = `CON Select region\n ${list.split(":")[0]}`;
      res.send(message);
    });
  } else if (textValue === 11) {
    // console.log("TextValue", textValue);
    let countyID = splitText(text, 10);
    countyID = parseInt(countyID);
    countyID += 1;
    console.log("County ID", countyID);
    let counties = getLocations("counties", countyID, "county_name");
    let output = counties.then((data) => {
      return data;
    });
    output.then((list) => {
      console.log("List", list);
      message = `CON Select county\n ${list}`;
      res.send(message);
    });
  }
  // Sub county
  // else if (textValue === 12) {
  //   let subcountyPos = splitText(text, 11);
  //   subcountyPos = parseInt(subcountyPos);
  //   let subcountyID = countyIDS[subcountyPos];
  //   console.log("CountyIDS", countyIDS)
  //   console.log('Subcounty ID', subcountyID)
  //   let subcounties = getLocations(
  //     "subcounties",
  //     subcountyID,
  //     "subcounty_name",
  //   );
  //   let output = subcounties.then((data) => {
  //     return data;
  //   });
  //   output.then((list) => {
  //     message = `CON Select subcounty\n ${list}`;
  //     res.send(message);
  //   });
  // }
  // Location
  // else if (textValue === 13) {
  //   let locationPos = splitText(text, 12);
  //   locationPos = parseInt(locationPos);
  //   let locationID = subcountyIDS[locationPos];

  //   let locations = getLocations(
  //     "locations",
  //     locationID,
  //     "location_name",
  //     locationIDS
  //   );
  //   let output = locations.then((data) => {
  //     return data;
  //   });
  //   output.then((list) => {
  //     message = `CON Select location\n ${list}`;
  //     res.send(message);
  //   });
  // }
  // Area
  // else if (textValue === 14) {
  //   message = "CON Enter area";
  //   res.send(message);
  // }
  // Complete
  // else if (textValue === 15) {
  //   message = "CON Finish Registration\n 1. Yes\n 2.No";
  //   res.send(message);
  // }
  else if (textValue === 12) {
    message = `END Thank you`;
    res.send(message);
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
});

app.listen(port, () => {
  console.log(`Server running on port ${port}, `);
});
