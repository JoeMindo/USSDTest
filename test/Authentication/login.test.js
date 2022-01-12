import { expect } from 'chai';
import nock from 'nock';
import { describe } from 'mocha';
import { BASEURL } from '../../src/core/urls.js';
import { checkIfUserExists, loginUser } from '../../src/core/usermanagement.js';
import {
  loginResponseSuccess,
  loginResponseFailure,
  isUserSuccess,
  isUserFailure,
} from './responses.js';

describe('Login', () => {
  beforeEach(() => {
    nock(`${BASEURL}`).post('/ussd/login').reply(200, loginResponseSuccess);
    nock(`${BASEURL}`).post('/ussd/login').reply(400, loginResponseFailure);
  });
  it('should return success if credential is valid', async () => {
    const mockLoginData = {
      phone_no: '+254700000001',
      password: '123456789',
    };
    const loginResponse = await loginUser(mockLoginData);
    expect(loginResponse.status).to.equal(200);
    expect(typeof loginResponse.data).to.equal('object');
    expect(loginResponse.data.login).to.equal('true');
  });

  it('should return error if credential is invalid', async () => {
    const sampleLoginData = {
      phone_no: '+254700000001',
      password: '12345678',
    };
    const loginResponse = await loginUser(sampleLoginData);
    expect(loginResponse.response.status).to.equal(400);
    expect(loginResponse.response.data.status).to.equal('error');
  });
  it('should distinguish between a buyer and a farmer based on how they registered', async () => {
    const testUser1 = {
      phone_no: '+254700000001',
      password: '123456789',
    };
    const testUser1response = await loginUser(testUser1);
    expect(testUser1response.status).to.equal(200);
    expect(testUser1response.data.role).to.equal('buyer');
  });
});

describe('User', () => {
  beforeEach(() => {
    nock(`${BASEURL}`).post('/ussd/isuser').reply(200, isUserSuccess);
    nock(`${BASEURL}`).post('/ussd/isuser').reply(400, isUserFailure);
  });
  it('if exists returns true', async () => {
    const details = {
      phone_no: '0719408977',
    };
    const response = await checkIfUserExists(details);
    const present = response.exists;
    const userRole = response.role;
    expect(present).to.equal(true);
    expect(userRole).to.equal('Farmer');
  });
});
