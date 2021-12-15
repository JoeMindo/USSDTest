import { expect } from 'chai';
import nock from 'nock';
import { BASEURL } from '../../src/core/urls.js';
import { registerUser } from '../../src/core/usermanagement.js';
import {
  registerResponse, registrationFailureMissingFields, registrationFailureDuplicateNumber, registrationFailurePasswordTooShort,
} from './responses.js';

describe('Registration', () => {
  const registrationData = {
    phone_no: '+254710431513',
    first_name: 'Test',
    last_name: 'User',
    id_no: '345637271',
    role_id: '1',
    email: 'user@email.com',
    password: '123456789',
    password_confirmation: '123456789',
    gender: 'Male',
  };
  beforeEach(() => {
    // Success
    nock(`${BASEURL}`)
      .post('/api/register')
      .reply(200, registerResponse);
    // Missing Fields
    nock(`${BASEURL}`)
      .post('/api/register')
      .reply(200, registrationFailureMissingFields);
    nock(`${BASEURL}`)
      .post('/api/register')
      .reply(200, registrationFailureDuplicateNumber);
    nock(`${BASEURL}`)
      .post('/api/register')
      .reply(200, registrationFailurePasswordTooShort);
  });
  it('should return successfull if data is valid', async () => {
    const registerResponse = await registerUser(registrationData);
    expect(registerResponse.status).to.equal('success');
    expect(registerResponse.data.first_name).to.equal('Test');
  });
  it('should return error if fields are missing', async () => {
    const registrationData = {
      phone_no: null,
      password: null,
      password_confirmation: null,
      role_id: null,
    };
    const response = await registerUser(registrationData);
    const errorsDisplayed = {

      phone_no: [
        'The phone no field is required.',
      ],
      password: [
        'The password field is required.',
      ],
      role_id: [
        'The role id must be a string.',
      ],
    };

    expect(response.status).to.equal('error');
    expect(response.errors.phone_no[0]).to.equal(errorsDisplayed.phone_no[0]);
    expect(response.errors.password[0]).to.equal(errorsDisplayed.password[0]);
    expect(response.errors.role_id[0]).to.equal(errorsDisplayed.role_id[0]);
  });
  it('should return error if number exists', async () => {
    const data = {
      phone_no: '0731951724',
      password: 'somepassword',
      password_confirmation: 'somepassword',
      role_id: '1',
    };
    const response = await registerUser(data);
    const errorsDisplayed = {

      phone_no: [
        'The phone no has already been taken.',
      ],
    };

    expect(response.status).to.equal('error');
    expect(response.errors.phone_no[0]).to.equal(errorsDisplayed.phone_no[0]);
  });
  it('should return error if password is too short', async () => {
    const data = {
      phone_no: '+254712358743',
      password: 'some',
      password_confirmation: 'some',
      role_id: 1,
    };
    const response = await registerUser(data);
    const errorsDisplayed = {

      password: [
        'The password must be at least 8 characters.',
      ],
    };
    expect(response.status).to.equal('error');
    expect(response.errors.password[0]).to.equal(errorsDisplayed.password[0]);
  });
});
