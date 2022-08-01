const express = require("express");
const { getCategories } = require("./controllers/games.controller");

const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "not found" });
});

app.use((err, req, res, next) => {
  res.status(err.code).send({ msg: err.msg });
});

module.exports = app;
