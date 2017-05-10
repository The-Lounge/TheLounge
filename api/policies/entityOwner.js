/**
 * entityOwner
 *
 * @module      :: Policy
 * @description :: Policy that checks if the creator of an entity is authenticated
 */
module.exports = (req, res, next) => {
  // User is allowed, proceed to the next policy,
  // or if this is the last policy, the controller
  const id = req.allParams().id || req.body.id;
  Posting.getById(id).then((posting) => {
    // eventually admins will be able to update posting's that are not their own
    if (posting.sellerId === req.session.user.id || process.env.NODE_ENV === 'mock') {
      next();
    } else {
      // User is not allowed
      // (default res.forbidden() behavior can be overridden in `config/403.js`)
      res.forbidden('You are not permitted to perform this action.');
    }
  });
};
