'use strict';
/**
 * Created by Greg on 4/12/2016.
 */
const Q = require('q');
const modelUtil = require('../lib/modelUtils');

/**
 * Resolves entities on a posting response and removes extra fields
 * @param postingData
 * @returns {Promise<Posting>}
 */
function processPosting(postingData) {
  const returnedFields = [
    'title',
    'price',
    'id',
    'seller',
    'category',
    'active',
    'description',
    'createdAt',
    'updatedAt'];

  Object.keys(postingData).forEach((key) => {
    if(returnedFields.indexOf(key) === -1) {
      delete postingData[key];
    }
  });

  return Q.when(postingData);
}

const modelSettings = {
  attributes: {
    title: {
      type: 'string',
      size: '50',
      required: true,
    },

    price: {
      type: 'json',
      defaultsTo() {return {minimum: null, maximum: null}; },
    },

    description: {
      type: 'mediumtext',
      required: true,
    },

    seller: {
      model: 'User',
      columnName: 'sellerId',
    },

    category: {
      model: 'Category',
      columnName: 'categoryId',
    },

    // datePosted: {
    //   type: 'integer',
    //   defaultsTo: 0
    // },

    // tags: {
    //   type: 'array',
    //   defaultsTo: []
    // },

    // user: {
    //   model: 'User'
    // }

    // skills: {
    //   collection: 'Property'
    // }

    active: {
      type: 'boolean',
      defaultsTo: true
    }
  },

  getById(id) {
    return new Promise((resolve, reject) => {
      Posting.findOne(id)
        .populate('seller', {select: ['id', 'name', 'active']})
        .populate('category', {select: ['id', 'shortname', 'name', 'active']})
        .exec(function(error, postingResult){
          if(error) {
            return reject(error);
          }

          if(!postingResult) {
            return resolve(null);
          }

          resolve(processPosting(postingResult.toJSON()));
        });
    });
  },

  beforeValidate(postingData, next) {
    postingData.seller = postingData.sellerId;
    postingData.category = parseInt(postingData.categoryId, 10);
    next();
  },
};

modelUtil.applyMockId(modelSettings);

module.exports = modelSettings;
