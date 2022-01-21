import { expect } from 'chai';
import nock from 'nock';
import { describe, it } from 'mocha';
import {
  counties,
  regions,
  locationError,
  geoArea,
} from './farmerResponses.js';
import { addLocation } from '../../src/core/usermanagement.js';
import { BASEURL } from '../../src/core/urls.js';
import {
  getLocations,
  getRegions,
} from '../../src/users/farmer/listlocations.js';

describe('Locality details', () => {
  beforeEach(() => {
    nock(`${BASEURL}`).get('/ussd/regions/').reply(200, regions);
    nock(`${BASEURL}`).get('/ussd/counties/1').reply(200, counties);
    nock(`${BASEURL}`).get('/ussd/counties/99').reply(404, locationError);
    nock(`${BASEURL}`).post('/ussd/geoarea/1').reply(201, geoArea);
  });
  it('should display the regions and track the region IDs', async () => {
    const response = await getRegions();
    expect(typeof response.items).to.equal('string');
    expect(typeof response.ids).to.equal('object');
  });
  it('should render the relevant location data depending on administrative unit', async () => {
    const response = await getLocations('counties', 1, 'county_name');
    expect(response.items).to.equal('1. NAIROBI\n');
    expect(response.ids[0]).to.equal(47);
  });
  it('should raise an error if location does not exist', async () => {
    const response = await getLocations('counties', 99, 'county_name');
    expect(response.status).to.equal(404);
    expect(response.data.message.data.items).to.equal('Location not found');
  });
  it('should return status 201 if location has been saved successfully', async () => {
    const areaData = {
      sub_county_id: 123,
      location_id: 58,
      area: 'Here',
    };
    const userId = 1;
    const response = await addLocation(areaData, userId);

    expect(response.status).to.equal(201);
  });
});
