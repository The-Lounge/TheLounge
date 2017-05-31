/**
 * @author Greg Rozmarynowycz <greg@thunderlab.net>
 */

const Q = require('q');
const fs = require('fs');

/** @type [] */
const postings = require.main.require('./mocks/posting.json');
/** @type [] */
const categories = require.main.require('./mocks/category.json');
/** @type [] */
const users = require.main.require('./mocks/user.json');


function createModel(model, data) {
  if (model.simpleCreate instanceof Function) {
    return model.simpleCreate(data).then(sails.log);
  }

  return Q.Promise((resolve, reject) => {
    model.create(data).exec((err, instance) => {
      if (err) {
        reject(err);
      } else {
        resolve(instance);
      }
    });
  }).then(sails.log);
}

function promisify(f) {
  return Q.Promise((resolve, reject) => {
    f((e, r) => {
      if (e) {
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
    connection: 'localDiskDb',
  },

  bootstrap(cb) {
    try {
      fs.unlinkSync(`${__dirname}/../.tmp/localDiskDb.db`);
    } catch (e) {}
    populateMockData()
      .catch(sails.log)
      .finally(cb);
  },
};
