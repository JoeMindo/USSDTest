import axios from 'axios';
import { BASEURL } from './urls.js';

const checkIfUserExists = async (phone) => {
  let userStatus;
  try {
    const details = {
      phone_no: phone,
    };
    const response = await axios.post(`${BASEURL}/api/isuser`, details);
    userStatus = response.data.message;
    return userStatus;
  } catch (err) {
    throw new Error(err);
  }
};

// eslint-disable-next-line import/prefer-default-export
console.log(await checkIfUserExists('0719408977'));