/* eslint-disable import/extensions */
/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import { BASEURL } from '../../core/urls.js';

export const addFarm = async (farm) => {
  try {
    // TODO:Backend resolve this issue
    const response = await axios.post(`${BASEURL}/api/farm/save`, farm);
    return response;
  } catch (err) {
    return err;
  }
};

export const addFarmerKYC = async (farmerKYC, id) => {
  try {
    const response = await axios.post(
      `${BASEURL}/api/kycsanswers/save/${id}`,
      farmerKYC,
    );

    return response;
  } catch (err) {
    throw new Error(err);
  }
};

export const getFarmerMetricSections = async () => {
  try {
    const response = await axios.get(`${BASEURL}/api/kycmetricsections/1`);
    return response;
  } catch (err) {
    throw new Error(err);
  }
};
export const getQuestionsPerSection = async (sectionId) => {
  try {
    const response = await axios.get(
      `${BASEURL}/api/kycquestions/${sectionId}`,
    );
    return response;
  } catch (err) {
    throw new Error(err);
  }
};
export const getAnswersPerQuestion = async (questionId) => {
  try {
    const response = await axios.get(
      `${BASEURL}/api/kycpossibleanswers/${questionId}`,
    );
    return response;
  } catch (err) {
    throw new Error(err);
  }
};

export const getUserFarms = async (userId) => {
  try {
    const response = axios.get(`${BASEURL}/api/farm/${userId}`);
    return response;
  } catch (error) {
    return error;
  }
};