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
apiRouter.use("/categories", categoryRouter);
apiRouter.use("/users", userRouter);

module.exports = apiRouter;
