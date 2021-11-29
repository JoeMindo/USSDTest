import request from 'supertest';
import chai, { assert, expect } from 'chai';
import { loginUser } from '../../src/core/usermanagement.js';

describe('Login', () => {
  it('should return success if credential is valid', async () => {
    const mockLoginData = {
      phone_no: '+254700000001',
      password: '123456789',

    };
    const loginResponse = await loginUser(mockLoginData);
    expect(loginResponse.status).to.equal(200);
    expect(typeof (loginResponse.data)).to.equal('object');
    expect(loginResponse.data.login).to.equal('true');
  });

  it('should return error if credential is invalid', async () => {
    const sampleLoginData = {
      phone_no: '+254700000001',
      password: '12345678',
    };
    const loginResponse = await loginUser(sampleLoginData);
    expect(loginResponse.status).to.equal(400);
    expect(typeof (loginResponse.data.status)).to.equal('error');
  });
});