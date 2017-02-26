'use strict';
/**
 * Category.js
 *
 * @description :: Denotes in broad terms the type of service a posting is offering
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    id: {
      type: 'integer',
      primaryKey: true,
      unique: true
    },

    name: {
      type: 'string',
      size: 50,
      defaultsTo: ''
    },

    description: {
      type: 'mediumtext',
      defaultsTo: ''
    }
  }
};
