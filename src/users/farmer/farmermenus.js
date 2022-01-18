/* eslint-disable import/extensions */
/* eslint import/no-cycle: [2, { maxDepth: 1 }] */
import { menus } from '../../menus/menuoptions.js';
import client from '../../server.js';
import { addLocation } from '../../core/usermanagement.js';
import { retreiveCachedItems, setToCache } from '../../core/services.js';
import {

  fetchCategories,
  fetchProducts,
  addProduct,
  productsInFarm,
  updateListedProduct,
} from '../../products/productmanagement.js';
import {
  addFarm,
  addFarmerKYC,
  getAnswersPerQuestion,
  getFarmerMetricSections,
  getQuestionsPerSection,
  getUserFarms,
} from './farmmanagement.js';
import { responsePrompt } from '../../menus/prompts.js';
import { promptToGive } from './farmerlocation.js';

const con = () => 'CON';
const end = () => 'END';
export const isTextOnly = (str) => /^[a-zA-Z]+$/.test(str);

const questionanswers = {};

/**
 * This function is used to update the user's location.
 */
export const renderUpdateLocationMenu = async (textValue, text) => {
  let message;
  if (textValue === 1) {
    const menuPrompt = await promptToGive(client, 'region');
    message = menuPrompt;
  } else if (textValue === 2) {
    const regionId = parseInt(text.split('*')[1], 10);
    const menuPrompt = await promptToGive(client, 'county', regionId);
    message = menuPrompt;
  } else if (textValue === 3) {
    const countyId = parseInt(text.split('*')[2], 10);
    const menuPrompt = await promptToGive(client, 'subcounty', countyId);
    message = menuPrompt;
  } else if (textValue === 4) {
    const subcountyId = parseInt(text.split('*')[3], 10);
    const menuPrompt = await promptToGive(client, 'location', subcountyId);
    message = menuPrompt;
  } else if (textValue === 5) {
    const menuPrompt = await promptToGive(client, 'area');
    message = menuPrompt;
  } else {
    client.set('userArea', text.split('*')[5]);

    const postLocationDetails = await retreiveCachedItems(client, [
      'userSubCountySelection',
      'userLocationSelection',
      'userArea',
      'user_id',
    ]);
    const postDetails = {
      sub_county_id: postLocationDetails[0],
      location_id: postLocationDetails[1],
      area: postLocationDetails[2],
    };

    const userId = parseInt(postLocationDetails[3], 10);
    const response = await addLocation(postDetails, userId);

    if (response.status === 201) {
      const menuPrompt = `${end()} ${menus.updateLocation.success}`;
      message = menuPrompt;
    } else {
      message = 'CON Could not update location, try again later';
      message += menus.footer;
    }
  }
  return message;
};
/**
 * This function is used to render the menu for adding farm details.
 */
