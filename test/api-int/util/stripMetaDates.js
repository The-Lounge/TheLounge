/**
 * @author Greg Rozmarynowycz <greg@thunderlab.net>
 */
const chai = require('chai');

function stripMetaDates(response, assertExist = false) {
  if (response instanceof Array) {
    response.forEach(posting => stripMetaDates(posting, assertExist));
    return response;
  }

  if (assertExist) {
    chai.expect(response).to.have.keys(['createdAt', 'updatedAt']);
  }

  delete response.createdAt;
  delete response.updatedAt;
  return response;
}

module.exports = {stripMetaDates};
