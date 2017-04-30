/**
 * Created by Greg on 3/16/2017.
 */
require('any-promise/register/q');
const request = require('request-promise-any');
const url = require('url');
const chai = require('chai');
const config = require('./sharedConfig');
chai.use(require('chai-as-promised'));


const expect = chai.expect;
const endpoint = {
  LOGIN            : 'category',
  CATEGORY_LIST_ALL: 'category?inactive=1',
};

const reqOptions = {
  url: url.resolve(config.API_PATH, endpoint.LOGIN),
  json: true,
};

const reqOptionsAll = {
  url: url.resolve(config.API_PATH, endpoint.CATEGORY_LIST_ALL),
  json: true,
};

describe('/category', () => {
  it('responds with a list of categories (excluding inactive)', () => {
    const listReq = request.get(reqOptions);
    return expect(listReq).to.eventually.have.length(7);
  });

  describe('/category/all', () => {
    it('responds with a list of all categories (including inactive)', () => {
      const listReq = request.get(reqOptionsAll);
      return expect(listReq).to.eventually.have.length(8);
    });
  });
});
