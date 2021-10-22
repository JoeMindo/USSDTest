/* eslint-disable consistent-return */
import axios from 'axios';
import jwt from 'jsonwebtoken';

const createToken = async (payload) => {
  try {
    const token = await jwt.sign(payload, 'this is secret');
    return token;
  } catch (error) {
    throw new Error(error);
  }
};
export const postrequest = async (
  params,
  endpoint,
  fcmtoken = null,
) => {
  let token = createToken(params).then((result) => result);
  try {
    if (fcmtoken) {
      token = fcmtoken;
    }
    if (token) {
      const response = await axios.post(endpoint, params, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response;
    }
    const response = await axios.post(endpoint, params, { headers: {} });
    return response;
  } catch (error) {
    return error;
  }
};

export const retreiveCachedItems = (client, fields = []) => {
  const resultFields = [];
  fields.forEach((key) => {
    const field = client.getAsync(key).then((reply) => reply);
    resultFields.push(field);
  });
  return Promise.all(resultFields);
};

export const setToCache = (text, index, client, key) => {
  const customAnswer = text.split('*')[index];
  client.set(key, customAnswer);
};