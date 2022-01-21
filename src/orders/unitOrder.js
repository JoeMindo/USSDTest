import axios from 'axios';
import { BASEURL } from '../core/urls.js';

/**
 * It takes in a cartSelections object and sends it to the server.
 * @param cartSelections - {
 * @returns The response from the server.
 */
const makebasicOrder = async (cartSelections) => {
  try {
    const makeOrderRequest = await axios.post(
      `${BASEURL}/ussd/savebasicorder`,
      cartSelections,
    );

    if (makeOrderRequest.status === 200) {
      return makeOrderRequest;
    }
    return false;
  } catch (err) {
    return 'Error';
  }
};

export default makebasicOrder;
