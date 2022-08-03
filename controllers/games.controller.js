const {
  selectCategories,
  selectReviews,
  selectReviewById,
  changeReviewById,
  selectCommentsByReviewId,
  addReviewCommentById,
  removeCommentById,
} = require("../models/games.model");

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

exports.getReviewByCommentId = (req, res, next) => {
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
      res.status(200).send({ comment });
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
