import { expect } from "chai";
import nock from "nock";
import { describe, it } from "mocha";
import {
  counties,
  regions,
  locationError,
  geoArea,
} from "./farmerResponses.js";
import { BASEURL } from "../../src/core/urls.js";
import {
  getLocations,
  getRegions,
} from "../../src/users/farmer/listlocations.js";
import { addLocation } from "../../src/core/usermanagement.js";

describe("Locality details", () => {
  beforeEach(() => {
    nock(`${BASEURL}`).get("/api/regions/").reply(200, regions);
    nock(`${BASEURL}`).get("/api/counties/1").reply(200, counties);
    nock(`${BASEURL}`).get("/api/counties/99").reply(404, locationError);
    nock(`${BASEURL}`).post("/api/geoarea/").reply(201, geoArea);
  });
  it("should display the regions and track the region IDs", async () => {
    const response = await getRegions();
    expect(typeof response.items).to.equal("string");
    expect(typeof response.ids).to.equal("object");
  });
  it("should render the relevant location data depending on administrative unit", async () => {
    const response = await getLocations("counties", 1, "county_name");
    expect(response.items).to.equal("1. NAIROBI\n");
    expect(response.ids[0]).to.equal(47);
  });
  it("should raise an error if location does not exist", async () => {
    const response = await getLocations("counties", 99, "county_name");
    expect(response.items).to.equal("Location not found");
    expect(response.ids).to.equal(undefined);
    // TODO:Add test for response code
    // expect(response.status).to.equal(404);
  });
  it("should return status 201 if location has been saved successfully", async () => {
    const areaData = {
      sub_county_id: 123,
      location_id: 58,
      area: "Here",
    };
    const userId = 1;
    const response = await addLocation(areaData, userId);
    //
    // expect(response.status).to.equal(201);
  });
});
