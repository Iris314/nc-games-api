const apiRouter = require("express").Router();
const { getApi } = require("../controllers/games.controller");

const {
  categoryRouter,
  commentRouter,
  reviewRouter,
  userRouter,
} = require("./");

apiRouter.get("/", getApi);
apiRouter.use("/reviews", reviewRouter);
apiRouter.use("/comments", commentRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/categories", categoryRouter);

module.exports = apiRouter;
