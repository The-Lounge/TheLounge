'use strict';
/**
 * @author Greg Rozmarynowycz <greg@thunderlab.net>
 */

const users = require('../../mocks/user.json');

function findUserById(id) {
  return new Promise(function(resolve, reject){
    User.findOne(id).exec(function(error, postingResult){
      if(error) {
        return reject(error);
      }

      if(!postingResult){
        resolve(users.filter(function(posting){
          return posting.id == id;
        }).pop());
      }

      resolve(postingResult);
    });
  });
}

module.exports = {
  findOne(req, res, next) {
    const id = req.allParams()['id'];
    console.log("retrieve user " + id);

    return findUserById(id).then(user => {
      if (user) {
        delete user.role;
        delete user.skills;
        delete user.tags;
        delete user.pass_hash;
        res.ok(user);
      } else {
        res.notFound();
      }
    }, (err) => {
      res.serverError(err);
    })
  },

  find(req, res, next){
    try {
      console.log("retrieve user");
      res.set('Content-Type','application/json');
      res.ok(users ? users : []);
    } catch (e) {
      next(e);
    }
  }
};
