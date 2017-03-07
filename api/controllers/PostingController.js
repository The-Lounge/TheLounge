"use strict";
/**
 * Created by Greg on 4/15/2016.
 */
const postings = require('../../mocks/posting.json');
const Q = require('q');

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

function getCategory(id) {
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

function processPosting(posting) {
  if(posting.category) {
    return Q.when(posting);
  }

  return getCategory(posting.category_id).then(category => {
    posting.category = category;

    delete posting.image;
    delete posting.skills;
    delete posting.category_id;
    delete posting.tags;
    delete posting.date;

    delete posting.category.description;

    return posting;
  });
}

module.exports = {
  findOne(req, res, next){

    const id = req.allParams()['id'];
    let posting = null;
    console.log("retrieve posting " + id);

    return findPostingById(id).then(function(posting){
      if(posting){
        return processPosting(posting).then(res.ok);
      }
      else {
        res.notFound();
      }
    }).catch(res.serverError);
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

    console.log(req.body);

    if(!req.body || Object.keys(req.body).length === 0) {
      return res.badRequest('400 Bad Request: Posting must include body');
    }

    Posting.create(req.body).exec(function(error, posting){
      if(error) {
        return res.serverError(error);
      }

      return processPosting(posting)
        .then(res.created)
        .catch(res.serverError);
    })
  }
};
