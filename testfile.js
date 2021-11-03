/* eslint-disable import/prefer-default-export */
// import axios from 'axios';

// const text = '2 1';
// const userSelections = text.split(' ');

// const stored = userSelections.map((selection) => parseInt(selection, 10));
// const cart = [];
// let result = '';
// console.log('Stored values are', stored);

// const isGroup = (selection) => {
//   if (selection === '1') {
//     return true;
//   }
//   return false;
// };

// const checkProds = async () => {
//   try {
//     const products = await axios.get('http://5dbc-197-232-124-171.ngrok.io/api/productsbyproductid/1');
//     // eslint-disable-next-line max-len
//     stored.forEach((id) => {
//       const items = products.data.message.data.filter((object) => object.id === id)[0];
//       if (items !== undefined) {
//         cart.push(items);
//       } else {
//         return 'Item not found';
//       }
//     });
//     cart.forEach((item, index) => {
//       result += `${index}. ${item.product_name} from ${item.farm_name} grade:${item.grade} `;
//       if (isGroup('1')) {
//         result += `${item.group_price} \n`;
//       } else {
//         result += `${item.unit_price} \n`;
//       }
//     });
//     console.log('Result is', result);
//     return result;
//   } catch (err) {
//     throw new Error(err).message;
//   }
// };

// checkProds();

import { client } from './src/server.js';

export const retreiveHashItems = async (client, key) => {
  const fields = await client.hget(key, 'id');
  return fields;
};

const result = retreiveHashItems(client, 'offers').then((response) => console.log('This is here', response));

