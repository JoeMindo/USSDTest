import {
  fetchCategories,
} from '../../products/productmanagement.js';
import { menus } from '../../menus/menuoptions.js';

let message = '';
const con = () => 'CON';
const end = () => 'END';

const centersMapping = {
  1: 'Center 1',
  2: 'Center 2',
  3: 'Center 4',
};

export const priceToUse = (availablePriceType, choice) => {
  let status;
  if (
    (availablePriceType === 'both' && choice === '1')
    || availablePriceType === 'unit'
  ) {
    status = 'unit';
  } else if (
    (availablePriceType === 'both' && choice === '2')
    || availablePriceType === 'group'
  ) {
    status = 'group';
  }

  return status;
};

export const renderProductCategories = async () => {
  try {
    const response = await fetchCategories();

    if (response) {
      message = `${con()} Choose a category\n ${response}`;
    } else {
      message = `${end()} Could not fetch categories at the moment, try later`;
    }
    return message;
  } catch (err) {
    throw new Error(err);
  }
};

export const askForQuantity = () => {
  message = `${con()} Enter quantity you want to buy\n`;
  message += menus.footer;
  return message;
};
// Array of offers should be cached

export const chooseCenter = (administrativeID) => {
  let message = `${con()} Choose a place where you will pick your goods\n`;
  const center = centersMapping[`${administrativeID}`];
  message += `1. ${center}`;
  return message;
};
