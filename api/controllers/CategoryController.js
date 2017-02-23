'use strict';
/**
 * CategoryController
 *
 * @description :: Server-side logic for managing categories
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const categories = require('../../mocks/category.json');

module.exports = {
  findOne(req, res, next) {
    try {
      const id = req.allParams()['id'];
      console.log("retrieve category " + id);

      const category = categories.filter(function(category){
        return category.id === id;
      }).pop();

      if(category){
        res.ok(category);
      }
      else {
        res.notFound();
      }

    } catch (e) {
      next(e);
    }
  },

  find(req, res, next){
    try {
      console.log("retrieve postings");
      res.set('Content-Type','application/json');
      res.ok(categories ? categories : []);
    } catch (e) {
      next(e);
    }
  }
};

