/**
 * Created by Greg on 4/12/2016.
 */
const Q = require('q');
const modelUtil = require('../lib/modelUtils');
const _ = require('lodash');
const HttpError = require('standard-http-error');

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
    if (returnedFields.indexOf(key) === -1) {
      delete postingData[key];
    }
  });

  return postingData;
}

/**
 * Indicates if the given price block is valid
 * @param price {{minimum, maximum}}
 * @returns {boolean}
 */
function isValidPriceBlock(price) {
  return price instanceof Object &&
    (_.isNumber(price.minimum) || _.isNumber(price.maximum)) &&
    (price.maximum >= price.minimum || price.maximum === null);
}

/**
 * Returns a sort index based on the updatedAt attribute
 * @param a
 * @param b
 * @returns {number}
 */
function comparePostingUpdatedAt(a, b) {
  if (a.updatedAt > b.updatedAt) return -1;
  if (a.updatedAt < b.updatedAt) return 1;
  return 0;
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
      defaultsTo() { return {minimum: null, maximum: null}; },
    },

    description: {
      type: 'mediumtext',
      required: true,
    },

    seller: {
      model: 'User',
      columnName: 'sellerId',
      required: true,
    },

    category: {
      model: 'Category',
      columnName: 'categoryId',
      required: true,
      numeric: true,
    },

    // tags: {
    //   type: 'array',
    //   defaultsTo: []
    // },

    // skills: {
    //   collection: 'Property'
    // }

    active: {
      type: 'boolean',
      defaultsTo: true,
    },
  },

  getById(id) {
    return new Promise((resolve, reject) => {
      Posting.findOne(id)
        .populate('seller', {select: ['id', 'name', 'active']})
        .populate('category', {select: ['id', 'shortName', 'name', 'active']})
        .exec((error, postingResult) => {
          if (error) {
            return reject(error);
          }

          if (!postingResult) {
            return resolve(null);
          }

          return resolve(processPosting(postingResult.toJSON()));
        });
    });
  },

  findPopulated(criteria, pagination = {page: 1, limit: 25}, inactive = false) {
    return new Promise((resolve, reject) => {
      Posting.find(criteria)
        .paginate(pagination)
        .populate('seller', {select: ['id', 'name', 'active']})
        .populate('category', {select: ['id', 'shortName', 'name', 'active']})
        .exec((error, postingResult) => {
          if (error) {
            return reject(error);
          }

          if (!postingResult) {
            return resolve([]);
          }

          return resolve(postingResult
            .map(result => result.toJSON())
            .filter(posting => posting.active || inactive)
            .sort(comparePostingUpdatedAt)
            .map(processPosting));
        });
    });
  },

  beforeValidate(postingData, next) {
    postingData.seller = postingData.sellerId;
    postingData.category = parseInt(postingData.categoryId, 10);

    if (!isValidPriceBlock(postingData.price)) {
      // return next({
      //   code: 'E_UNIQUE',
      //   model: 'Posting',
      //   invalidAttributes: {price: [{
      //     message: 'Invalid posting parameters, "price" block must be defined, with minimum and/or maximum',
      //   }]},
      //   status: 400});
      return next(new HttpError(400,
        'Invalid posting parameters, "price" block must be defined, with minimum and/or maximum'));
    }

    return next();
  },
};

modelUtil.applyMockId(modelSettings);

module.exports = modelSettings;
