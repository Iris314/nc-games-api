const { getCategories } = require("../controllers/games.controller");

const categoryRouter = require("express").Router();

categoryRouter.get("/", getCategories);

module.exports = categoryRouter;
