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

const addLocation = async (locationData, id) => {
  const path = `${BASEURL}/ussd/geoarea/${id}`;

  try {
    const locationResponse = await postrequest(locationData, path);
    return locationResponse;
  } catch (error) {
    throw new Error(error);
  }
};

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
const isLocationPresent = async (id) => {
  try {
    const response = await axios.get(`${BASEURL}/ussd/showprofile/${id}`);
    return response.data.location;
  } catch (err) {
    return false;
  }
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
