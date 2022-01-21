/* eslint-disable import/extensions */
/* eslint-disable import/prefer-default-export */
import { menus } from './menuoptions.js';

const con = () => 'CON';
const end = () => 'END';

/**
 * It takes in a response and a textToShow and returns a message.
 * @param response - the response object from the user
 * @param textToShow - the text to show in the menu
 * @returns The message to be sent to the user.
 */
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

/**
 * It takes a response object and a section string as arguments.
 * If the response status is 200 and the section is 'sections', it loops through the response data
and prints out the section id and section name.
 * If the response status is 200 and the section is 'questions', it loops through the response data
and prints out the question id and question name.
 * Otherwise, it prints out a message saying that something went wrong.
 * @param response - the response object from the API call
 * @param section - 'sections' or 'questions'
 * @returns The response from the server.
 */
export const responsePrompt = (response, section) => {
  let message = '';
  let menuPrompt = 'CON ';

  if (response.status === 200 && section === 'sections') {
    response.data.message.forEach((item) => {
      menuPrompt += `${item.id}. ${item.section_name}\n`;
    });
    message = promptToShow(menuPrompt, 'kycsections');
  } else if (response.status === 200 && section === 'questions') {
    response.data.message.forEach((item) => {
      menuPrompt += `${item.id}. ${item.metric_name}\n`;
    });
    message = promptToShow(menuPrompt, 'kycmetrics');
  } else {
    message = `${end()} Something went wrong, try again later`;
  }
  return message;
};
