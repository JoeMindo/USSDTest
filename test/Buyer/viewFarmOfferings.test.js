import { expect } from 'chai';
import { describe, it } from 'mocha';
import nock from 'nock';
import { BASEURL } from '../../src/core/urls.js';

describe('Buyer', () => {
  beforeEach(() => {
    nock(`${BASEURL}`)
      .get('/api/productsbyproductid')
      .reply(200, farmOffers);

    nock(`${BASEURL}`);

    nock(`${BASEURL}`);

    nock(`${BASEURL}`);
  });
});