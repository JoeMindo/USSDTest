import axios from "axios";
import { BASEURL } from "../config/urls.js";

export let listLocations = async (locationtype, id = null) => {
  let menu = ''
  
  try {
    let locations = []
    let test = await axios.get(`${BASEURL}/api/${locationtype}/`);
    test.data.forEach((location) => {
      locations.push(location);
      return locations
    })
    
  } catch (error) {
    throw new Error(error);
  }
};


