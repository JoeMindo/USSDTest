import axios from "axios";
import { BASEURL } from "../config/urls.js";

export let listLocations = async (locationtype, id = null) => {
  
  
  try {
    let locations = []
    let menu = ''
    let test = await axios.get(`${BASEURL}/api/${locationtype}/`);
    test.data.forEach((location) => {
      locations.push(location);
      menu += `${location.county_name}. ${location.county_name}`
    })
    
  } catch (error) {
    throw new Error(error);
  }
};


