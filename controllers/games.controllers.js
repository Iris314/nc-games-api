const {
  selectCategories,
  selectReviews,
  selectReviewById,
  changeReviewById,
  selectCommentsByReviewId,
  addReviewCommentById,
  removeCommentById,
  selectApi,
  changeCommentById,
} = require("../models/games.model");

exports.getApi = (req, res) => {
  selectApi().then((endpoints) => {
    const parsedEndpoints = JSON.parse(endpoints);
    res.status(200).send({ endpoints: parsedEndpoints });
  });
};

exports.getCategories = (req, res) => {
  selectCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};

exports.getReviews = (req, res, next) => {
  const sortBy = req.query.sort_by;
  const order = req.query.order;
  const category = req.query.category;

  selectReviews(sortBy, order, category)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch(next);
};

exports.getReviewById = (req, res, next) => {
  const reviewId = req.params.review_id;
  selectReviewById(reviewId)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.getCommentsByReviewId = (req, res, next) => {
  const reviewId = req.params.review_id;
  selectCommentsByReviewId(reviewId)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.patchReviewById = (req, res, next) => {
  const reviewId = req.params.review_id;
  const vote = req.body.inc_votes;
  changeReviewById(reviewId, vote)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.postReviewCommentById = (req, res, next) => {
  const reviewId = req.params.review_id;
  const comment = {
    username: req.body.username,
    body: req.body.body,
  };

  addReviewCommentById(reviewId, comment)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      if (err.code === "23503") {
        res.status(400).send({ msg: "invalid username" });
      } else if (err.code === "23502") {
        res.status(400).send({ msg: "bad request" });
      } else next(err);
    });
};

exports.deleteCommentById = (req, res, next) => {
  const commentId = req.params.comment_id;
  removeCommentById(commentId)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.patchCommentById = (req, res, next) => {
  const reviewId = req.params.comment_id;
  const vote = req.body.inc_votes;
  changeCommentById(reviewId, vote)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};
