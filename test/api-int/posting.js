'use strict';
/**
 * @author Greg Rozmarynowycz <greg@thunderlab.net>
 */
require('any-promise/register/q');
const request = require('request-promise-any');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const expect = chai.expect;

const API_PATH = 'http://localhost:1337/api/';

const expectedPosting = {
  seller_id: '-6',
  id: '-1',
  title: '$5 Nail Painting',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse sed ipsum nisl',
  active: true,
  category: {
    shortname: 'beauty',
    name: 'Beauty',
    active: true,
    id: 2
  }
};

describe('/posting', () => {
  it('GET /posting/:id', ()=> {
    const postingId = '-1';
    const posting = request.get(`${API_PATH}posting/${postingId}`).then(JSON.parse);
    return expect(posting).to.eventually.deep.equal(expectedPosting);
  });
});
