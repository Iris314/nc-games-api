const { selectUsers } = require("../models/user.models");

exports.getUsers = (req, res) => {
  selectUsers().then((users) => res.status(200).send({ users }));
};
