'use strict';
/**
 * @author Greg Rozmarynowycz <greg@thunderlab.net>
 */

const users = require('../../mocks/user.json');

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

    status: {
      type: 'boolean',
      enum: ['active', 'inactive', 'under_review', 'banned']
    }
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

        delete userResult.role;
        delete userResult.skills;
        delete userResult.tags;
        delete userResult.pass_hash;

        resolve(userResult);
      });
    });
  },

  beforeValidate: function (values, cb) {
    if (values.name) {
      const firstName = values.name.first_name;
      const lastName = values.name.last_name;

      if(!(typeof firstName === 'string' && firstName.length > 0)) {
        return cb('Invalid first_name ' + firstName);
      }

      if (!(typeof lastName === 'string' && lastName.length > 0)) {
        return cb('Invalid last_name ' + lastName);
      }

      cb();
    }
  }
};
