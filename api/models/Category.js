'use strict';
/**
 * Category.js
 *
 * @description :: Denotes in broad terms the type of service a posting is offering
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
const Q = require('q');

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
  },

  /**
   * Return a collection of all categories, including only active by default
   * @param includeInactive {boolean}
   * @returns {Promise<Array>}
   */
  getAll(includeInactive = false) {
    return Q.Promise((resolve, reject) => {
      Category.find({}).exec((e, categoryList) => {
        if(e) {
          return reject(e);
        }

        resolve(categoryList
          .filter(category => category.active === true || includeInactive)
          .map(category => {
            category.icon_url = '';
            return category;
          }));
      });
    });
  },

  /**
   * Get a category by id (or other query)
   * @param id
   * @returns {Promise<T>}
   */
  getById(id) {
    return Q.Promise((resolve, reject) => {
      Category.findOne(id).exec((e, category) => {
        if(e) {
          reject(e);
        } else {
          resolve(category);
        }
      })
    });
  }
};
