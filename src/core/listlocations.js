import axios from "axios";
import { BASEURL } from "../config/urls";

let listLocations = (locationtype, id = null) => {
  let menu = ''
  try {
    let result = await axios.get(`${BASEURL}/api/${locationtype}/`);
    result.data.forEach((location) => {
      menu += `\n${indexOf(location)}. ${location.county_name}`
      return menu
    })
    
  } catch (error) {
    throw new Error(error);
  }
};

export default listLocations;
