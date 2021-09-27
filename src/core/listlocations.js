import axios from 'axios';
import { BASEURL } from '../config/urls.js';

export const getRegions = async () => {
  const regions = [];
  let menuItems = '';
  const menuIDs = [];
  try {
    const regionsResult = await axios.get(`${BASEURL}/api/regions/`);

    regionsResult.data.forEach((location) => {
      regions.push(location);
    });
    regions.forEach((value, index) => {
      menuItems += `${index}. ${value.region_name}\n`;
      menuIDs.push(value.id_regions);
    });
    return {
      items: menuItems,
      ids: menuIDs,
    };
  } catch (error) {
    throw new Error(error);
  }
};

export const getLocations = async (type, id, identifier) => {
  const locationType = [];
  let menuItems = '';
  const menuIDs = [];
  try {
    const locationResult = await axios.get(`${BASEURL}/api/${type}/${id}`);

    locationResult.data.forEach((location) => {
      locationType.push(location);
    });
    locationType.forEach((value, index) => {
      const name = value[identifier];
      menuItems += `${index}. ${name}\n`;
      menuIDs.push(value.id);
    });
    return {
      items: menuItems,
      ids: menuIDs,
    };
  } catch (error) {
    throw new Error(error);
  }
};

export const userSpecificSelection = (index, text) => {
  if (text.split('.')[0] === index) {
    return text.split('. ')[1];
  }
};
export const splitText = (text, index) => text.split('*')[index];
