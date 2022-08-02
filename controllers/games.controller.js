const {
  selectCategories,
  selectReviews,
  selectReviewById,
  changeReviewById,
} = require("../models/games.model");

exports.getCategories = (req, res) => {
  selectCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};

exports.getReviews = (req, res, next) => {
  selectReviews().then((reviews) => {
    res.status(200).send({ reviews });
  });
};

exports.getReviewById = (req, res, next) => {
  const reviewId = req.params.review_id;
  selectReviewById(reviewId)
    .then((review) => {
      res.status(200).send({ review });
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
