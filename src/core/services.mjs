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
  phone = null,
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
let patchrequest = async (
  params,
  endpoint,
  queryparams,
  phone = null,
  fcmtoken = null
) => {
  console.log(options[endpoint]);
  console.log(params);
  try {
    //    TODO: Redis get phone
    

    let res = await axios.patch(options[endpoint] + queryparams, params, {
      headers: { Authorization: token },
    });
    console.log("Response from Patch " + JSON.stringify(res.data));
    return res.data;
  } catch (error) {
    if (error.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log(error.response.data);
      return error.response.data;
      //console.log(error.response.status);
      // console.log(error.response.headers);
    } else if (error.request) {
      /*
       * The request was made but no response was received, `error.request`
       * is an instance of XMLHttpRequest in the browser and an instance
       * of http.ClientRequest in Node.js
       */
      console.log(error.request);
    } else {
      // Something happened in setting up the request and triggered an Error
      console.log("Error", error.message);
    }
    // console.log(error);
  }
};


let deleterequest = async (params, endpoint, queryparams, phone = null, fcmtoken = null) => {
    try {

    } catch (error) {
        throw new Error(error);
    }
    
}