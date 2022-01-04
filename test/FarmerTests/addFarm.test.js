import { expect } from 'chai';
import nock from 'nock';
import { describe, it } from 'mocha';
import { BASEURL } from '../../src/core/urls.js';
import { farmSaveSuccess, farmSaveFailure } from './farmerResponses.js';
import { addFarm } from '../../src/users/farmer/farmmanagement.js';

describe('Add farm', () => {
  beforeEach(() => {
    nock(`${BASEURL}`)
      .post('/api/farm/save')
      .reply(200, farmSaveSuccess);
    nock(`${BASEURL}`)
      .post('/api/farm/save')
      .reply(400, farmSaveFailure);
  });
  it('should return a success message if farm is added successfully', async () => {
    const farmDetails = {
      farm_name: 'Test Farm',
      farm_location: 'Local',
      product_id: 23,
      capacity: 154,
      user_id: 8,
    };
    const response = await addFarm(farmDetails);
    expect(response.status).to.equal(200);
    expect(response.data.status).to.equal('success');
  });
  it('should raise error if not able to save ', async () => {
    const farmDetails = {
      farm_name: 'Test Farm',
      farm_location: 'Local',
      product_id: 23,
      capacity: 154,
      user_id: 8,
    };
    const response = await addFarm(farmDetails);
    expect(response.response.status).to.equal(400);
  });
  it('should inform the user if they enter non letters', async () => {
    const farmDetails = {
      farm_name: 'TestFarm',
      farm_location: 'Local',
      product_id: 23,
      capacity: 154,
      user_id: 8,
    };
    const response = await addFarm(farmDetails);
    expect(response.response.status).to.equal(400);
  });
});