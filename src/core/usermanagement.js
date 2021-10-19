/* eslint-disable consistent-return */
/* eslint-disable import/extensions */
import { postrequest, retreiveCachedItems } from './services.js';
import { BASEURL } from '../config/urls.js';
import { renderProductCategories } from '../config/rendermenu.js';

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

    // if (registrationresponse.status === 'success') {
    //   return registrationresponse.status;
    // } else {
    //   return registrationresponse.data.message;
    // }

    return registrationresponse.data;
  } catch (error) {
    return error;
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
    return 'Hmm something went wrong';
  }
};

const addLocation = async (locationData, id) => {
  const path = `${BASEURL}/api/geoarea/${id}`;

  try {
    const locationResponse = await postrequest(locationData, path);
    return locationResponse;
  } catch (error) {
    console.log(error);
  }
};

const checkFarmerVerification = async (id) => {
  const path = `${BASEURL}/api/isverified/${id}`;
  try {
    const verificationresponse = await postrequest(path);
    console.log('This is verification response', verificationresponse);
    return verificationresponse;
  } catch (err) {
    throw new Error(err);
  }
};
export {
  clearData, registerUser, loginUser, addLocation, checkFarmerVerification,
};
