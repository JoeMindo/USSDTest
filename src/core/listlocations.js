/* eslint-disable import/extensions */
import axios from 'axios';
import { BASEURL } from '../config/urls.js';

export const getRegions = async () => {
  const regions = [];
  let menuItems = '';
  const menuIDs = [];
  try {
    const regionsResult = await axios.get(`${BASEURL}/api/regions/`);

    regionsResult.data.data.forEach((location) => {
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

    locationResult.data.data.forEach((location) => {
      locationType.push(location);
    });
    locationType.forEach((value, index) => {
      const name = value[identifier];
      menuItems += `${index}. ${name}\n`;
      menuIDs.push(value.id);
    });
    console.log('Locations result is', menuItems);
    return {
      items: menuItems,
      ids: menuIDs,
    };
  } catch (error) {
    throw new Error(error);
  }
};

export const splitText = (text, index) => text.split('*')[index];
