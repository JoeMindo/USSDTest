import axios from "axios";
import { BASEURL } from "../config/urls.js";

export let listLocations = async (locationtype, id = null) => {
  let menu = ''
  
  try {
    let test = await axios.get(`${BASEURL}/api/${locationtype}/`);
    test.data.forEach((location) => {
      console.log(location);
      menu += `\n${test.data.indexOf(location)}. ${location.county_name}`
      return menu
    })
    
  } catch (error) {
    throw new Error(error);
  }
};


