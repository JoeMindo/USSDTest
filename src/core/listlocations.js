import axios from "axios";
import { BASEURL } from "../config/urls.js";

export let getRegions = async () => {
  let regions = [];
  let menuItems = "";
  let menuIDs = [];
  try {
    let regionsResult = await axios.get(`${BASEURL}/api/regions/`);

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

export let getLocations = async (type, id, identifier) => {
  let locationType = [];
  let menuItems = "";
  let menuIDs = [];
  try {
    let locationResult = await axios.get(`${BASEURL}/api/${type}/${id}`);

    locationResult.data.forEach((location) => {
      locationType.push(location);
    });
    locationType.forEach((value, index) => {
      let name = value[identifier];
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

export let userSpecificSelection = (index, text) => {
  if (text.split(".")[0] === index) {
    return text.split('. ')[1]
    
  }
}
export let splitText = (text, index) => {
  return text.split("*")[index];
};
