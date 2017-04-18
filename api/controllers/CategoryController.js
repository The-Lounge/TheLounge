/**
 * CategoryController
 *
 * @description :: Server-side logic for managing categories
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const mockCategories = require('../../mocks/category.json');

function getMockCategory(id) {
  return mockCategories
    .filter(category => category.id === id).pop();
}

module.exports = {
  findOne(req, res) {
    const id = req.allParams().id;

    Category.getById(id).then((category) => {
      if (!category) {
        category = getMockCategory(id);
        if (!category) {
          res.notFound();
        }
      }

      res.ok(category);
    }).catch(res.serverError);
  },

  find(req, res) {
    const includeInactive = req.allParams().inactive === '1';
    Category.getAll(includeInactive)
      .then(res.ok)
      .catch(res.serverError);
  },

};

