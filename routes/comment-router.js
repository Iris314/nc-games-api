const { deleteCommentById } = require("../controllers/games.controller");

const commentRouter = require("express").Router();

commentRouter.delete("/:comment_id", deleteCommentById);

module.exports = commentRouter;
