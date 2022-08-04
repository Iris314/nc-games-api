const { getUsers } = require("../controllers/user.controllers");

const userRouter = require("express").Router();

userRouter.get("/", getUsers);

module.exports = userRouter;
