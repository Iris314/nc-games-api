const { selectUsers, selectUserById } = require("../models/user.models");

exports.getUsers = (req, res) => {
  selectUsers().then((users) => res.status(200).send({ users }));
};

exports.getUserById = (req, res, next) => {
  const username = req.params.username;
  selectUserById(username)
    .then((user) => res.status(200).send({ user }))
    .catch(next);
};
