'use strict';
/**
 * @author Greg Rozmarynowycz <greg@thunderlab.net>
 */
require('any-promise/register/q');
const request = require('request-promise-any');
const chai = require('chai');
chai.use(require('chai-as-promised'));

const expect = chai.expect;

const API_PATH = 'http://localhost:1337/api/';

const testData = {
  createPosting: {
    seller_id: '-5',
    title: 'This is a test posting',
    description: 'some posting description text',
    category_id: 3,
  }
};

const expected = {
  getPosting: {
    id: '-1',
    title: '$5 Nail Painting',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse sed ipsum nisl',
    active: true,
    category: {
      shortname: 'beauty',
      name: 'Beauty',
      active: true,
      id: 2
    },
    seller: {
      id: '-6',
      email: 'rxm4978@g.rit.edu',
      name: {
        first_name: 'Radha',
        last_name: 'Mendapra',
      },
      status: 'active',
      user_name: 'rxm4978',
    }
  },
  postPosting: {
    id: null, //determined in test
    title: 'This is a test posting',
    description:  'some posting description text',
    active: true,
    category: {
      id: 3,
      shortname: 'tutor',
      name: 'Tutor',
      active: true,
    },
    seller: {
      id: '-5',
      email: 'mak9384@g.rit.edu',
      name: {
        first_name: 'Mark',
        last_name: 'Koellmann'
      },
      status: 'active',
      user_name: 'mak9384',
    }

  }
};

describe('/posting', () => {
  it('GET /posting/:id', () => {
    const postingId = '-1';
    const posting = request.get(`${API_PATH}posting/${postingId}`).then(JSON.parse);
    return expect(posting).to.eventually.deep.equal(expected.getPosting);
  });

  it('POST /posting/', () => {
    const posting = request.post({
      url: `${API_PATH}posting/`,
      json: true,
      headers: {'Content-Type': 'application/json'},
      body: testData.createPosting
    }).then(posting => {
      expected.postPosting.id = posting.id;
      expected.postPosting.createdAt = posting.createdAt;
      expected.postPosting.updatedAt = posting.updatedAt;
      if(!posting.id) {
        throw new Error('posting did not return with ID');
      }

      return posting;
    });

    return expect(posting).to.eventually.deep.equal(expected.postPosting);
  });
});
