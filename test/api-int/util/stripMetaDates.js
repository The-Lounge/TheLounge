/**
 * @author Greg Rozmarynowycz <greg@thunderlab.net>
 */
const chai = require('chai');

function stripMetaDates(response, assertExist) {
  if (assertExist) {
    chai.expect(response).to.have.keys(['createdAt', 'updatedAt']);
  }

  delete response.createdAt;
  delete response.updatedAt;
  return response;
}

module.exports = {stripMetaDates};
