import axios from 'axios';
import { BASEURL } from '../../core/urls.js';

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
      menuItems += `${index += 1}. ${value.region_name}\n`;
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
      const name = value[`${identifier}`];
      menuItems += `${index += 1}. ${name}\n`;
      menuIDs.push(value.id);
    });

    return {
      items: menuItems,
      ids: menuIDs,
    };
  } catch (error) {
    return {
      items: 'Location not found',
    };
  }
};

export const splitText = (text, index) => text.split('*')[`${index}`];
