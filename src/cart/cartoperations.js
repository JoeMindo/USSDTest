/* eslint-disable import/no-cycle */
/* eslint-disable prefer-destructuring */
import { retreiveCachedItems } from '../core/services.js';
import client from '../server.js';
import { con, end } from '../menus/rendermenu.js';
import { menus } from '../menus/menuoptions.js';
import makebasicOrder from '../orders/unitOrder.js';
import makePayment from '../payment/payment.js';
import { itemSelection } from '../products/productmanagement.js';

export const offersArray = [];
export const cartItems = [];
export const totalCost = {};

let message;

/**
 * Ask the user for a number.
 * @returns The message variable.
 */
export const askForNumber = () => {
  message = `${con()} Checkout using\n 1. This Number\n 2. Other number`;
  return message;
};
/**
 * Ask the user for the quantity they want to buy.
 * @returns A string
 */
export const askForQuantity = () => {
  message = `${con()} Enter quantity you want to buy\n`;
  message += menus.footer;
  return message;
};
/**
 * If the price type is both, and the user chooses unit, then the status is unit. If the price type
is both, and the user chooses group, then the status is group. If the price type is unit, then the
status is unit. If the price type is group, then the status is group.
 * @param availablePriceType - the type of price that is available for the user to use
 * @param choice - the user's choice of price type
 * @returns The price type that is being used.
 */
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

/**
 * Show the cart items
 * @param client - The client object that is used to interact with the database.
 * @returns An array of objects.
 */
export const showCartItems = async (client) => {
  let prompt = '';
  let fetchCartItems = await retreiveCachedItems(client, ['cartItems']);
  fetchCartItems = JSON.parse(fetchCartItems);
  fetchCartItems.forEach((item) => {
    prompt += `${item.id}. ${item.product}, ${item.farmName}, ${item.grade} ${item.totalCost}\n`;
  });
  return prompt;
};

/**
 * If the cartItems key exists in the cache, then the function will retrieve the cartItems from the
cache and add the new item to the cartItems array. If the cartItems key does not exist in the cache,
then the function will create a new cartItems array and add the new item to the cartItems array.
 * @param client - The redis client object
 * @param itemsObject - {
 * @param totalPriceObject - {
 * @returns The message that is being returned
 */
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

/**
 * It takes in the client, itemsObject and totalPriceObject and adds them to the cartItems array.
 * @param client - The client object that is used to interact with the database.
 * @param itemsObject - The object that contains the item name, quantity, price, and total price
 * @param totalPriceObject - {
 * @returns The message that is being returned.
 */
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

/**
 * This function is used to update the cart.
 * @param type - The type of update to perform. Can be 'add' or 'remove'.
 * @returns The message that is being returned.
 */
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
/**
 * Removing Item from cart
 * @param id - The id of the item to be removed from the cart
 * @returns The cart items
 */
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

/**
 * This function will remove an item from the cart and update the total cost of the cart.
 * @param client - The redis client
 * @param amount - The amount of the item to be added to the cart
 * @param object - The object that is being updated
 * @param id - The id of the item to be updated
 * @returns A string
 */
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

/**
 * Find the item in the cart that matches the id provided and return the item.
 * @param client - The client object that you can use to interact with the cache.
 * @param id - The id of the item you want to update
 * @returns {
 *   message: '',
 *   itemToUpdate: {
 *     id: '',
 *     name: '',
 *     price: '',
 *     quantity: '',
 *   },
 * }
 */
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
    return err;
  }
};

/**
 * It retrieves the total cost of the items in the cart and displays it to the user.
 * @param client - The client object that is used to interact with the user
 * @returns The total cost of the items in the cart
 */
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

/**
 * Cannot generate summary
 * @param request - the request object
 * @returns The request object.
 */
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
    selection = text.split('*')[1];
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
    const response = await findItemToChangeQuantity(client, itemId);
    message = response.message;
  } else if (level === 6) {
    const response = await findItemToChangeQuantity(client, itemId);
    const item = response.itemToUpdate;
    message = changeQuantity(client, index, item, itemId);
  } else if (level === 7) {
    message = confirmNewQuantity(client, itemSelection, totalCost);
  } else if (level === 8) {
    const products = [];
    const details = await retreiveCachedItems(client, ['user_id', 'cartItems']);
    const cartItems = JSON.parse(details[1]);
    cartItems.forEach((item) => {
      const pickedFields = (({

        id,
        // eslint-disable-next-line camelcase
        product_id,
        userQuantity,
        totalCost,
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
