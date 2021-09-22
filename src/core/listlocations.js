import axios from "axios";
import { BASEURL } from "../config/urls.js";

export let getRegions = async () => {
  
  let regions = []
  let menuItems = {}
  try {
    
    let regionsResult = await axios.get(`${BASEURL}/api/regions/`);

    regionsResult.data.forEach((location) => {
      regions.push(location);
    })
    regions.forEach((value,index) => {
      menuItems[index] = value.region_name
    })
    return menuItems
    
  } catch (error) {
    throw new Error(error);
  }
};



// export let getLocations = async () => {
  
//   try {
//     let locations = []
//     let locationsResult = await axios.get(`${BASEURL}/api/locations/${region}`);

//     locationsResult.data.forEach((location) => {
//       locations.push(location);
//     })
//     return locations;
    
//   } catch (error) {
//     throw new Error(error);
//   }
// }