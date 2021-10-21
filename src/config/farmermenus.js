/* eslint-disable import/extensions */
/* eslint import/no-cycle: [2, { maxDepth: 1 }] */

import { getLocations, getRegions } from '../core/listlocations.js';
import { menus } from './menuoptions.js';
import { client } from '../server.js';
import { addLocation, checkFarmerVerification } from '../core/usermanagement.js';
import { retreiveCachedItems } from '../core/services.js';
import {
  fetchCategories, fetchProducts, getSpecificProduct, addProduct,
} from '../core/productmanagement.js';
import {
  addFarm, addFarmerKYC, getAnswersPerQuestion, getFarmerMetricSections, getQuestionsPerSection,
} from '../core/farmmanagement.js';

const con = () => 'CON';
const end = () => 'END';
let message = '';
const questionanswers = {};
export const renderUpdateLocationMenu = (res, textValue, text) => {
  if (textValue === 3) {
    let menuPrompt = `${con()} ${menus.updateLocation[0]}`;
    const regions = getRegions();
    const output = regions.then((data) => data);
    output.then((list) => {
      menuPrompt += `${list.items}`;
      menuPrompt += menus.footer;
      message = menuPrompt;
      res.send(message);
    });
  } else if (textValue === 4) {
    let regionId = parseInt(text.split('*')[3], 10);
    regionId += 1;
    let menuPrompt = `${con()} ${menus.updateLocation[1]}`;
    const counties = getLocations('counties', regionId, 'county_name');
    const output = counties.then((data) => data);
    output.then((list) => {
      menuPrompt += `${list.items}`;

      client.set('usercountyIds', list.ids.toString());
      menuPrompt += menus.footer;
      message = menuPrompt;
      res.send(message);
    });
  } else if (textValue === 5) {
    const countyId = parseInt(text.split('*')[4], 10);

    retreiveCachedItems(client, ['usercountyIds'])
      .then((countyIds) => {
        let userCountySelection = countyIds[0].split(',')[countyId];
        userCountySelection = parseInt(userCountySelection, 10);
        const subcounties = getLocations('subcounties', userCountySelection, 'sub_county_name');
        subcounties.then((list) => {
          let menuPrompt = `${con()} ${menus.updateLocation[2]}`;
          menuPrompt += `${list.items}`;
          client.set('userSubcountyIds', list.ids.toString());
          menuPrompt += menus.footer;
          message = menuPrompt;
          res.send(message);
        });
      });
  } else if (textValue === 6) {
    const subcountyId = parseInt(text.split('*')[5], 10);
    retreiveCachedItems(client, ['userSubcountyIds'])
      .then((subcountyIds) => {
        let userSubcountySelection = subcountyIds[0].split(',')[subcountyId];
        userSubcountySelection = parseInt(userSubcountySelection, 10);
        client.set('userSubCountySelection', userSubcountySelection);
        const locations = getLocations('locations', userSubcountySelection, 'location_name');
        locations.then((list) => {
          let menuPrompt = `${con()} ${menus.updateLocation[3]}`;
          menuPrompt += `${list.items}`;
          client.set('userLocationIds', list.ids.toString());
          menuPrompt += menus.footer;
          message = menuPrompt;
          res.send(message);
        });
      });
  } else if (textValue === 7) {
    const locationId = parseInt(text.split('*')[6], 10);
    retreiveCachedItems(client, ['userLocationIds'])
      .then((locationIds) => {
        let userLocationSelection = locationIds[0].split(',')[locationId];
        userLocationSelection = parseInt(userLocationSelection, 10);
        client.set('userLocationSelection', userLocationSelection);
        let menuPrompt = `${con()} ${menus.updateLocation[4]}`;
        menuPrompt += menus.footer;
        message = menuPrompt;
        res.send(message);
      });
  } else {
    client.set('userArea', text.split('*')[7]);
    retreiveCachedItems(client, ['userSubCountySelection', 'userLocationSelection', 'userArea', 'user_id'])
      .then((postLocationDetails) => {
        const postDetails = {
          sub_county_id: postLocationDetails[0],
          location_id: postLocationDetails[1],
          area: postLocationDetails[2],
        };
        const userId = parseInt(postLocationDetails[3], 10);
        addLocation(postDetails, userId).then((response) => {
          console.log('Add location response', response);
          if (response.status === 201) {
            const menuPrompt = `${end()} ${menus.updateLocation.success}`;
            message = menuPrompt;
            res.send(message);
          } else {
            message = 'CON Could not update location, try again later';
            message += menus.footer;
            res.send(message);
          }
        });
      });
  }
};
export const renderAddFarmDetailsMenu = (res, textValue, text) => {
  // TODO: Add a check for KYC
  if (textValue === 3) {
    let menuPrompt = `${con()} ${menus.addfarmDetails[0]}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
    res.send(message);
  } else if (textValue === 4) {
    let menuPrompt = `${con()} ${menus.addfarmDetails[1]}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
    client.set('farm_name', text.split('*')[3]);
    res.send(message);
  } else if (textValue === 5) {
    client.set('farm_location', text.split('*')[4]);

    const categories = fetchCategories();
    categories.then((data) => {
      let menuPrompt = `${con()} ${menus.addfarmDetails[2]}`;
      menuPrompt += `${data}`;
      menuPrompt += menus.footer;
      message = menuPrompt;
      res.send(message);
    });
  } else if (textValue === 6) {
    const category = text.split('*')[5];
    const product = fetchProducts(category);
    product.then((data) => {
      let menuPrompt = `${con()} ${menus.addfarmDetails[3]}`;
      menuPrompt += `${data}`;
      menuPrompt += menus.footer;
      message = menuPrompt;
      res.send(message);
    });
  } else if (textValue === 7) {
    const productId = parseInt(text.split('*')[6], 10);
    client.set('productID', productId);
    let menuPrompt = `${con()} ${menus.addfarmDetails[4]}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
    res.send(message);
  } else {
    client.set('capacity', parseInt(text.split('*')[7], 10));
    retreiveCachedItems(client, ['farm_name', 'farm_location', 'productID', 'capacity', 'user_id'])
      .then((farmDetails) => {
        const postDetails = {
          farm_name: farmDetails[0],
          farm_location: farmDetails[1],
          product_id: farmDetails[2],
          capacity: farmDetails[3],
          user_id: farmDetails[4],
        };

        addFarm(postDetails).then((response) => {
          if (response.status === 200) {
            const menuPrompt = `${end()} ${menus.addfarmDetails.success}`;
            message = menuPrompt;
            client.set('farm_id', response.data.success.id);
            res.send(message);
          } else {
            const menuPrompt = `${end()} ${menus.addfarmDetails.failure}`;
            message = menuPrompt;
            res.send(message);
          }
        });
      });
  }
};

export const renderFarmerUpdateDetailsMenu = (res, textValue, text) => {
  if (textValue === 3) {
    getFarmerMetricSections().then((response) => {
      if (response.status === 200) {
        let menuPrompt = '';
        response.data.forEach((section) => {
          menuPrompt += `\n${section.id}. ${section.section_name}`;
        });
        message = `${con()} Choose a section to fill`;
        message += menuPrompt;
        message += menus.footer;
        res.send(message);
      } else {
        message = `${end()} Could not fetch sections at the moment, try later`;
        res.send(message);
      }
    });
  } else if (textValue === 4) {
    const sectionId = parseInt(text.split('*')[3], 10);
    console.log(sectionId);
    client.set('sectionId', sectionId);
    getQuestionsPerSection(sectionId).then((response) => {
      if (response.status === 200) {
        let menuPrompt = '';
        response.data.forEach((question) => {
          menuPrompt += `\n${question.id}. ${question.metric_name}`;
        });
        message = `${con()} Choose a question to fill`;
        message += menuPrompt;
        message += menus.footer;
        res.send(message);
      } else {
        message = `${end()} Could not fetch questions at the moment, try later`;
        res.send(message);
      }
    });
  } else if (textValue === 5) {
    const questionId = parseInt(text.split('*')[4], 10);
    client.set('questionId', questionId);
    getAnswersPerQuestion(questionId).then((response) => {
      if (response.status === 200) {
        let menuPrompt = '';

        response.data[0].kyc_metrics_possible_answers.forEach((answer) => {
          menuPrompt += `\n${answer.id}. ${answer.possible_answer}`;
          questionanswers[answer.id] = answer.possible_answer;
          questionanswers.question_id = answer.question_id;
        });
        console.log('Question and answers object', questionanswers);
        message = `${con()} Select any of the following separated by a space`;
        message += menuPrompt;
        message += '\n0. Other';
        message += menus.footer;
        res.send(message);
      } else {
        message = `${end()} Could not fetch answers at the moment, try later`;
        res.send(message);
      }
    });
  } else if (textValue === 6) {
    const userAnswers = text.split('*')[5];
    if (userAnswers === '0') {
      message = `${con()} Type in your answer`;
      res.send(message);
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
      res.send(message);
    }
  } else if (textValue === 7) {
    if (text.split('*')[5] === '0') {
      const customAnswer = text.split('*')[6];
      client.set('answers', customAnswer);
    }
    retreiveCachedItems(client, ['user_id', 'answers', 'questionId'])
      .then((results) => {
        const kycInfo = {
          metric_id: results[2],
          answer: results[1],
        };
        addFarmerKYC(kycInfo, results[0]).then((response) => {
          if (response.status === 200) {
            message = `${end()} Thank you for your submission`;
            res.send(message);
          } else {
            message = 'CON Something went wrong!!!';
            res.send(message);
          }
        });
      });
  }
};

export const renderFarmerAddProductMenu = (res, textValue, text) => {
  if (checkFarmerVerification === true) {
    retreiveCachedItems(client, ['productID'])
      .then((result) => {
        const productID = result[0];
        getSpecificProduct(productID)
          .then((response) => {
            let menuPrompt = `${con()} ${menus.addProduct[0]} ${response.data[0].product_name}`;
            menuPrompt += menus.footer;
            message = menuPrompt;
            res.send(message);
          });
        if (textValue === 4) {
          console.log('Am I executed?', text.split('*')[3]);
          client.set('units', parseInt(text.split('*')[3], 10));
          let menuPrompt = `${con()} ${menus.addProduct[1]}`;
          menuPrompt += menus.footer;
          message = menuPrompt;
          res.send(message);
        } else if (textValue === 5) {
          let grade;
          if (text.split('*')[4] === '1') {
            grade = 'A';
            client.set('grade', grade);
          } else if (text.split('*')[4] === '2') {
            grade = 'B';
            client.set('grade', grade);
          } else if (text.split('*')[4] === '3') {
            grade = 'C';
            client.set('grade', grade);
          } else if (text.split('*')[4] === '4') {
            grade = 'D';
            client.set('grade', grade);
          } else if (text.split('*')[4] === '5') {
            grade = 'E';
            client.set('grade', grade);
          } else {
            message = 'Invalid grade';
            message += menus.footer;
            res.send(message);
          }
        }
      });

    retreiveCachedItems(client, ['farm_id', 'productID', 'units', 'grade'])
      .then((result) => {
        const postDetails = {
          farm_id: result[0],
          product_id: result[1],
          units: result[2],
          grade: result[3],
        };
        addProduct(postDetails).then((response) => {
          if (response.status === 200) {
            const menuPrompt = `${end()} ${menus.addProduct.success}`;
            message = menuPrompt;
          } else {
            const menuPrompt = `${end()} ${menus.addProduct.failure}`;
            message = menuPrompt;
          }
          res.send(message);
        });
      });
  } else {
    message = 'CON Cannot add product please update your farmer details';
    message += menus.footer;
    res.send(message);
  }
};