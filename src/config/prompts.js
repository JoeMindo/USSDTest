/* eslint-disable import/prefer-default-export */
import { menus } from './menuoptions';

export const promptToShow = (response, textToShow) => {
  let message = '';
  const con = () => 'CON';

  let menuPrompt = '';
  menuPrompt += response;
  if (textToShow === 'productcategories') {
    message = `${con()} Choose a category`;
    message += menuPrompt;
    message += menus.footer;
  } else if (textToShow === 'products') {
    message = `${con()} Choose a product`;
    message += menuPrompt;
    message += menus.footer;
  } else {
    message = `${con()} Choose a farm offering`;
    message += menuPrompt;
    message += menus.footer;
  }
  return message;
};