/**
 * CategoryController
 *
 * @description :: Server-side logic for managing categories
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const mapError   = require('../lib/responseUtils.js').mapError;

module.exports = {
  findOne(req, res) {
    const id = req.allParams().id;

    Category.getById(id).then((category) => {
      if (!category) {
        res.notFound();
      }

      res.ok(category);
    }).catch(mapError);
  },

  find(req, res) {
    const includeInactive = req.allParams().inactive === '1';
    Category.getAll(includeInactive)
      .then(res.ok)
      .catch(res.serverError);
  },
};