export const renderAddFarmDetailsMenu = async (textValue, text) => {
  let message;
  if (textValue === 1) {
    let menuPrompt = `${con()} ${menus.addfarmDetails[0]}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else if (textValue === 2) {
    if (isTextOnly(text.split('*')[1]) === true) {
      let menuPrompt = `${con()} ${menus.addfarmDetails[1]}`;
      menuPrompt += menus.footer;
      message = menuPrompt;
      client.set('farm_name', text.split('*')[1]);
    } else {
      message = 'CON Invalid input, try again';
    }
  } else if (textValue === 3) {
    let menuPrompt = `${con()} ${menus.addfarmDetails[4]}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else if (textValue === 4) {
    client.set('farm_size', parseInt(text.split('*')[2], 10));
    const farmDetails = await retreiveCachedItems(client, [
      'farm_name',
      'farm_location',
      'farm_description',
      'farm_size',
      'user_id',
    ]);
    const postDetails = {
      farm_name: farmDetails[0],
      farm_location: farmDetails[1],
      farm_description: 'Null',
      farm_size: farmDetails[3],
      user_id: farmDetails[4],
    };
    const responseForAddingFarm = await addFarm(postDetails);
    console.log('Respinse', responseForAddingFarm);

    if (responseForAddingFarm.status === 200) {
      const menuPrompt = `${end()} ${menus.addfarmDetails.success}`;
      message = menuPrompt;
      client.set('farm_id', responseForAddingFarm.data.farm_id);
    } else {
      const menuPrompt = `${end()} ${menus.addfarmDetails.failure}`;
      message = menuPrompt;
    }
  }
  return message;
};

/**
 * This function is used to update the user's details.(KYC)
 * The above code is a function that takes in a text value and text and returns a message.
 */
export const renderFarmerUpdateDetailsMenu = async (textValue, text) => {
  let message;
  if (textValue === 1) {
    const farmerMetrics = await getFarmerMetricSections();
    message = responsePrompt(farmerMetrics, 'sections');
  } else if (textValue === 2) {
    const sectionId = parseInt(text.split('*')[1], 10);

    client.set('sectionId', sectionId);
    const questions = await getQuestionsPerSection(sectionId);
    message = responsePrompt(questions, 'questions');
  } else if (textValue === 3) {
    const questionId = parseInt(text.split('*')[2], 10);
    client.set('questionId', questionId);
    const answersPerQuestion = await getAnswersPerQuestion(questionId);

    if (answersPerQuestion.status === 200) {
      let menuPrompt = '';

      answersPerQuestion.data.message[0].kyc_metrics_possible_answers.forEach(
        (answer) => {
          menuPrompt += `\n${answer.id}. ${answer.possible_answer}`;
          questionanswers[answer.id] = answer.possible_answer;
          questionanswers.question_id = answer.question_id;
        },
      );
      message = `${con()} Select any of the following separated by a space`;
      message += menuPrompt;
      message += '\n0. Other';
      message += menus.footer;
    } else {
      message = `${end()} Could not fetch answers at the moment, try later`;
    }
  } else if (textValue === 5) {
    const userAnswers = text.split('*')[4];
    if (userAnswers === '0') {
      message = `${con()} Type in your answer`;
      // res.send(message);
    } else {
      const userAnswersArray = userAnswers.split(' ');

      let answers = '';
      userAnswersArray.forEach((answer) => {
        const answerId = parseInt(answer, 10);
        answers += `${questionanswers[`${answerId}`]} `;
      });
      client.set('answers', answers);

      message = `${con()} Proceed?\n 1. Yes`;
    }
  } else if (textValue === 6) {
    if (text.split('*')[4] === '0') {
      setToCache(text, 4, client, 'answers');
    }

    const results = await retreiveCachedItems(client, [
      'user_id',
      'answers',
      'questionId',
    ]);

    const kycInfo = {
      metric_id: results[2],
      answer: results[1],
    };
    const updateKYC = await addFarmerKYC(kycInfo, results[0]);
    if (updateKYC.status === 200) {
      message = `${end()} Thank you for your submission`;
    } else {
      message = 'CON Something went wrong!!!';
    }
  }
  return message;
};

/**
 * This function is used to render the menu for adding a product to a farm
 * We have a function that takes in a text value and a text value and returns a message.
 */
export const renderFarmerAddProductMenu = async (textValue, text) => {
  let message = '';
  const items = await retreiveCachedItems(client, ['user_id']);
  const userID = parseInt(items[0], 10);
  const hasFarms = await getUserFarms(userID);
  if (hasFarms.status === 404) {
    message = 'CON Please register a farm first';
  } else if (hasFarms.status === 200) {
    let farmList = '';
    hasFarms.data.message.data.forEach((farm) => {
      farmList += `\n${farm.id}. ${farm.farm_name}`;
    });
    message = `CON Which farm do you want to add products to? ${farmList}`;
    if (textValue === 2) {
      client.set('farm_id', parseInt(text.split('*')[1], 10));
      const menuPrompt = `CON Select a category of items you want to add to your farm ${await fetchCategories()}`;
      message = menuPrompt;
    } else if (textValue === 3) {
      const categoryId = parseInt(text.split('*')[2], 10);
      client.set('category_id', categoryId);
      const products = await fetchProducts(categoryId);
      const menuPrompt = `CON Select a product you want to add to your farm \n ${products}`;
      message = menuPrompt;
    } else if (textValue === 4) {
      const productId = parseInt(text.split('*')[3], 10);
      client.set('product_id', productId);
      // TODO: This should be a dynamic prompt
      const menuPrompt = 'CON How many of bags this product do you have available for sale?';
      message = menuPrompt;
    } else if (textValue === 5) {
      const availableQuantity = parseInt(text.split('*')[4], 10);
      client.set('available_quantity', availableQuantity);
      const menuPrompt = 'CON For how much are you selling this item for per bag?';
      message = menuPrompt;
    } else if (textValue === 6) {
      const requestPrice = parseInt(text.split('*')[5], 10);
      client.set('price', requestPrice);
      // const menuPrompt = 'CON Is this item available for sale?\n 1. Yes\n 2. No';
      // message = menuPrompt;
      // TODO: Add product
      const productData = await retreiveCachedItems(client, [
        'farm_id',
        'product_id',
        'available_quantity',
      ]);
      const postProductDetails = {
        farm_id: productData[0],
        product_id: productData[1],
        capacity: productData[2],
      };
      const addingProduct = await addProduct(postProductDetails);
      if (addingProduct.status === 200) {
        message = `${end()} Produce added successfully`;
      } else {
        message = `${end()} ${addingProduct.data.message}`;
      }
    }
  }
  message += menus.footer;
  return message;
};

/**
 * This function renders the update listed produce menu.
 * @param userID - the user's ID
 * @returns None
 */
export const renderUpdateListedProduceMenu = async (textvalue, text) => {
  let userID = await retreiveCachedItems(client, ['user_id']);
  userID = parseInt(userID, 10);
  const hasFarms = await getUserFarms(userID);
  const userFarms = [];
  const productIDs = [];
  let message = '';
  if (hasFarms.status === 404) {
    message = 'CON Please register a farm first';
  } else if (hasFarms.status === 200) {
    let farmList = '';
    hasFarms.data.message.data.forEach((farm) => {
      userFarms.push(farm.id);
      farmList += `\n${farm.id}. ${farm.farm_name}`;
    });
    message = `CON Which farm do you want to update? ${farmList}`;
  }
  const farmID = parseInt(text.split('*')[1], 10);

  if (textvalue === 2 && userFarms.includes(farmID)) {
    const products = await productsInFarm(farmID);
    let productList = '';
    products.data.message.forEach((product) => {
      const combination = {
        id: product.id,
        prodID: product.product_id,
      };
      productIDs.push(combination);
      client.set('productIDs', JSON.stringify(productIDs));
      productList += `\n${product.id}. ${product.product_name}`;
    });
    message = `${con()} What product do you want to update the quantity ${productList}`;
  } else if (textvalue === 3) {
    message = `${con()} Enter the new quantity`;
  } else if (textvalue === 4) {
    const updatedQuantity = text.split('*')[3];
    const productID = parseInt(text.split('*')[2], 10);
    let retreivedIDs = await retreiveCachedItems(client, ['productIDs']);
    retreivedIDs = JSON.parse(retreivedIDs[0]);
    const productIdentity = retreivedIDs.find((product) => product.id === productID);
    const data = {
      farm_id: farmID,
      product_id: productIdentity.prodID,
      capacity: updatedQuantity,
    };

    const updatedProduce = await updateListedProduct(productID, data);
    if (updatedProduce.status === 200) {
      message = `${end()} Updated successfully`;
    } else {
      message = `${end()}${updatedProduce}`;
    }
  }
  return message;
};