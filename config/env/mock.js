'use strict';
/**
 * @author Greg Rozmarynowycz <greg@thunderlab.net>
 */

const path = require('path');
const Q = require('q');
const fs = require('fs');

const mockDir = './mocks';

/** @type [] */
const postings = require(path.resolve(mockDir, 'posting.json'));
/** @type [] */
const categories = require(path.resolve(mockDir, 'category.json'));
/** @type [] */
const users = require(path.resolve(mockDir, 'user.json'));


function createModel(model, data) {
  if(model.simpleCreate instanceof Function) {
    return model.simpleCreate(data).then(sails.log);
  } else {
    return Q.Promise((resolve, reject) => {
      model.create(data).exec((err, model) => {
        if(err) {
          reject(err);
        } else {
          resolve(model);
        }
      });
    }).then(sails.log);
  }

}

function promisify(f) {
  return Q.Promise((resolve, reject) => {
    f((e, r) => {
      if(e) {
        reject(e);
      } else {
        resolve(r);
      }
    });
  });
}

function populateMockData() {
  const createPosting = createModel.bind(null, Posting);
  const createCategory = createModel.bind(null, Category);
  const createUser = createModel.bind(null, User);

  return Q.all(categories.map(createCategory))
    .then(() => Q.all(users.map(createUser)))
    .then(() => Q.all(postings.map(createPosting)));
}


module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the development       *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  models: {
    connection: 'localDiskDb'
  },

  bootstrap(cb) {
    try {
      fs.unlinkSync(__dirname + '/../.tmp/localDiskDb.db');
    } catch (e) {}
    populateMockData()
      .catch(sails.log)
      .finally(cb);
  },
};
