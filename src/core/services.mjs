import axios from "axios";
import jwt from "jsonwebtoken";

let createToken = async (payload) => {
  try {
    let token = await jwt.sign(payload, "this is secret");
    return token;
  } catch (error) {
    console.log(error);
  }
};
export let postrequest = async (
  params,
  endpoint,
  fcmtoken = null
) => {
  let token = createToken(params).then((result) => {
    return result;
  });
  try {
    if (fcmtoken) {
      token = fcmtoken;
    }
    if (token) {
      let response = await axios.post(endpoint, params, {
        headers: { Authorization: "Bearer " + token },
      });
      return response;
    } else {
      let response = await axios.post(endpoint, params, { headers: {} });
      return response;
    }
  } catch (error) {
    console.log(error);
  }
};



