/**
 * Created by Greg on 4/15/2016.
 */

const mapError   = require('../lib/responseUtils.js').mapError;

module.exports = {
  findOne(req, res) {
    const id = req.allParams().id;
    return Posting.getById(id).then((posting) => {
      if (posting) {
        return res.ok(posting);
      }

      return res.notFound();
    }).catch(res.serverError);
  },

  create(req, res) {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.badRequest('400 Bad Request: Posting must include body');
    }

    return Posting.create(req.body).exec((error, posting) => {
      if (error) {
        return mapError(error, res);
      }

      return Posting.getById(posting.id)
        .then(res.created)
        .catch(err => mapError(err, res));
    });
  },
};
