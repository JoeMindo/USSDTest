import { expect } from 'chai';
import nock from 'nock';
import { BASEURL } from '../../src/config/urls.js';
import { registerUser } from '../../src/core/usermanagement.js';
import registerResponse from './responses.js';

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
    nock(`${BASEURL}`)
      .post('/api/register')
      .reply(200, registerResponse);
  });
  it('should return successfull if data is valid', async () => {
    const registerResponse = await registerUser(registrationData);
    expect(registerResponse.status).to.equal('success');
    expect(registerResponse.data.first_name).to.equal('Test');
  });
});