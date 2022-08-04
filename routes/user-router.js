const { getUsers, getUserById } = require("../controllers/user.controllers");

const userRouter = require("express").Router();

userRouter.get("/", getUsers);
userRouter.get("/:username", getUserById);

module.exports = userRouter;
