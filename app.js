const express = require("express");
const {
  getCategories,
  getReviewById,
} = require("./controllers/games.controller");

const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewById);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "URL path not found" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "bad request" });
  } else next(err);
});

app.use((err, req, res, next) => {
  res.status(err.code).send({ msg: err.msg });
});

module.exports = app;
