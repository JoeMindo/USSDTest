/* eslint-disable prefer-destructuring */
import { retreiveCachedItems } from '../core/services.js';
import client from '../server.js';
import { con, end } from '../menus/rendermenu.js';
import { menus } from '../menus/menuoptions.js';
import makebasicOrder from '../orders/unitOrder.js';
import makePayment from '../payment/payment.js';

export const offersArray = [];
export const cartItems = [];
export const totalCost = {};
export const itemSelection = {};

let message;

export const askForNumber = () => {
  message = `${con()} Checkout using\n 1. This Number\n 2. Other number`;
  return message;
};
export const askForQuantity = () => {
  message = `${con()} Enter quantity you want to buy\n`;
  message += menus.footer;
  return message;
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

export const showCartItems = async (client) => {
  let prompt = '';
  let fetchCartItems = await retreiveCachedItems(client, ['cartItems']);
  fetchCartItems = JSON.parse(fetchCartItems);
  fetchCartItems.forEach((item) => {
    prompt += `${item.id}. ${item.product}, ${item.farmName}, ${item.grade} ${item.totalCost}\n`;
  });
  return prompt;
};
export const addToCart = async (client, itemsObject, totalPriceObject) => {
  if (itemsObject && totalPriceObject) {
    let existingItems = await retreiveCachedItems(client, ['cartItems']);
    client.exists('cartItems', (err, ok) => {
      if (err) throw err;
      if (ok === 0) {
        cartItems.push(itemsObject);

        client.set('cartItems', JSON.stringify(cartItems));
      } else if (ok === 1) {
        existingItems = JSON.parse(existingItems);
        // Check if item is already in cart
        const index = existingItems.findIndex(
          (item) => item.id === itemsObject.id,
        );

        if (index === -1) {
          existingItems.push(itemsObject);
          client.set('cartItems', JSON.stringify(existingItems));
        } else {
          const newTotal = existingItems[`${index}`].userQuantity
              * existingItems[`${index}`].unitPrice;
            // Increase quantity function
          existingItems[`${index}`].userQuantity += itemsObject.userQuantity;
          existingItems[`${index}`].totalCost = newTotal;
          client.set('cartItems', JSON.stringify(existingItems));
        }
      }
    });
    message = `${con()} Cart Items added successfully\n`;
    message += '1. Checkout\n';
    message += '67. View Cart';
  } else {
    message = `${con()} You have not selected any item to add to cart`;
  }
  message += menus.footer;
  return message;
};

export const confirmNewQuantity = (client, itemsObject, totalPriceObject) => {
  if (itemsObject && totalPriceObject) {
    cartItems.push(itemsObject);
    client.set('cartItems', JSON.stringify(cartItems));
    message = `${con()} Cart Items updated successfully\n`;
    message += '1. Checkout\n';
  } else {
    message = `${con()} You have not selected an item to update`;
  }
  message += menus.footer;
  return message;
};

export const updateType = async (type) => {
  if (type === 'remove') {
    message = `${con()} Select an item to remove\n`;
  } else {
    message = `${con()} Select an item to update\n`;
  }
  const cartItems = await showCartItems(client);

  message += cartItems;
  message += menus.footer;
  return message;
};
export const removeItemFromCart = async (id) => {
  try {
    let cartItems = await retreiveCachedItems(client, ['cartItems']);
    cartItems = JSON.parse(cartItems);

    cartItems.forEach((item) => {
      if (item.id === id) {
        const indexOfItem = cartItems.indexOf(item);
        cartItems.splice(indexOfItem, 1);
        client.set('cartItems', JSON.stringify(cartItems));
        message = `${con()} Item removed successfully\n`;
        message += '67. View cart';
        message += menus.footer;
      } else {
        message = `${con()} Item not found`;
      }
    });
    return message;
  } catch (error) {
    throw new Error(error);
  }
};

export const changeQuantity = async (client, amount, object, id) => {
  try {
    let cartItems = await retreiveCachedItems(client, ['cartItems']);
    cartItems = JSON.parse(cartItems);
    const newCartItems = [...cartItems];
    const oldObject = object;
    const indexToRemove = cartItems.findIndex((x) => x.id === id);
    newCartItems.splice(indexToRemove, 1);
    const newTotalCost = oldObject.unitPrice * parseInt(amount, 10);
    oldObject.totalCost = newTotalCost;
    oldObject.userQuantity = parseInt(amount, 10);
    newCartItems.push(oldObject);

    client.set('cartItems', JSON.stringify(newCartItems));
    message = `${end()} Updated successfully`;
    return message;
  } catch (err) {
    throw new Error(err);
  }
};
export const findItemToChangeQuantity = async (client, id) => {
  let itemToUpdate;
  try {
    let cartItems = await retreiveCachedItems(client, ['cartItems']);
    cartItems = JSON.parse(cartItems);
    cartItems.forEach((item) => {
      if (item.id === id) {
        itemToUpdate = item;
        message = `${con()} What is the quantity you want?`;
      } else {
        message = `${con()} Item not found\n`;
      }
    });
    return {
      message,
      itemToUpdate,
    };
  } catch (err) {
    throw new Error(err);
  }
};

export const displayTotalCost = async (client) => {
  try {
    const chargeToUser = await retreiveCachedItems(client, ['totalCost']);
    message = `${con()} Proceed to pay KES ${chargeToUser}\n 1. Yes`;
    message += menus.footer;
  } catch (error) {
    throw new Error(error);
  }
  return message;
};

export const updateRequest = (request) => {
  const array = request.body.text.split('*');
  array.splice(2, array.length);
  request.text = array.join('*');
  return request;
};
export const displayCartItems = async (client) => {
  try {
    let prompt = '';
    let fetchCartItems = await retreiveCachedItems(client, ['cartItems']);

    if (fetchCartItems.length > 0 && fetchCartItems[0] !== null) {
      fetchCartItems = JSON.parse(fetchCartItems);
      fetchCartItems.forEach((item) => {
        prompt += `${item.id}. ${item.product} from ${item.farmName} grade: ${item.grade}  at KES ${item.totalCost}\n`;
      });
      const availableTotal = fetchCartItems.reduce(
        (total, obj) => obj.totalCost + total,
        0,
      );
      message = `${con()} Your cart items are\n ${prompt} Total ${availableTotal}\n 1. Checkout\n 2. Update Cart`;
    } else if (fetchCartItems[0] === null) {
      message = `${con()} You have no items at the moment\n Go home and add products`;
      message += menus.footer;
    }
    return message;
  } catch (error) {
    throw new Error(error);
  }
};
export const updateCart = async (operation, id = null) => {
  if (operation === 'firstscreen') {
    message = `${con()} Choose an operation\n 1. Remove Item\n 2. Change Item quantity`;
    message += menus.footer;
  } else if (operation === 'removeItem') {
    message = await removeItemFromCart(id);
  } else if (operation === 'updateItemCount') {
    message = await findItemToChangeQuantity(id);
  } else {
    message = `${end()} Selection not found`;
  }
  return message;
};

/*
1. Level 0: Display all the cart items
2. Level 1: Choose between checkout and update cart
3. Level 2: If update cart choose remove or update count
4. Level 3: Remove item or update quantity
5. Level 4: Check quantity if matches
6. level 5: If checkout then ask for details and make order
*/

export const cartOperations = async (
  text,
  menuLevel,
  level,
  itemId = null,
  index = null,
) => {
  let selection;
  if (menuLevel === 'inner') {
    selection = text.split('*')[8];
  } else if (menuLevel === 'outer') {
    selection = text.split('*')[2];
  }

  if (level === 0) {
    message = await displayCartItems(client);
  } else if (
    (selection === '1' && level === 1)
      || (text.split('*')[8] === '1' && level === 1)
  ) {
    message = askForNumber();
  } else if (selection === '2' && level === 1) {
    message = updateCart('firstscreen');
  } else if (level === 2) {
    message = await updateType('remove');
  } else if (level === 3) {
    message = await updateType('updateItemCount');
  } else if (level === 4) {
    message = await removeItemFromCart(itemId);
  } else if (level === 5) {
    const response = await findItemToChangeQuantity(itemId);
    message = response.message;
  } else if (level === 6) {
    const response = await findItemToChangeQuantity(itemId);
    const item = response.itemToUpdate;
    message = changeQuantity(index, item, itemId);
  } else if (level === 7) {
    message = confirmNewQuantity(client, itemSelection, totalCost);
  } else if (level === 8) {
    const products = [];
    const details = await retreiveCachedItems(client, ['user_id', 'cartItems']);
    const cartItems = JSON.parse(details[1]);
    cartItems.forEach((item) => {
      const pickedFields = (({
        // eslint-disable-next-line camelcase
        id, product_id, userQuantity, totalCost,
      }) => ({
        id,
        product_id,
        userQuantity,
        totalCost,
      }))(item);
      const cartSelections = {
        id: pickedFields.id,
        product_id: pickedFields.product_id,
        units: pickedFields.userQuantity,
        amount: pickedFields.totalCost,
      };
      products.push(cartSelections);
    });

    const cartSelections = {
      centre_id: 5,
      user_id: parseInt(details[0], 10),
      products,
      order_priority: 'medium',
    };

    const response = await makebasicOrder(cartSelections);

    if (response.status === 200) {
      client.del('cartItems');
      message = `${end()} ${response.data.message}`;
    } else if (response === 'Error') {
      message = `${end()} Similar order exists for this user`;
    }
  } else if (level === 9) {
    message = makePayment();
  }
  return message;
};

export default cartOperations;