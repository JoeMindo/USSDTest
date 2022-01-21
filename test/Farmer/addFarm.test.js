import { expect } from 'chai';
import nock from 'nock';
import { describe, it } from 'mocha';
import { BASEURL } from '../../src/core/urls.js';
import { farmSaveSuccess, farmSaveFailure } from './farmerResponses.js';
import { addFarm } from '../../src/users/farmer/farmmanagement.js';
import { isTextOnly } from '../../src/users/farmer/farmermenus.js';

describe('Add farm', () => {
  beforeEach(() => {
    nock(`${BASEURL}`).post('/ussd/farm/save').reply(200, farmSaveSuccess);
    nock(`${BASEURL}`).post('/ussd/farm/save').reply(400, farmSaveFailure);
  });
  const farmDetails = {
    farm_name: 'Test Farm',
    farm_location: 'Local',
    product_id: 23,
    capacity: 154,
    user_id: 8,
  };
  it('should return a success message if farm is added successfully', async () => {
    const response = await addFarm(farmDetails);
    expect(response.status).to.equal(200);
    expect(response.data.status).to.equal('success');
  });
  it('should raise error if not able to save ', async () => {
    const response = await addFarm(farmDetails);
    expect(response.status).to.equal(400);
  });
  it('should not accept digits in any of the names', () => {
    const result = isTextOnly('TestFarm123');
    expect(result).to.equal(false);
  });
});
