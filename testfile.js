import axios from "axios";
import { BASEURL } from "./src/core/urls.js";

const getUserFarms = async (userId) => {
  try {
    const response = axios.get(`${BASEURL}/api/farm/${userId}`);
    return response;
  } catch (error) {
    if (error.response) {
    }
  }
};

// if (textValue === 3) {if (textValue === 3) {
//   const units = parseInt(text.split('*')[2], 10);
//   client.set('units', units);
//   const menuPrompt = 'CON How would you grade your produce?\n 1. Grade A \n 2. Grade B \n 3. Grade C \n 4.Grade D\n 5. Grade E';
//   message = menuPrompt;
// } else if (textValue === 4) {
//   let grade;
//   const selection = text.split('*')[3];
//   if (selection === '1') {
//     grade = 'A';
//     client.set('grade', grade);
//   } else if (selection === '2') {
//     grade = 'B';
//     client.set('grade', grade);
//   } else if (selection === '3') {
//     grade = 'C';
//     client.set('grade', grade);
//   } else if (selection === '4') {
//     grade = 'D';
//     client.set('grade', grade);
//   } else if (selection === '5') {
//     grade = 'E';
//     client.set('grade', grade);
//   } else {
//     message = 'Invalid grade';
//     message += menus.footer;
//   }
//   const addProductDetails = await retreiveCachedItems(client, [
//     'farm_id',
//     'productID',
//     'units',
//     'grade',
//   ]);

//   const addProductResponse = await addProductDetails;
//   const postDetails = {
//     farm_id: addProductResponse[0],
//     product_id: addProductResponse[1],
//     units: addProductResponse[2],
//     grade: addProductResponse[3],
//   };
//   const addProductToDB = await addProduct(postDetails);
//   if (addProductToDB.status === 200) {
//     message = 'END Added successfully';
//   } else {
//     message = 'END Added failed';
//   }
// }
//   const units = parseInt(text.split('*')[2], 10);
//   client.set('units', units);
//   const menuPrompt = 'CON How would you grade your produce?\n 1. Grade A \n 2. Grade B \n 3. Grade C \n 4.Grade D\n 5. Grade E';
//   message = menuPrompt;
// } else if (textValue === 4) {
//   let grade;
//   const selection = text.split('*')[3];
//   if (selection === '1') {
//     grade = 'A';
//     client.set('grade', grade);
//   } else if (selection === '2') {
//     grade = 'B';
//     client.set('grade', grade);
//   } else if (selection === '3') {
//     grade = 'C';
//     client.set('grade', grade);
//   } else if (selection === '4') {
//     grade = 'D';
//     client.set('grade', grade);
//   } else if (selection === '5') {
//     grade = 'E';
//     client.set('grade', grade);
//   } else {
//     message = 'Invalid grade';
//     message += menus.footer;
//   }
//   const addProductDetails = await retreiveCachedItems(client, [
//     'farm_id',
//     'productID',
//     'units',
//     'grade',
//   ]);

//   const addProductResponse = await addProductDetails;
//   const postDetails = {
//     farm_id: addProductResponse[0],
//     product_id: addProductResponse[1],
//     units: addProductResponse[2],
//     grade: addProductResponse[3],
//   };
//   const addProductToDB = await addProduct(postDetails);
//   if (addProductToDB.status === 200) {
//     message = 'END Added successfully';
//   } else {
//     message = 'END Added failed';
//   }
// }
