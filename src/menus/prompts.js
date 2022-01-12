/* eslint-disable import/extensions */
/* eslint-disable import/prefer-default-export */
import { menus } from './menuoptions.js';

const con = () => 'CON';
const end = () => 'END';

export const promptToShow = (response, textToShow) => {
  let message = '';
  let menuPrompt = '';
  menuPrompt += response;
  if (textToShow === 'productcategories') {
    message = `${con()} Choose a category`;
    message += menuPrompt;
    message += menus.footer;
  } else if (textToShow === 'products') {
    message = `${con()} Choose a product\n`;
    message += menuPrompt;
    message += menus.footer;
  } else if (textToShow === 'kycsections') {
    message = `${con()} Choose a section to fill`;
    message = menuPrompt;
    message += menus.footer;
  } else if (textToShow === 'kycmetrics') {
    message = `${con()} Choose a question to answer`;
    message = menuPrompt;
    message += menus.footer;
  } else {
    message = `${con()} Choose a farm offering\n`;
    message += menuPrompt;
    message += menus.footer;
  }
  return message;
};

export const responsePrompt = (response, section) => {
  let message = '';
  let menuPrompt = 'CON ';

  if (response.status === 200 && section === 'sections') {
    response.data.forEach((item) => {
      menuPrompt += `${item.id}. ${item.section_name}\n`;
    });
    message = promptToShow(menuPrompt, 'kycsections');
  } else if (response.status === 200 && section === 'questions') {
    response.data.forEach((item) => {
      menuPrompt += `${item.id}. ${item.metric_name}\n`;
    });
    message = promptToShow(menuPrompt, 'kycmetrics');
  } else {
    message = `${end()} Something went wrong, try again later`;
  }
  return message;
};
