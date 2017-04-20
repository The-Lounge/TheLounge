/**
 * Created by Greg on 3/15/2017.
 */
require('any-promise/register/q');
const request = require('request-promise-any');
const url = require('url');
const chai = require('chai');
const atob = require('atob');
chai.use(require('chai-as-promised'));

// include local config if it's present
try { require('../../config/local'); } catch (e) { console.log('no local config'); }

const expect = chai.expect;
const util = require('./util');

const API_PATH = 'http://localhost:1337/api/';
const endpoint = {
  CATEGORY_LIST: '/api/login',
  LOGOUT: '/api/logout',
};
const Q = require('q');

const loginOptions = {
  url: url.resolve(API_PATH, endpoint.CATEGORY_LIST),
  json: true,
  headers: {'Content-Type': 'application/json'},
};

const logoutOptions = {
  resolveWithFullResponse: true,
  url: url.resolve(API_PATH, endpoint.LOGOUT),
};

const testData = {
  validLogin: {
    // These must be valid, real RIT SSO credentials
    // To setup, put them in your config/local.js file, according to the template
    // just so the credentials don't have to be stored in completely plain text, encode them
    userName: atob(process.env.TEST_UID || global.TEST_UID),
    password: atob(process.env.TEST_PWD || global.TEST_PWD),
  },
  invalidLogin_pw: {
    userName: 'gjr8050',
    password: 'notMyPassword',
  },
  invalidLogin_un: {
    userName: 'DNE',
    password: 'testPw',
  },
};

const expected = {
  user: {
    name: {
      firstName: 'Gregory',
      lastName: 'Rozmarynowycz',
    },
    userName: 'gjr8050',
    id: '-3',
    email: 'gjr8050@g.rit.edu',
    status: 'active',
  },
};

describe('/login', () => {
  it('responds to a POST request', () => {
    const loginReq = request.post(Object.assign({body: {}}, loginOptions)).then();
    return expect(loginReq).to.be.rejectedWith(Error, '400');
  });

  it('responds with user details (200) when provided with valid credentials', () => {
    const loginReq = request.post(Object.assign({body: testData.validLogin}, loginOptions))
      .then(util.stripMetaDates);
    return expect(loginReq).to.eventually.deep.equal(expected.user);
  });

  it('responds with a 400 code when provided malformed body', () => {
    const loginReq = request.post(Object.assign({body: {not: 'valid'}}, loginOptions));
    return expect(loginReq).to.be.rejectedWith(Error, '400');
  });

  it('responds with a 401 code when provided invalid credentials', () => {
    const loginReq1 = request.post(Object.assign({body: testData.invalidLogin_un}, loginOptions));
    const loginReq2 = request.post(Object.assign({body: testData.invalidLogin_pw}, loginOptions));

    return Q.all([
      expect(loginReq1).to.be.rejectedWith(Error, '401'),
      expect(loginReq2).to.be.rejectedWith(Error, '401')]);
  });
});

describe('/logout', () => {
  it('responds to a GET request', () => {
    const logoutReq = request.get(logoutOptions);
    return expect(logoutReq).to.eventually.have.property('statusCode', 200);
  });
});
