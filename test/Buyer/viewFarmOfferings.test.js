import { describe } from "mocha";
import nock from "nock";
import { BASEURL } from "../../src/core/urls.js";

describe("Buyer", () => {
  beforeEach(() => {
    nock(`${BASEURL}`).get("/ussd/productsbyproductid").reply(200, "Success");

    nock(`${BASEURL}`);

    nock(`${BASEURL}`);

    nock(`${BASEURL}`);
  });
});
