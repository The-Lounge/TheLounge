'use strict';
/**
 * @author Greg Rozmarynowycz <greg@thunderlab.net>
 */

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
