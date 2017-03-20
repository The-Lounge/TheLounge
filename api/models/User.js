'use strict';
/**
 * @author Greg Rozmarynowycz <greg@thunderlab.net>
 */
const users = require('../../mocks/user.json');
const HttpError = require('standard-http-error');
const Q = require('q');
const ldap = require('ldapjs');

const ldapParams = {
  server: 'ldaps://ldap.rit.edu:636',
  baseDN: 'ou=people,dc=rit,dc=edu',
  getDn(username) {
    return `uid=${username},${this.baseDN}`;
  },
  getFilter(username) {
    return `(uid=${username})`;
  },
};

function processUser(user) {
  delete user.role;
  delete user.skills;
  delete user.tags;

  return user;
}

module.exports = {
  attributes: {

    name: {
      type: 'json',
      required: true
    },

    userName: {
      type: 'string',
      required: true
    },

    email: {
      type: 'string',
      required: true
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
    const client = ldap.createClient({url: ldapParams.server});

    return new Promise((resolve, reject) => {
      User.findOne({userName: credentials.userName}).exec((error, userResult) => {
        if (error) { return reject(error); }
        if (!userResult) { return reject(invalidCredError); }

        resolve(userResult);
      });
    }).then(userResult => {
      return Q.nfcall(
        client.bind.bind(client),
        ldapParams.getDn(userResult.userName),
        credentials.password)

        .then(() => {return processUser(userResult);})
        .catch((err) => {
        if(err.message && err.message.indexOf('Invalid Credentials') > -1) {
          return Q.reject(invalidCredError);
        } else {
          return Q.reject(err);
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
            return posting.id === id;
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
      const firstName = values.name.firstName;
      const lastName = values.name.lastName;
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
};
