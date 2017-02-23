"use strict";
/**
 * Created by Greg on 4/15/2016.
 */
const postings = require('../../mocks/posting.json');

function findPostingById(id) {
  return new Promise(function(resolve, reject){
    Posting.findOne(id).exec(function(error, postingResult){
      if(error) {
        return reject(error);
      }

      if(!postingResult){
        resolve(postings.filter(function(posting){
          return posting.id == id;
        }).pop());
      }

      resolve(postingResult);
    });
  });
}

module.exports = {
  findOne(req, res, next){
    
    const id = req.allParams()['id'];
    let posting = null;
    console.log("retrieve posting " + id);

    return findPostingById(id).then(function(posting){
      if(posting){

        Category.findOne(posting.category_id).exec(function(error, category){
          if(error) {
            res.serverError(error);
          }

          posting.category = category;
          res.ok(posting);
        });


      }
      else {
        res.notFound();
      }
    }, function(err) {
      res.serverError(err);
    });
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
