const {
  getReviews,
  getReviewById,
  getCommentsByReviewId,
  patchReviewById,
  postReviewCommentById,
} = require("../controllers/games.controllers");

const reviewRouter = require("express").Router();

reviewRouter.get("/", getReviews);

reviewRouter.route("/:review_id").get(getReviewById).patch(patchReviewById);

reviewRouter
  .route("/:review_id/comments")
  .get(getCommentsByReviewId)
  .post(postReviewCommentById);

module.exports = reviewRouter;
