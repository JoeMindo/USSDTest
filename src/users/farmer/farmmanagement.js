/* eslint-disable import/extensions */
/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import { retreiveCachedItems } from '../../core/services.js';
import { BASEURL } from '../../core/urls.js';
import { menus } from '../../menus/menuoptions.js';

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
  try {
    const response = await axios.get(`${BASEURL}/ussd/kycmetricsections/1`);
    return response;
  } catch (err) {
    throw new Error(err);
  }
};
/**
 * It gets the questions for a specific section.
 * @param sectionId - The section id of the section you want to get the questions for.
 * @returns The question and the answer.
 */
export const getQuestionsPerSection = async (sectionId) => {
  try {
    const response = await axios.get(
      `${BASEURL}/ussd/kycquestions/${sectionId}`,
    );
    return response;
  } catch (err) {
    throw new Error(err);
  }
};
/**
 * Get all possible answers for a question.
 * @param questionId - The question id of the question you want to get the possible answers for.
 * @returns The possible answers for the question.
 */
export const getAnswersPerQuestion = async (questionId) => {
  try {
    const response = await axios.get(
      `${BASEURL}/ussd/kycpossibleanswers/${questionId}`,
    );
    return response;
  } catch (err) {
    throw new Error(err);
  }
};

/**
 * It gets all the farms owned by a user.
 * @param userId - The user's ID
 * @returns The response object.
 */
export const getUserFarms = async (userId) => {
  try {
    const response = axios.get(`${BASEURL}/ussd/farm/${userId}`);
    return response;
  } catch (error) {
    return error;
  }
};

/**
 * It fetches the available groups for a given location.
 * @param locationID - The location ID of the location you want to fetch groups for.
 * @returns The response object.
 */
export const fetchAvailableGroups = async (locationID) => {
  try {
    const response = await axios
      .get(`${BASEURL}/ussd/group/${locationID}`)
      .catch((err) => err.response);
    return response;
  } catch (err) {
    throw new Error(err);
  }
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
 * This function will show the user a list of groups that they can join.
 * @param client - the client object
 * @returns The group ID
 */
export const showGroups = async (client) => {
  let message;
  const userID = await retreiveCachedItems(client, ['user_id']);
  let locationID = await getLocationID(userID[0]);
  locationID = locationID.data.locationID;
  const availableGroups = await fetchAvailableGroups(locationID);
  console.log('The groups are', availableGroups);

  let menuPrompt = 'CON Choose a group you want to join\n';
  availableGroups.forEach((group) => {
    menuPrompt += `${group.id}. ${group.name}`;
  });

  message = menuPrompt;
  message += menus.footer;
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
    .post(`${BASEURL}/ussd/saveuserundergroup/${groupID}`, data)
    .catch((err) => err.response);
  if (response.status === 200) {
    message = 'END Successfully joined group';
  } else {
    message = `END ${response.data.message} `;
  }
  return message;
};
