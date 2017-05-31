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

  update(req, res) {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.badRequest('400 Bad Request: Posting must include body');
    }

    const id = req.body.id;
    if (!id || id !== req.allParams().id) {
      return res.badRequest('400 Bad Request: Posting body id must match parameter id');
    }

    return Posting.getById(id).then((posting) => {
      delete req.body.seller;
      if (posting.seller.id !== req.body.sellerId) {
        return res.badRequest('400 Bad Request: Seller field cannot be modified');
      }

      return Posting.update({id}, req.body).exec((error, updated) => {
        if (error) {
          return mapError(error, res);
        }

        return Posting.getById(updated[0].id).then(res.ok);
      });
    }).catch(err => mapError(err, res));
  },

  getByCategory(req, res) {
    const category = req.allParams().category;
    const pageNum = req.allParams().page || 1;
    const pagination = {page: pageNum, limit: 10};

    let categoryId;
    if (!isNaN(parseInt(category, 10))) {
      categoryId = parseInt(category, 10);
    } else {
      return Category.resolveShortName(category).then((id) => {
        categoryId = id;
        return Posting.findPopulated({categoryId}, pagination).then(res.ok);
      });
    }

    return Posting.findPopulated({categoryId}, pagination).then(res.ok);
  },
};
