/* eslint-disable import/extensions */
/* eslint import/no-cycle: [2, { maxDepth: 1 }] */
import { menus } from './menuoptions.js';
import { client } from '../server.js';
import { addLocation } from '../core/usermanagement.js';
import { retreiveCachedItems, setToCache } from '../core/services.js';
import {
  fetchCategories, fetchProducts, getSpecificProduct, addProduct,
} from '../core/productmanagement.js';
import {
  addFarm, addFarmerKYC, getAnswersPerQuestion, getFarmerMetricSections, getQuestionsPerSection,
} from '../core/farmmanagement.js';
import { responsePrompt } from './prompts.js';
import { promptToGive } from './farmerlocation.js';

const con = () => 'CON';
const end = () => 'END';

const questionanswers = {};

export const renderUpdateLocationMenu = async (textValue, text) => {
  let message;
  if (textValue === 2) {
    const menuPrompt = await promptToGive(client, 'region');
    message = menuPrompt;
  } else if (textValue === 3) {
    let regionId = parseInt(text.split('*')[2], 10);
    regionId += 1;
    const menuPrompt = await promptToGive(client, 'county', regionId);
    message = menuPrompt;
  } else if (textValue === 4) {
    const countyId = parseInt(text.split('*')[3], 10);
    const menuPrompt = await promptToGive(client, 'subcounty', countyId);
    message = menuPrompt;
  } else if (textValue === 5) {
    const subcountyId = parseInt(text.split('*')[4], 10);
    const menuPrompt = await promptToGive(client, 'location', subcountyId);
    message = menuPrompt;
  } else if (textValue === 6) {
    const menuPrompt = await promptToGive(client, 'area');
    message = menuPrompt;
  } else {
    client.set('userArea', text.split('*')[6]);

    const postLocationDetails = await retreiveCachedItems(client, ['userSubCountySelection', 'userLocationSelection', 'userArea', 'user_id']);
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
export const renderAddFarmDetailsMenu = async (textValue, text) => {
  let message;
  if (textValue === 2) {
    let menuPrompt = `${con()} ${menus.addfarmDetails[0]}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else if (textValue === 3) {
    let menuPrompt = `${con()} ${menus.addfarmDetails[1]}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
    client.set('farm_name', text.split('*')[2]);
  } else if (textValue === 4) {
    client.set('farm_location', text.split('*')[3]);
    const categories = await fetchCategories();
    console.log(categories);
    let menuPrompt = `${con()} ${menus.addfarmDetails[2]}`;
    menuPrompt += categories;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else if (textValue === 5) {
    const category = parseInt(text.split('*')[4], 10);
    const product = await fetchProducts(category);
    let menuPrompt = `${con()} ${menus.addfarmDetails[3]}`;
    menuPrompt += `${product}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else if (textValue === 6) {
    const productId = parseInt(text.split('*')[5], 10);
    client.set('productID', productId);
    let menuPrompt = `${con()} ${menus.addfarmDetails[4]}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
    // res.send(message);
  } else {
    client.set('capacity', parseInt(text.split('*')[6], 10));
    const farmDetails = await retreiveCachedItems(client, ['farm_name', 'farm_location', 'productID', 'capacity', 'user_id']);
    const postDetails = {
      farm_name: farmDetails[0],
      farm_location: farmDetails[1],
      product_id: farmDetails[2],
      capacity: farmDetails[3],
      user_id: farmDetails[4],
    };
    const responseForAddingFarm = await addFarm(postDetails);

    if (responseForAddingFarm === 200) {
      const menuPrompt = `${end()} ${menus.addfarmDetails.success}`;
      message = menuPrompt;
      client.set('farm_id', responseForAddingFarm.data.success.id);
    } else {
      const menuPrompt = `${end()} ${responseForAddingFarm.data.response}`;
      message = menuPrompt;
    }
  }
  return message;
};

export const renderFarmerUpdateDetailsMenu = async (textValue, text) => {
  let message;
  if (textValue === 2) {
    const farmerMetrics = await getFarmerMetricSections();
    message = responsePrompt(farmerMetrics, 'sections');
  } else if (textValue === 3) {
    const sectionId = parseInt(text.split('*')[2], 10);
    console.log(sectionId);
    client.set('sectionId', sectionId);
    const questions = await getQuestionsPerSection(sectionId);
    message = responsePrompt(questions, 'questions');
  } else if (textValue === 4) {
    const questionId = parseInt(text.split('*')[3], 10);
    client.set('questionId', questionId);
    const answersPerQuestion = await getAnswersPerQuestion(questionId);
    if (answersPerQuestion.status === 200) {
      let menuPrompt = '';

      answersPerQuestion.data[0].kyc_metrics_possible_answers.forEach((answer) => {
        menuPrompt += `\n${answer.id}. ${answer.possible_answer}`;
        questionanswers[answer.id] = answer.possible_answer;
        questionanswers.question_id = answer.question_id;
      });
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
      console.log('User answers array', userAnswersArray);
      let answers = '';
      userAnswersArray.forEach((answer) => {
        const answerId = parseInt(answer, 10);
        answers += `${questionanswers[answerId]} `;
        console.log('Answers are displayed here', answers);
      });
      client.set('answers', answers);
      console.log('Answers are here', answers);
      message = `${con()} Proceed?\n 1. Yes`;
      // res.send(message);
    }
  } else if (textValue === 6) {
    if (text.split('*')[4] === '0') {
      setToCache(text, 4, client, 'answers');
    }

    const results = await retreiveCachedItems(client, ['user_id', 'answers', 'questionId']);
    console.log('Results of KYC', results);
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

export const renderFarmerAddProductMenu = async (textValue, text) => {
  let message = '';
  const items = await retreiveCachedItems(client, ['farm_id', 'productID', 'user_id']);
  const productID = parseInt(items[1], 10);
  const specificProduct = await getSpecificProduct(productID);
  message += `CON What quantity of \n ${specificProduct}`;
  if (textValue === 3) {
    const units = parseInt(text.split('*')[2], 10);
    client.set('units', units);
    const menuPrompt = 'CON How would you grade your produce?\n 1. Grade A \n 2. Grade B \n 3. Grade C \n 4.Grade D\n 5. Grade E';
    message = menuPrompt;
  } else if (textValue === 4) {
    console.log('Text value', textValue);
    let grade;
    const selection = text.split('*')[3];
    if (selection === '1') {
      grade = 'A';
      client.set('grade', grade);
    } else if (selection === '2') {
      grade = 'B';
      client.set('grade', grade);
    } else if (selection === '3') {
      grade = 'C';
      client.set('grade', grade);
    } else if (selection === '4') {
      grade = 'D';
      client.set('grade', grade);
    } else if (selection === '5') {
      grade = 'E';
      client.set('grade', grade);
    } else {
      message = 'Invalid grade';
      message += menus.footer;
    }
    const addProductDetails = await retreiveCachedItems(client, ['farm_id', 'productID', 'units', 'grade']);

    const addProductResponse = await addProductDetails;
    const postDetails = {
      farm_id: addProductResponse[0],
      product_id: addProductResponse[1],
      units: addProductResponse[2],
      grade: addProductResponse[3],
    };
    const addProductToDB = await addProduct(postDetails);
    if (addProductToDB.status === 200) {
      message = 'END Added successfully';
    } else {
      message = 'END Added failed';
    }
  }
  return message;
};