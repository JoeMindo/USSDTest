/* eslint-disable consistent-return */
/* eslint-disable import/extensions */
import axios from 'axios';
import { postrequest } from './services.js';
import { BASEURL } from '../config/urls.js';

const clearData = (details) => {
  details.name = '';
  details.Id = '';
  details.phone = '';
  details.password = '';
  details.role = '';
  return details;
};
const registerUser = async (regdata, phone) => {
  const path = `${BASEURL}/api/register`;
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
    const registrationresponse = await postrequest(postdata, path);
    return registrationresponse.data;
  } catch (error) {
    throw new Error(error);
  }
};

const loginUser = async (loginData) => {
  const path = `${BASEURL}/api/login`;
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
  const path = `${BASEURL}/api/geoarea/${id}`;

  try {
    const locationResponse = await postrequest(locationData, path);
    return locationResponse;
  } catch (error) {
    throw new Error(error);
  }
};

const checkFarmerVerification = async (id) => {
  const path = `${BASEURL}/api/isverified/${id}`;
  try {
    const verificationresponse = await postrequest(path);
    return verificationresponse.status;
  } catch (err) {
    throw new Error(err);
  }
};
const checkVerification = () => true;

const getUsers = async (pageNumber = 1) => {
  const actualUrl = `${BASEURL}/api/user/details/?page=${pageNumber}`;
  console.log('Actual url', actualUrl);
  try {
    const users = await axios.get(actualUrl);
    return users.data.data;
  } catch (error) {
    throw new Error(error);
  }
};

const getEntireUserList = async (pageNumber = 1) => {
  const userresponse = await getUsers(pageNumber);
  if (userresponse.length > 0) {
    return userresponse.concat(await getEntireUserList(pageNumber + 1));
  }
  return userresponse;
};
const checkIfUserExists = async (phone) => {
  try {
    const userresponse = await getEntireUserList();
    const found = userresponse.some((profile) => profile.phone_no === phone);
    if (!found) {
      return false;
    }
    return true;
  } catch (error) {
    throw new Error(error);
  }
};
export {
  clearData, registerUser, loginUser, addLocation, checkFarmerVerification, checkVerification,
  checkIfUserExists,
};
