import axios from 'axios';
import { BASEURL } from '../core/urls';

const makebasicOrder = async (cartSelections) => {
  try {
    const makeOrderRequest = await axios.post(`${BASEURL}/api/savebasicorder`, cartSelections);

    if (makeOrderRequest.status === 200) {
      return makeOrderRequest;
    }
    return false;
  } catch (err) {
    return 'Error';
  }
};

export default makebasicOrder;