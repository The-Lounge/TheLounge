'use strict';
/**
 * @author Greg Rozmarynowycz <greg@thunderlab.net>
 */

module.exports = {
  findOne(req, res, next) {
    const id = req.allParams()['id'];
    console.log("retrieve user " + id);

    return User.getById(id).then(user => {
      if (user) {
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
