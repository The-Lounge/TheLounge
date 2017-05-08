/**
 * @author Greg Rozmarynowycz <greg@thunderlab.net>
 */
require('any-promise/register/q');
const request = require('request-promise-any');
const chai = require('chai');
const config = require('./sharedConfig');
chai.use(require('chai-as-promised'));

const expect = chai.expect;
const util = require('./util');

const endpoint = {
  POSTING: 'posting',
};
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
  updatePosting: {
    id: null, // set during test
    sellerId: '-5',
    title: 'This is an updated test posting',
    description: 'some updated posting description text',
    categoryId: 2,
    price: {
      minimum: 3,
      maximum: 10,
    },
  },
  badPriceBlock: {
    sellerId: '-5',
    title: 'This has a bad price block',
    description: 'some posting description text, bad price block',
    categoryId: 3,
    price: {
      minimum: 15,
      maximum: 10,
    },
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
    id         : null, // determined in test
    title      : 'This is a test posting',
    description: 'some posting description text',
    active     : true,
    category   : {
      id       : 3,
      shortname: 'tutor',
      name     : 'Tutor',
      active   : true,
    },
    price      : {
      minimum: null,
      maximum: 10,
    },
    seller     : {
      id  : '-5',
      name: {
        firstName: 'Mark',
        lastName : 'Koellmann',
      },
    },
  },
  putPosting: {
    id: null, // determined in test
    title: 'This is an updated test posting',
    description: 'some updated posting description text',
    active: true,
    category: {
      shortname: 'beauty',
      name: 'Beauty',
      active: true,
      id: 2,
    },
    price:  {
      minimum: 3,
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
    httpClient = new util.HttpClient({baseUrl: config.API_PATH});
    return httpClient.authenticate(config.endpoint.LOGIN, config.validLogin);
  });

  it('GET /posting/:id', () => {
    const postingId = '-1';
    const posting = request.get(`${config.API_PATH}posting/${postingId}`)
      .then(JSON.parse)
      .then(util.stripMetaDates);
    return expect(posting).to.eventually.deep.equal(expected.getPosting);
  });

  describe('POST /posting/', () => {
    function updateMetaValues(actualObj, expectedObj) {
      if (!actualObj.id) {
        throw new Error('Entity did not return w/ id');
      }

      expectedObj.id = actualObj.id;
      expectedObj.createdAt = actualObj.createdAt;
      expectedObj.updatedAt = actualObj.updatedAt;
      return actualObj;
    }

    it('responds with 400 Bad Request provided with invalid fields', () => {
      const postingOp = httpClient.post(endpoint.POSTING, testData.badPriceBlock);
      return expect(postingOp).to.be.rejected
        .and.to.eventually.be.instanceof(Error)
        .and.to.have.property('statusCode', 400);
    });

    it('responds with the created posting on success', () => {
      const postingOp = httpClient.post(endpoint.POSTING, testData.createPosting)
        .then(posting => updateMetaValues(posting, expected.postPosting));

      return expect(postingOp).to.eventually.deep.equal(expected.postPosting);
    });

    it('rejects entities with invalid price field values', () => Promise.all([{
      minimum: 20,
      maximum: 10,
    }, {
      minimum: null,
      maximum: null,
    }, {
      minimum: 'string',
      maximum: {},
    }].map((badPriceField) => {
      testData.badPriceBlock.price = badPriceField;
      const postingOp = httpClient.post(endpoint.POSTING, testData.badPriceBlock);
      return expect(postingOp).to.be.rejected
        .and.to.eventually.be.instanceof(Error)
        .and.to.have.property('statusCode', 400);
    })));

    it('accepts entities with valid price field values', () => Promise.all([{
      minimum: 3.25,
      maximum: 10,
    }, {
      minimum: 10,
      maximum: null,
    }, {
      minimum: null,
      maximum: 10.50,
    }].map((priceBlock) => {
      testData.createPosting.price = priceBlock;
      const expectedPosting = Object.assign({}, expected.postPosting);
      expectedPosting.price = priceBlock;
      const postingOp = httpClient.post(endpoint.POSTING, testData.createPosting)
        .then(posting => updateMetaValues(posting, expectedPosting));

      return expect(postingOp).to.eventually.deep.equal(expectedPosting);
    })));
  });

  describe('PUT /posting/:id', () => {
    it('responds with the created posting on success', () => {
      const postingOp = httpClient.post(endpoint.POSTING, testData.createPosting)
        .then((posting) => {
          const updateEntity = Object.assign({}, testData.updatePosting);
          updateEntity.id = posting.id;
          return httpClient.put(`${endpoint.POSTING}/${posting.id}`, updateEntity);
        })
        .then((posting) => {
          expected.putPosting.id = posting.id;
          expected.putPosting.createdAt = posting.createdAt;
          expected.putPosting.updatedAt = posting.updatedAt;
          return posting;
        });

      return expect(postingOp).to.eventually.deep.equal(expected.putPosting);
    });

    it('does not allow update seller from original value', () => {
      const postingOp = httpClient.post(endpoint.POSTING, testData.createPosting)
        .then((posting) => {
          const updateEntity = Object.assign({}, testData.updatePosting);
          updateEntity.id = posting.id;
          updateEntity.sellerId = '-3';
          return httpClient.put(`${endpoint.POSTING}/${posting.id}`, updateEntity);
        });

      return expect(postingOp).to.be.rejected
        .and.to.eventually.be.instanceof(Error)
        .and.to.satisfy((error) => {
          expect(error).to.have.property('statusCode', 400);
          expect(error).to.have.property('message').includes('Seller field cannot be modified');
          return true;
      });
    });
  });
});
