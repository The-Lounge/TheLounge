/**
 * Created by Greg on 3/16/2017.
 */
require('any-promise/register/q');
const request = require('request-promise-any');
const url = require('url');
const chai = require('chai');
chai.use(require('chai-as-promised'));

const expect = chai.expect;
const API_PATH = 'http://localhost:1337/api/';
const endpoint = {
  CATEGORY_LIST: '/api/category',
  CATEGORY_LIST_ALL: '/api/category?inactive=1',
};

const reqOptions = {
  url: url.resolve(API_PATH, endpoint.CATEGORY_LIST),
  json: true,
  headers: {'Content-Type': 'application/json'},
};

const reqOptionsAll = {
  url: url.resolve(API_PATH, endpoint.CATEGORY_LIST_ALL),
  json: true,
  headers: {'Content-Type': 'application/json'},
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
