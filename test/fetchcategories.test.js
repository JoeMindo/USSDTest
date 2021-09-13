import sinon from "sinon";
import { expect } from "chai";
import integration from "mocha-axios";


describe("fetchCategories", () => {
  let sandbox;
  beforeEach(() => (sandbox = sinon.sandbox.create()));
  afterEach(() => sandbox.restore());
  it('should fetch categories', integration({
    app,
    req: {
      method: 'GET',
      url: 'https://c22d-197-211-5-78.ngrok.io/prodcategories',

    },
    res: {
      status: 200,
      headers: {
        'X-Auth-Token': 'e409413fd5b4bad63f0ee4093b0b0e9b',
      },
      data: 
        [
              {
                id: 1,
                category_name: "sample category",
              },
              {
                id: 2,
                category_name: "sample category 2",
              },
              {
                id: 3,
                category_name: "sample category 3",
              }
        ]

      ,
    },
  }))
});
