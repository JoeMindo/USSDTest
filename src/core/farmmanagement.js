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
