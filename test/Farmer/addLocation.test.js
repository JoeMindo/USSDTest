import { expect } from 'chai';
import nock from 'nock';
import { describe } from 'mocha';
import { counties, regions, locationError } from './farmerResponses.js';
import { BASEURL } from '../../src/config/urls.js';
import { getLocations, getRegions } from '../../src/core/listlocations.js';

describe('Locality details', () => {
  beforeEach(() => {
    nock(`${BASEURL}`)
      .get('/api/regions/')
      .reply(200, regions);
    nock(`${BASEURL}`)
      .get('/api/counties/1')
      .reply(200, counties);
    nock(`${BASEURL}`)
      .get('/api/counties/99')
      .reply(404, locationError);
  });
  it('should display the regions and track the region IDs', async () => {
    const response = await getRegions();
    expect(typeof (response.items)).to.equal('string');
    expect(typeof (response.ids)).to.equal('object');
  });
  it('should render the relevant location data depending on administrative unit', async () => {
    const response = await getLocations('counties', 1, 'county_name');
    expect(response.items).to.equal('0. NAIROBI\n');
    expect(response.ids[0]).to.equal(47);
  });
    //TODO: Add a failure check

//   it('should raise an error if location does not exist', async () => {
//     const response = await getLocations('counties', 99, 'county_name');

//     expect(response.status).to.equal(400);
//   });
});