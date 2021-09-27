import { postrequest } from './services.mjs';
import { BASEURL } from '../config/urls.js';

const clearData = (details) => {
  details.name = '';
  details.Id = '';
  details.phone = '';
  details.password = '';
  details.role = '';

  return details;
};
const registerUser = async (regdata) => {
  const path = `${BASEURL}/api/register`;
  const postdata = {
    phone_no: regdata.phone_no,
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
    console.log(error);
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
    console.log(error);
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

export {
  clearData, registerUser, loginUser, addLocation,
};
