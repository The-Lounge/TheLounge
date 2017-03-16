'use strict';
/**
 * @author Greg Rozmarynowycz <greg@thunderlab.net>
 */
const bcrypt = require('bcrypt');
const users = require('../../mocks/user.json');
const HttpError = require('standard-http-error');

function processUser(user) {
  delete user.role;
  delete user.skills;
  delete user.tags;
  delete user.pass_hash;
  delete user.salt;

  return user;
}

module.exports = {
  attributes: {

    name: {
      type: 'json',
      required: true
    },

    user_name: {
      type: 'string',
      required: true
    },

    email: {
      type: 'string',
      required: true
    },

    pass_hash: {
      type: 'string',
      require: true,
    },

    status: {
      type: 'string',
      enum: ['active', 'inactive', 'under_review', 'banned'],
      defaultsTo: 'active'
    }
  },

  /**
   * Checks credentials against the DB and returns a user if valid
   * @param credentials {{userName, password}}
   * @returns {Promise}
   */
  authenticate(credentials) {
    const invalidCredError = new HttpError(422, 'Invalid Username or Password provided');
    return new Promise((resolve, reject) => {
      User.findOne({user_name: credentials.userName}).exec((error, userResult) => {
        if (error) { return reject(error); }
        if (!userResult) { return reject(invalidCredError); }

        resolve(userResult);
      });
    }).then(userResult => {
        return bcrypt.compare(credentials.password, userResult.pass_hash).then((res) => {
          if(res === true) {
            return processUser(userResult);
          } else {
            throw invalidCredError;
          }
        });
      });
  },

  getById(id) {
    return new Promise(function(resolve, reject){
      User.findOne(id).exec(function(error, userResult){
        if(error) {
          return reject(error);
        }

        if(!userResult){
          userResult = users.filter(function(posting){
            return posting.id == id;
          }).pop();
        }

        if (!userResult) {
          return reject(`User with ID ${id} not found`);
        }

        resolve(processUser(userResult));
      });
    });
  },

  beforeValidate: function (values, cb) {
    if (values.name) {
      const firstName = values.name.first_name;
      const lastName = values.name.last_name;
      const password = values.password;

      if(!(typeof firstName === 'string' && firstName.length > 0)) {
        return cb('Invalid first_name ' + firstName);
      }

      if (!(typeof lastName === 'string' && lastName.length > 0)) {
        return cb('Invalid last_name ' + lastName);
      }

      if (!(typeof password === 'string' && password.length > 0)) {
        return cb('Invalid password ' + password);
      }

      cb();
    }
  },

  afterValidate(values, cb) {
    // hash the user's selected password
    bcrypt.hash(values.password, 10).then((hash) => {
      values.pass_hash = hash;
      delete values.password;
      cb();
    });
  }
};
