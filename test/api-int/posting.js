/**
 * @author Greg Rozmarynowycz <greg@thunderlab.net>
 */
require('any-promise/register/q');
const request = require('request-promise-any');
const chai = require('chai');
const atob = require('atob');
chai.use(require('chai-as-promised'));

const expect = chai.expect;
const util = require('./util');

const endpoint = {
  LOGIN : 'login',
  LOGOUT: 'logout',
  POSTING: 'posting',
};
const API_PATH = 'http://localhost:1337/api/';
let httpClient = null;

const testData = {
  createPosting: {
    sellerId: '-5',
    title: 'This is a test posting',
    description: 'some posting description text',
    categoryId: 3,
    price: {
      minimum: null,
      maximum: 10,
    },
  },
  validLogin: {
    // These must be valid, real RIT SSO credentials
    // To setup, put them in your config/local.js file, according to the template
    // just so the credentials don't have to be stored in completely plain text, encode them
    userName: atob(process.env.TEST_UID || global.TEST_UID),
    password: atob(process.env.TEST_PWD || global.TEST_PWD),
  },
};

const expected = {
  getPosting: {
    id: '-1',
    title: '$5 Nail Painting',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse sed ipsum nisl',
    active: true,
    price: {
      maximum: 15,
      minimum: 5,
    },
    category: {
      shortname: 'beauty',
      name: 'Beauty',
      active: true,
      id: 2,
    },
    seller: {
      id: '-6',
      name: {
        firstName: 'Radha',
        lastName: 'Mendapra',
      },
    },
  },
  postPosting: {
    id: null, // determined in test
    title: 'This is a test posting',
    description:  'some posting description text',
    active: true,
    category: {
      id: 3,
      shortname: 'tutor',
      name: 'Tutor',
      active: true,
    },
    price:  {
      minimum: null,
      maximum: 10,
    },
    seller: {
      id: '-5',
      name: {
        firstName: 'Mark',
        lastName: 'Koellmann',
      },
    },
  },
};

describe('/posting', () => {
  before(() => {
    httpClient = new util.HttpClient({baseUrl: API_PATH});
    return httpClient.authenticate(endpoint.LOGIN, testData.validLogin);
  });

  it('GET /posting/:id', () => {
    const postingId = '-1';
    const posting = request.get(`${API_PATH}posting/${postingId}`)
      .then(JSON.parse)
      .then(util.stripMetaDates);
    return expect(posting).to.eventually.deep.equal(expected.getPosting);
  });

  it('POST /posting/', () => {
    const postingOp = httpClient.post(endpoint.POSTING, testData.createPosting)
      .then((posting) => {
      expected.postPosting.id = posting.id;
      expected.postPosting.createdAt = posting.createdAt;
      expected.postPosting.updatedAt = posting.updatedAt;
      if (!posting.id) {
        throw new Error('posting did not return with ID');
      }

      return posting;
    });

    return expect(postingOp).to.eventually.deep.equal(expected.postPosting);
  });
});
