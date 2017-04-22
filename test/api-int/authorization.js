/**
 * @author Greg Rozmarynowycz <greg@thunderlab.net>
 */
require('any-promise/register/q');
const request = require('request-promise-any');
const url = require('url');
const chai = require('chai');
const config = require('./sharedConfig');
chai.use(require('chai-as-promised'));

const expect = chai.expect;
const util = require('./util');
let httpClient = null;
const endpoint = {
  POSTING: 'posting',
};

describe('authorization policies', () => {
  before(() => {
    httpClient = new util.HttpClient({baseUrl: config.API_PATH});
  });

  it('send a 401 Unauthorized response if client is not authorized to access an endpoint', () => {
    // Try to create a posting w/ authorization
    const createOp = httpClient.post(endpoint.POSTING, {});
    expect(createOp).to.be.rejectedWith(Error, '401');
  });

  // no valid end points test...
  // it('send a 403 - Forbidden response if client does not have permissions for endpoint', () => {
  //
  // });
});
