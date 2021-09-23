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
      message = `CON Select region\n ${list.items}`;
      console.log(list.ids)
      

      res.send(message);
    });
  } else if (textValue === 11) {
    let userInput = splitText(text, 10);
    userInput = parseInt(userInput);
    // Get regionID
    let regions = getRegions();
    let output = regions.then((data) => {
      return data;
    });
    output.then((region_ids) => {
      let counties = getLocations("counties", region_ids.ids[userInput], "county_name");
      let county_data = counties.then((data) => {
        console.log(data)
        return data;
      });
      county_data.then((list) => {
        console.log("List", list);
        countyIDS.push(list.ids)
        console.log('Ids',countyIDS)
        message = `CON Select county\n ${list.items}`;
        res.send(message);
      });
     
    })
  }
    // Sub county list
  else if (textValue === 12) {
    let regionInput = splitText(text, 10);
    let countyInput = splitText(text,11)
    regionInput = parseInt(regionInput);
    // Get regionID
    let regions = getRegions();
    let output = regions.then((data) => {
      return data;
    });
    output.then((region_ids) => {
      let counties = getLocations("counties", region_ids.ids[regionInput], "county_name");
      let county_data = counties.then((data) => {
        console.log(data)
        return data;
      });
      county_data.then((county_ids) => {
        let subcounties = getLocations("subcounties", county_ids.ids[countyInput], "sub_county_name")
        let subcounty_data = subcounties.then((data) => {
          return data;
        })
        subcounty_data.then((list) => {
          console.log("List", list.ids);
          message = `CON Select subcounty\n ${list.items}`;
          res.send(message);
        });
        
      });
     
    })
    
  }

  else if (textValue === 13) {
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
