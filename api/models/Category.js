/**
 * Category.js
 *
 * @description :: Denotes in broad terms the type of service a posting is offering
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
const Q = require('q');

const nameLookup = new Map();

module.exports = {

  attributes: {

    id: {
      type: 'integer',
      primaryKey: true,
      unique: true,
    },

    name: {
      type: 'string',
      size: 50,
      defaultsTo: '',
    },

    shortName: {
      type: 'string',
      size: 50,
      defaultsTo: '',
    },

    description: {
      type: 'mediumtext',
      defaultsTo: '',
    },

    iconUrl: {
      type: 'string',
      defaultsTo: '',
    },
  },

  /**
   * Return a collection of all categories, including only active by default
   * @param includeInactive {boolean}
   * @returns {Promise<Array>}
   */
  getAll(includeInactive = false) {
    return Q.Promise((resolve, reject) => {
      Category.find({}).exec((e, categoryList) => {
        if (e) {
          return reject(e);
        }

        return resolve(categoryList
          .filter(category => category.active === true || includeInactive));
      });
    });
  },

  resolveShortName(name) {
    if (nameLookup.size === 0) {
      // Populate the look up map
      return Category.getAll().then((categories) => {
        categories.forEach(category => nameLookup.set(category.shortName, category.id));
      }).then(() => nameLookup.get(name));
    }

    return Promise.resolve(nameLookup.get(name));
  },

  /**
   * Get a category by id (or other query)
   * @param id
   * @returns {Promise<Object>}
   */
  getById(id) {
    return Q.Promise((resolve, reject) => {
      Category.findOne(id).exec((e, category) => {
        if (e) {
          reject(e);
        } else {
          resolve(category);
        }
      });
    });
  },
};
