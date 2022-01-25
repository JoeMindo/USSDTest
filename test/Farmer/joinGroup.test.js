import { expect } from 'chai';
import nock from 'nock';
import { describe, it } from 'mocha';
import { BASEURL } from '../../src/core/urls.js';
import {
  availableGroups, location, locationNotFound, joinGroupOk, userAlreadyInGroup,
} from './farmerResponses.js';
import { getLocationID, joinGroup, showGroups } from '../../src/users/farmer/farmmanagement.js';

describe('Farmer groups', () => {
  beforeEach(() => {
    nock(`${BASEURL}`)
      .get('/ussd/getgroupbylocationid/995')
      .reply(200, availableGroups);
    nock(`${BASEURL}`)
      .get('/ussd/checklocationdetails/1')
      .reply(200, location);
    nock(`${BASEURL}`)
      .get('/ussd/getgroupbylocationid/664')
      .reply(404, locationNotFound);
    nock(`${BASEURL}`)
      .post('/ussd/saveuserundergroup/')
      .reply(200, joinGroupOk);
    nock(`${BASEURL}`)
      .post('/ussd/saveuserundergroup/')
      .reply(400, userAlreadyInGroup);
  });
  it('should be listed depending on a given location', async () => {
    const location = await getLocationID(1);
    const groups = await showGroups(location.data.locationID);
    expect(groups).to.equal('CON Choose a group you want to join\n1. XYZ Farmers Group');
  });
  it('should present a message if there are no groups in the location given', async () => {
    const groups = await showGroups(664);
    expect(groups).to.equal('CON Sorry, there are no groups available at the moment.');
  });
  it('should give a success message if a user chooses a particular group to join', async () => {
    const joinGroupSuccess = await joinGroup(995, 1);
    expect(joinGroupSuccess).to.equal('END Successfully joined group');
  });
  it('should display an error message if user wants to join a group he is in already', async () => {
    const response = await joinGroup(1, 1);
    expect(response).to.equal('END You are already in this group');
  });
});