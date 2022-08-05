const { getCategories } = require("../controllers/games.controllers");

const categoryRouter = require("express").Router();

categoryRouter.get("/", getCategories);

module.exports = categoryRouter;
