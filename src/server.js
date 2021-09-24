import express from "express";
import bodyParser from "body-parser";
import logger from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import redis from "redis";

import bluebird from "bluebird";

import { registerUser, loginUser } from "./core/usermanagement.mjs";

import { getRegions, getLocations, splitText } from "./core/listlocations.js";
import { addLocation } from "./core/usermanagement.mjs";

const port = process.env.PORT || 3030;

const app = express();

const client = redis.createClient();
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
  let message = "";

  let userLogin = {
    phone_no: "",
    password: "",
  };
  let text = req.body.text;
  // TODO: Migrate this to usermanagement
  let isRegistration = text.split("*")[0] === "1"
  let isLogin = text.split("*")[0] === "2"
  let isEditProfile = text.split("*")[3] === "2"
  console.log("incoming text " + text);
  let textValue = text.split("*").length;

  if (text === "") {
    message = `CON Welcome to Mamlaka Foods\n 1. Register \n 2. Login`;
    res.send(message);
  } else if (textValue === 1 && text == "2") {
    message = `CON Enter phone`;
    res.send(message);
  } else if (textValue === 2 && isLogin) {
    message = `CON Enter password`;
    res.send(message);
  } else if (textValue === 3 && isLogin) {
    req.session.login = text.split("*");
    userLogin.phone_no = req.session.login[1];
    userLogin.password = req.session.login[2];
    loginUser(userLogin).then((response) => {
      console.log(response);
      message = `CON Welcome`;
      if (
        response.data.geo_status === false &&
        response.data.location === false
      ) {
        message = `CON 1. Update location\n 2. Edit Profile`;
        res.send(message);
        client.set("user_id", `${response.data.user_id}`, redis.print);

      } else {
        message = `CON 1. Add products\n 2. Edit Profile`
        res.send(message)
      }
    });
  } else if (textValue === 4 && isLogin) {
    let regions = getRegions();
    let output = regions.then((data) => {
      return data;
    });
    output.then((list) => {
      message = `CON Select region\n ${list.items}`;

      res.send(message);
    });
  } else if (textValue === 5 && isLogin) {
    let userInput = splitText(text, 4);
    userInput = parseInt(userInput);
    // Get regionID
    let regions = getRegions();
    let output = regions.then((data) => {
      return data;
    });
    output.then((region_ids) => {

      let counties = getLocations(
        "counties",
        region_ids.ids[userInput],
        "county_name"
      );
      client.set("region_id", region_ids.ids[userInput]);
      let county_data = counties.then((data) => {
        console.log(data);
        return data;
      });
      county_data.then((list) => {
        console.log("List", list);
        message = `CON Select county\n ${list.items}`;
        res.send(message);
      });
    });
  }
  // Sub county list
  else if (textValue === 6 && text.split("*")[0] === "2") {
    let regionInput = splitText(text, 4);
    let countyInput = splitText(text, 5);
    regionInput = parseInt(regionInput);
    // Get regionID
    let regions = getRegions();
    let output = regions.then((data) => {
      return data;
    });
    output.then((region_ids) => {
      let counties = getLocations(
        "counties",
        region_ids.ids[regionInput],
        "county_name"
      );
      let county_data = counties.then((data) => {
        console.log(data);
        return data;
      });
      county_data.then((county_ids) => {
        let subcounties = getLocations(
          "subcounties",
          county_ids.ids[countyInput],
          "sub_county_name"
        );
        client.set("county_id", county_ids.ids[countyInput]);
        let subcounty_data = subcounties.then((data) => {
          return data;
        });
        subcounty_data.then((list) => {
          console.log("List", list.ids);
          message = `CON Select subcounty\n ${list.items}`;
          res.send(message);
        });
      });
    });
  }
  // Locations
  else if (textValue === 7 && text.split("*")[0] === "2") {
    let regionInput = splitText(text, 4);
    let countyInput = splitText(text, 5);
    let subcountyInput = splitText(text, 6);
    regionInput = parseInt(regionInput);
    // Get regionID
    let regions = getRegions();
    let output = regions.then((data) => {
      return data;
    });
    output.then((region_ids) => {
      let counties = getLocations(
        "counties",
        region_ids.ids[regionInput],
        "county_name"
      );
      let county_data = counties.then((data) => {
        console.log(data);
        return data;
      });
      county_data.then((county_ids) => {
        let subcounties = getLocations(
          "subcounties",
          county_ids.ids[countyInput],
          "sub_county_name"
        );

        let subcounty_data = subcounties.then((data) => {
          return data;
        });
        subcounty_data.then((location_ids) => {
          console.log("Subcounty list", location_ids.ids);
          let locations = getLocations(
            "locations",
            location_ids.ids[subcountyInput],
            "location_name"
          );
          client.set("subcounty_id", location_ids.ids[subcountyInput]);
          let location_data = locations.then((data) => {
            return data;
          });
          location_data.then((list) => {
            console.log("Locations", list);

            message = `CON Select locations\n ${list.items}`;
            res.send(message);
          });
        });
      });
    });
  } else if (textValue === 8 && text.split("*")[0] === "2") {
    let regionInput = splitText(text, 4);
    let countyInput = splitText(text, 5);
    let subcountyInput = splitText(text, 6);
    let locationInput = splitText(text, 7)
    regionInput = parseInt(regionInput);
    // Get regionID
    let regions = getRegions();
    let output = regions.then((data) => {
      return data;
    });
    output.then((region_ids) => {
      let counties = getLocations(
        "counties",
        region_ids.ids[regionInput],
        "county_name"
      );
      let county_data = counties.then((data) => {
        console.log(data);
        return data;
      });
      county_data.then((county_ids) => {
        let subcounties = getLocations(
          "subcounties",
          county_ids.ids[countyInput],
          "sub_county_name"
        );

        let subcounty_data = subcounties.then((data) => {
          return data;
        });
        subcounty_data.then((location_ids) => {
          console.log("Subcounty list", location_ids.ids);
          let locations = getLocations(
            "locations",
            location_ids.ids[subcountyInput],
            "location_name"
          );
          client.set("subcounty_id", location_ids.ids[subcountyInput]);
          let location_data = locations.then((data) => {
            return data;
          });
          location_data.then((final_location_ids) => {
            client.set("location_id", final_location_ids.ids[locationInput])

            message = `CON Enter your area`;
            res.send(message);
          });
        });
      });
    });


  } else if (textValue === 9 && isLogin) {
    message = `END Thank you, please wait for verification so you can start adding products`;
    client.set("area", text.split("*")[8])
    let getLabelValues = () => {
      var user_id = client.getAsync("user_id").then((reply) => {
        return reply;
      });
      var region_id = client.getAsync("region_id").then((reply) => {
        return reply;
      });
      var county_id = client.getAsync("county_id").then((reply) => {
        return reply;
      });
      var subcounty_id = client.getAsync("subcounty_id").then((reply) => {
        return reply;
      });
      var location_id = client.getAsync("location_id").then((reply) => {
        return reply;
      });
      var area = client.getAsync("area").then((reply) => {
        return reply;
      });
      return Promise.all([user_id, region_id, county_id, subcounty_id, location_id, area]);
    };
    getLabelValues().then((results) => {
      let captured_location = {};


      captured_location['user_id'] = results[0];
      captured_location['region_id'] = results[1];
      captured_location['county_id'] = results[2];
      captured_location['subcounty_id'] = results[3];
      captured_location['location_id'] = results[4];
      captured_location['area'] = results[5];

      let post_location = {
        "sub_county_id": captured_location['subcounty_id'],
        "location_id": captured_location['location_id'],
        "area": captured_location['area']

      }
      let post_id = parseInt(captured_location['user_id'])
      addLocation(post_location, post_id).then((response) => {
        console.log(response)
      })


    });

    res.send(message);
  } else if ((textValue === 1 && isRegistration) || (isLogin && textValue === 4 && isEditProfile)) {
    message = `CON Enter your first name`;
    res.send(message);
  } else if ((textValue === 2 && isRegistration) || (isLogin && textValue === 5 )) {
    message = `CON Enter your last name`;
    res.send(message);
  } else if ((textValue === 3 && isRegistration) || (isLogin && textValue === 6 )) {
    message = `CON What is your ID number`;
    res.send(message);
  } else if ((textValue === 4 && isRegistration)|| (isLogin && textValue === 7 )) {
    message = `CON What is your gender?\n1.Male\n2.Female\n3.Prefer not to say`;
    res.send(message);
  } else if ((textValue === 5 && isRegistration) || (isLogin && textValue === 8 )) {
    message = `CON Enter your password (Atleast 8 characters)`;
    res.send(message);
  } else if ((textValue === 6 && isRegistration)|| (isLogin && textValue === 9 )) {
    message = `CON Confirm your password`;
    res.send(message);
  } else if ((textValue === 7 && isRegistration) || (isLogin && textValue === 10 )) {
    message = `CON Who are you?
      1. Farmer
      2. Buyer
      3. DEAN
      `;
    res.send(message);
  } else if (textValue === 8) {
    message = `CON Enter phone`;
    res.send(message);
  } else if (textValue === 9 && text.split("*")[0] === "1") {
    req.session.registration = text.split("*");
    let userDetails = {
      first_name: req.session.registration[1],
      last_name: req.session.registration[2],
      id_no: req.session.registration[3],
      gender: "Male",
      password: req.session.registration[5],
      password_confirmation: req.session.registration[6],
      role_id: req.session.registration[7],
      phone_no: req.session.registration[8],
      // email: req.session.registration[9],
    };
    let out = registerUser(userDetails);
    out.then((response) => {
      message = `END Thank you!`;
      console.log(response.status);

      res.send(message);
    });
  } else {

    message = `Hmm someting went wrong`;
    res.send(message);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}, `);
});
