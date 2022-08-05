const {
  getReviews,
  getReviewById,
  getCommentsByReviewId,
  patchReviewById,
  postReviewCommentById,
  postReview,
} = require("../controllers/games.controllers");

const reviewRouter = require("express").Router();

reviewRouter.route("/").get(getReviews).post(postReview);

reviewRouter.route("/:review_id").get(getReviewById).patch(patchReviewById);

reviewRouter
  .route("/:review_id/comments")
  .get(getCommentsByReviewId)
  .post(postReviewCommentById);

module.exports = reviewRouter;
