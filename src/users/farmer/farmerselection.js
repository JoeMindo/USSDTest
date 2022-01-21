/* eslint-disable import/no-cycle */
import * as farmerMenus from './farmermenus.js';
import { renderFarmerMenus } from '../../menus/rendermenu.js';

const checkFarmerSelection = async (text, textValue) => {
  let message;
  if (textValue === 1 && text === '') {
    message = renderFarmerMenus();
  } else if (text !== '') {
    const selection = text.split('*')[0];
    if (selection === '1') {
      message = await farmerMenus.renderUpdateLocationMenu(textValue, text);
    } else if (selection === '2') {
      message = await farmerMenus.renderAddFarmDetailsMenu(textValue, text);
    } else if (selection === '3') {
      message = farmerMenus.renderFarmerAddProductMenu(textValue, text);
    } else if (selection === '4') {
      message = farmerMenus.renderFarmerUpdateDetailsMenu(textValue, text);
    } else if (selection === '5') {
      message = farmerMenus.renderUpdateListedProduceMenu(textValue, text);
    } else if (selection === '98') {
      message = farmerMenus.secondLevelMenu(textValue, text);
    } else {
      message = 'CON Invalid choice, try again';
    }
  }
  return message;
};

export default checkFarmerSelection;
