import axios from 'axios';
import { BASEURL } from '../../core/urls.js';

/**
 * It gets the regions from the database and returns them as a menu.
 * @returns The response object is an object with the following properties:
 */
export const getRegions = async () => {
  const regions = [];
  let menuItems = '';
  const menuIDs = [];

  const regionsResult = await axios.get(`${BASEURL}/ussd/regions/`).catch((err) => err.response);
  if (regionsResult.status === 200) {
    regionsResult.data.message.forEach((location) => {
      regions.push(location);
    });
    regions.forEach((value, index) => {
      menuItems += `${(index += 1)}. ${value.region_name}\n`;
      menuIDs.push(value.id_regions);
    });
    return {
      items: menuItems,
      ids: menuIDs,
    };
  }
  return regionsResult;
};

/**
 * It takes in a type, id and identifier and returns a menuItems and menuIDs.
 * @param type - The type of location you want to get.
 * @param id - The id of the location
 * @param identifier - The identifier of the location type
 * @returns The menu items and the ids of the locations.
 */
export const getLocations = async (type, id, identifier) => {
  const locationType = [];

  let menuItems = '';
  const menuIDs = [];
  const locationResult = await axios
    .get(`${BASEURL}/ussd/${type}/${id}`)
    .catch((error) => error.response);
  if (locationResult.status === 200) {
    locationResult.data.message.forEach((location) => {
      locationType.push(location);
    });
    locationType.forEach((value, index) => {
      const name = value[`${identifier}`];
      menuItems += `${(index += 1)}. ${name}\n`;
      menuIDs.push(value.id);
    });

    return {
      items: menuItems,
      ids: menuIDs,
    };
  }
  return locationResult;
};

/**
 * Given a string and an index, split the string into
 * an array of strings and return the element at the
 * index.
 * @param text - The text to split
 * @param index - The index of the text to return.
 * @returns None
 */
export const splitText = (text, index) => text.split('*')[`${index}`];
