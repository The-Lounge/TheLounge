"use strict";
/**
 * Created by Greg on 4/15/2016.
 */
const postings = require('../../mocks/posting.json');

module.exports = {
  findOne(req, res, next){
    try {
      const id = req.allParams()['id'];
      console.log("retrieve posting " + id);

      const posting = postings.filter(function(posting){
        return posting.id == id;
      }).pop();

      if(posting){
        res.ok(posting);
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
      res.ok(postings ? postings : []);
    } catch (e) {
      next(e);
    }
  },

  create(req, res, next){
    try {
      //TODO: return mock data
      console.log("create posting");
      res.set('Content-Type','application/json');
      res.ok({});
    } catch (e) {
      next(e);
    }
  }
};
