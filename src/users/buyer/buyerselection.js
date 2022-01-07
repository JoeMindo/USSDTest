/* eslint-disable import/no-cycle */
import { renderBuyerMenus, con } from '../../menus/rendermenu.js';
import * as groupOrderMenus from '../../orders/groupOrder.js';
import { showAvailableProducts } from '../../products/renderProducts.js';
import { retreiveCachedItems } from '../../core/services.js';
import client from '../../server.js';
import { cartOperations } from '../../cart/cartoperations.js';
import { menus } from '../../menus/menuoptions.js';

let message;

const checkBuyerSelection = async (textValue, text) => {
  if (textValue === 1 && text === '') {
    message = renderBuyerMenus();
  } else {
    const selection = text.split('*')[0];
    if (selection === '1') {
      message = await showAvailableProducts(client, textValue, text);
    } else if (selection === '2' && textValue === 1) {
      if (textValue === 2) {
        message = await cartOperations(text, 'outer', 0);
      } else if (textValue === 3 && text.split('*')[2] === '1') {
        message = await cartOperations(text, 'outer', 1);
      } else if (textValue === 3 && text.split('*')[2] === '2') {
        message = await cartOperations(text, 'outer', 1);
      } else if (textValue === 4 && text.split('*')[2] === '1' && text.split('*')[3] === '1') {
        message = await cartOperations(text, 'outer', 8);
      } else if (textValue === 4 && text.split('*')[3] === '1') {
        message = await cartOperations(text, 'outer', 2);
      } else if (textValue === 4 && text.split('*')[3] === '2') {
        message = await cartOperations(text, 'outer', 3);
      } else if (textValue === 5 && text.split('*')[2] === '1' && text.split('*')[3] === '1') {
        // TODO: Make payment
        message = await cartOperations(text, 'outer', 9);
      } else if (textValue === 5 && text.split('*')[3] === '1') {
        const id = parseInt(text.split('*')[4], 10);
        message = await cartOperations(text, 'outer', 4, id);
      } else if (textValue === 5 && text.split('*')[3] === '2') {
        const id = parseInt(text.split('*')[4], 10);
        message = await cartOperations(text, 'outer', 5, id);
      } else if (textValue === 6 && text.split('*')[3] === '1' && text.split('*')[5] === '67') {
        message = await cartOperations(text, 'outer', 0);
      } else if (textValue === 6 && text.split('*')[3] === '2') {
        const id = parseInt(text.split('*')[4], 10);
        const newQuantity = parseInt(text.split('*')[5], 10);
        message = await cartOperations(text, 'outer', 6, id, newQuantity);
      } else if (textValue === 7 && text.split('*')[3] === '2') {
        const id = parseInt(text.split('*')[4], 10);
        message = await cartOperations(text, 'outer', 6, id);
      }
    } else if (selection === '3') {
      // let userId = await retreiveCachedItems(client, ['user_id']);
      // userId = parseInt(userId[0], 10);
      // TODO: Waiting for implementation
      // const result = await viewOrders(userId);
      message = `${con()} Order result here`;
      message += menus.footer;
    } else if (selection === '4') {
      // const status = await groupOrderMenus.checkIfUserIsInGroup();
      message = groupOrderMenus.actionToTake(false);
      if (textValue === 3) {
        message = groupOrderMenus.requestGroupName();
      } else if (textValue === 4) {
        let userId = await retreiveCachedItems(client, ['user_id']);
        // TODO: Use the userId in place of dean ID

        userId = parseInt(userId[0], 10);
        const groupData = {
          dean_id: userId,
          group_name: text.split('*')[3],
          group_type: 2,
          status: 1,
        };
        const response = await groupOrderMenus.createGroup(groupData);
        message = groupOrderMenus.groupCreationMessage(response);
      } else {
        message = await groupOrderMenus.groupPricedItems(textValue, text);
      }
    }
  }

  return message;
};

export default checkBuyerSelection;