/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import { BASEURL } from '../config/urls.js';

export const addFarm = async (farm) => {
  try {
    const response = await axios.post(`${BASEURL}/api/farm/save`, farm);
    return response;
  } catch (err) {
    throw new Error(err);
  }
};

export const addFarmerKYC = async (farmerKYC, id) => {
  try {
    const response = await axios.post(`${BASEURL}/api/farmerkyc/update/${id}`, farmerKYC);
    console.log(response);
    return response;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};