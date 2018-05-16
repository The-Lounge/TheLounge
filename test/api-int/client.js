/**
 * Created by Greg on 3/15/2017.
 */
require('any-promise/register/q');
const request = require('request-promise-any');
const url = require('url');
const chai = require('chai');
const config = require('./sharedConfig');
chai.use(require('chai-as-promised'));

const expect = chai.expect;
const util = require('./util');

const Q = require('q');

const endpoint = {
  ME: 'me',
};

const loginOptions = {
  url: url.resolve(config.API_PATH, config.endpoint.LOGIN),
  json: true,
  headers: {'Content-Type': 'application/json'},
};

const logoutOptions = {
  resolveWithFullResponse: true,
  url: url.resolve(config.API_PATH, config.endpoint.LOGOUT),
};

const testData = {
  invalidLogin_pw: {
    userName: 'tlr3552',
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
      firstName: 'Tyler',
      lastName: 'Russell',
    },
    userName: 'tlr3552',
    id: '-12',
    email: 'tlr3552@g.rit.edu',
    status: 'active',
  },
};

describe('ClientController', () => {
  describe('/login', () => {
    it('responds to a POST request', () => {
      const loginReq = request.post(Object.assign({body: {}}, loginOptions));
      return expect(loginReq).to.be.rejectedWith(Error, '400');
    });

    it('responds with user details (200) when provided with valid credentials', () => {
      const loginReq = request.post(Object.assign({body: config.validLogin}, loginOptions))
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

  describe('/me', () => {
    before(function before() {
      this.httpClient = new util.HttpClient({baseUrl: config.API_PATH});
    });

    it('responds with a 401 if the client is unauthorized', function meUnauth() {
      const meReq = this.httpClient.get(endpoint.ME);
      return expect(meReq).to.be.rejectedWith(Error, '401');
    });

    it('responds with the currently authenticated user', function meAuth() {
      // TODO: THIS WILL BE AUTHENTICATED FOR ANY SUBSEQUENT TESTS
      const meReq = this.httpClient.authenticate(config.endpoint.LOGIN, config.validLogin)
        .then(() => this.httpClient.get(endpoint.ME));
      return expect(meReq).to.eventually.have.property('userName', config.validLogin.userName);
    });
  });
});
