const { selectCategories, selectReviewById } = require("../models/games.model");

exports.getCategories = (req, res) => {
  selectCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};

exports.getReviewById = (req, res, next) => {
  const reviewId = req.params.review_id;
  selectReviewById(reviewId)
    .then((review) => {
      if (review.lenght === 0) {
        console.log("hi");
      }
      res.status(200).send({ review });
    })
    .catch(next);
};
