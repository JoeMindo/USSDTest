import axios from 'axios';
import { BASEURL } from '../../core/urls.js';

export const getRegions = async () => {
  const regions = [];
  let menuItems = '';
  const menuIDs = [];
  try {
    const regionsResult = await axios.get(`${BASEURL}/ussd/regions/`);

    regionsResult.data.message.data.forEach((location) => {
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
  } catch (error) {
    throw new Error(error);
  }
};

// getLocations('counties', regionId, 'county_name');
export const getLocations = async (type, id, identifier) => {
  const locationType = [];
  let menuItems = '';
  const menuIDs = [];

  const locationResult = await axios
    .get(`${BASEURL}/ussd/${type}/${id}`)
    .catch((error) => error.response);
  locationResult.data.message.data.forEach((location) => {
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
};

export const splitText = (text, index) => text.split('*')[`${index}`];
