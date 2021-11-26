import { text } from 'body-parser';
import { retreiveCachedItems } from '../core/services.js';
import { client } from '../server.js';

const test = async () => {
  const isPresent = await retreiveCachedItems(client, ['myOrders']);
  return isPresent;
};
const gotten = async () => {
  const isPresent = await test();
  return isPresent[0];
};
console.log(await gotten());

// eslint-disable-next-line import/prefer-default-export
