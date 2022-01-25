import { expect } from 'chai';
import nock from 'nock';
import { describe, it } from 'mocha';
import { BASEURL } from '../../src/core/urls.js';
import { getUserFarmsSuccess, userFarmsAreNil } from './farmerResponses.js';
import categoriesFound, {
  categoriesServerError,
} from './productcallResponses.js';
import { fetchCategories } from '../../src/products/productmanagement.js';
import { getUserFarms } from '../../src/users/farmer/farmmanagement.js';

describe('Add product', () => {
  beforeEach(() => {
    nock(`${BASEURL}`)
      .get('/ussd/farm/31')
      .reply(200, getUserFarmsSuccess);

    nock(`${BASEURL}`).get('/ussd/farm/4').reply(404, userFarmsAreNil);
    nock(`${BASEURL}`).get('/ussd/prodcategories').reply(200, categoriesFound);
    nock(`${BASEURL}`)
      .get('/ussd/prodcategories')
      .reply(500, categoriesServerError);
  });

  it('should fetch the farms belonging to a user based on the user ID', async () => {
    const response = await getUserFarms(31);
    expect(response.status).to.equal(200);
    expect(response.data.status).to.equal('success');
    expect(response.data.message.data[0].farm_name).to.equal('This farm');
    expect(response.data.message.data[0].user_id).to.equal(31);
  });

  it('should return an error if the user has no registered farms', async () => {
    await getUserFarms(4).catch((error) => {
      expect(error.response.status).to.equal(404);
      expect(error.response.data.status).to.equal('error');
      expect(error.response.data.message).to.equal(
        'User has no registered farms',
      );
    });
  });
  it('should get all the available categories', async () => {
    const response = await fetchCategories();
    expect(typeof response).to.equal('string');
  });
  it('should inform the user of a server error', async () => {
    await fetchCategories().catch((error) => {
      expect(error.response.status).to.equal(500);
      expect(error.response.data.data.message).to.equal('Server error');
    });
  });
});
