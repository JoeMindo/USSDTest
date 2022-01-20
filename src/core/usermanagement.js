/* eslint-disable consistent-return */
import axios from 'axios';
import { postrequest } from './services.js';
import { BASEURL } from './urls.js';

const clearData = (details) => {
  details.name = '';
  details.Id = '';
  details.phone = '';
  details.password = '';
  details.role = '';
  return details;
};
/**
 * It takes in a user's registration data, and sends it to the server.
 * @param regdata - The data that the user has entered in the registration form.
 * @param phone - The phone number of the user
 * @returns The response object.
 */
const registerUser = async (regdata, phone) => {
  const path = `${BASEURL}/ussd/ussdRegister`;
  let response;
  const postdata = {
    phone_no: phone,
    first_name: regdata.first_name,
    last_name: regdata.last_name,
    id_no: regdata.id_no,
    role_id: regdata.role_id,
    email: regdata.email,
    password: regdata.password,
    password_confirmation: regdata.password_confirmation,
    gender: regdata.gender,
  };
  try {
    response = await axios.post(path, postdata);
    return response;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * It takes in a loginData object and sends a post request to the login endpoint.
 * @param loginData - {
 * @returns A JSON object containing the user's details.
 */
const loginUser = async (loginData) => {
  const path = `${BASEURL}/ussd/login`;
  const postdata = {
    phone_no: loginData.phone_no,
    password: loginData.password,
  };
  try {
    const loginresponse = await postrequest(postdata, path);
    return loginresponse;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * It takes in a locationData object and an id and sends a POST request to the API with the
locationData object as the body and the id as the path.
 * @param locationData - The data to be sent to the API
 * @param id - The id of the geo area you want to add locations to.
 * @returns The response object.
 */
const addLocation = async (locationData, id) => {
  const path = `${BASEURL}/ussd/geoarea/${id}`;
  const locationResponse = await postrequest(locationData, path).catch((err) => err.response);
  return locationResponse;
};

/**
 * This function checks if a farmer has been verified by the admin.
 * @param id - The farmer's id
 * @returns The status of the farmer verification
 */
const checkFarmerVerification = async (id) => {
  const path = `${BASEURL}/ussd/isverified/${id}`;
  try {
    const verificationresponse = await postrequest(path);
    return verificationresponse.status;
  } catch (err) {
    throw new Error(err);
  }
};
const checkVerification = () => true;

/**
 * It checks if a user exists in the database.
 * @param phone - The phone number of the user
 * @returns {
 *   exists: true/false,
 *   role: 'farmer/buyer',
 *   user_id: 'user_id'
 * }
 */
const checkIfUserExists = async (phone) => {
  try {
    const details = {
      phone_no: phone,
    };
    const response = await axios.post(`${BASEURL}/ussd/isuser`, details);
    if (response.data.status === 'success') {
      return {
        exists: response.data.message,
        role: response.data.role,
        user_id: response.data.userid,
      };
    }
  } catch (err) {
    return false;
  }
};
/**
 * Checks if location data is availble for user
 * @param id - The id of the user
 * @returns The location of the user.
 */
const isLocationPresent = async (id) => {
  const response = await axios.get(`${BASEURL}/ussd/checklocationdetails/${id}`).catch((err) => err.response);
  if (response.status === 200) {
    return true;
  }
  return false;
};

export {
  clearData,
  registerUser,
  loginUser,
  addLocation,
  checkFarmerVerification,
  checkVerification,
  checkIfUserExists,
  isLocationPresent,
};
