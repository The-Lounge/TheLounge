'use strict';
/**
 * @author Greg Rozmarynowycz <greg@thunderlab.net>
 */

module.exports = {
  findOne(req, res) {
    const id = req.allParams().id;

    return User.getById(id).then(user => {
      if (user) {
        res.ok(user);
      } else {
        res.notFound();
      }
    }).catch(res.serverError)
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
