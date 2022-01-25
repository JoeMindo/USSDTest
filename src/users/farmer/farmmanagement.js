/* eslint-disable import/extensions */
/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import { BASEURL } from '../../core/urls.js';

/**
 * It takes a farm object and sends it to the server.
 * @param farm - The farm object to be saved.
 * @returns The response object.
 */
export const addFarm = async (farm) => {
  const response = await axios
    .post(`${BASEURL}/ussd/farm/save`, farm)
    .catch((err) => err.response);
  return response;
};

/**
 * It takes in a farmerKYC object and an id and sends it to the API.
 * @param farmerKYC - {
 * @param id - The farmer id
 * @returns The farmer's KYC answers
 */
export const addFarmerKYC = async (farmerKYC, id) => {
  try {
    const response = await axios.post(
      `${BASEURL}/ussd/kycsanswers/save/${id}`,
      farmerKYC,
    );

    return response;
  } catch (err) {
    throw new Error(err);
  }
};

/**
 * Get the farmer metric sections.
 * @returns The response is an object with the following properties:
 */
export const getFarmerMetricSections = async () => {
  const response = await axios
    .get(`${BASEURL}/ussd/kycmetricsections/1`)
    .catch((err) => err.response);
  return response;
};
/**
 * It gets the questions for a specific section.
 * @param sectionId - The section id of the section you want to get the questions for.
 * @returns The question and the answer.
 */
export const getQuestionsPerSection = async (sectionId) => {
  const response = await axios
    .get(`${BASEURL}/ussd/kycquestions/${sectionId}`)
    .catch((err) => err.response);
  return response;
};
/**
 * Get all possible answers for a question.
 * @param questionId - The question id of the question you want to get the possible answers for.
 * @returns The possible answers for the question.
 */
export const getAnswersPerQuestion = async (questionId) => {
  const response = await axios
    .get(`${BASEURL}/ussd/kycpossibleanswers/${questionId}`)
    .catch((err) => err.response);
  return response;
};

/**
 * It gets all the farms owned by a user.
 * @param userId - The user's ID
 * @returns The response object.
 */
export const getUserFarms = async (userId) => {
  const response = axios
    .get(`${BASEURL}/ussd/farm/${userId}`)
    .catch((err) => err.response);
  return response;
};

/**
 * It fetches the available groups for a given location.
 * @param locationID - The location ID of the location you want to fetch groups for.
 * @returns The response object.
 */
export const fetchAvailableGroups = async (locationID) => {
  const response = await axios
    .get(`${BASEURL}/ussd/getgroupbylocationid/${locationID}`)
    .catch((err) => err.response);
  return response;
};

/**
 * This function gets the location ID of the user.
 * @param userId - The user's unique ID.
 * @returns The location ID
 */
export const getLocationID = async (userId) => {
  const response = await axios
    .get(`${BASEURL}/ussd/checklocationdetails/${userId}`)
    .catch((err) => err.response);
  return response;
};

/**
 * It fetches the available groups for the user and returns a menu prompt with the group names.
 * @param locationID - The location ID of the location where the user is trying to join a group.
 * @returns The message that is being returned is a string.
 */
export const showGroups = async (locationID) => {
  let message;
  const availableGroups = await fetchAvailableGroups(locationID);
  if (availableGroups.status === 200) {
    let menuPrompt = 'CON Choose a group you want to join\n';
    availableGroups.data.message.forEach((group) => {
      menuPrompt += `${group.id}. ${group.group_name}`;
    });
    message = menuPrompt;
  } else {
    message = 'CON Sorry, there are no groups available at the moment.';
  }

  return message;
};

/**
 * It takes in a group ID and a user ID and saves the user under the group.
 * @param groupID - The group ID of the group you want to join
 * @param userId - The user's phone number
 * @returns The response object is returned.
 */
export const joinGroup = async (groupID, userId) => {
  let message;
  const data = {
    group_id: groupID,
    user_id: userId,
  };
  const response = await axios
    .post(`${BASEURL}/ussd/saveuserundergroup/`, data)
    .catch((err) => err.response);

  if (response.status === 200) {
    message = 'END Successfully joined group';
  } else {
    message = 'END You are already in this group';
  }
  return message;
};
