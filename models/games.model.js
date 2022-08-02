const db = require("../db/connection");

exports.selectCategories = () => {
  return db.query("SELECT * FROM categories;").then(({ rows }) => rows);
};

exports.selectReviewById = (reviewId) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1;`, [reviewId])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ code: 404, msg: "review not found" });
      }
      return rows[0];
    });
};

exports.changeReviewById = (reviewId, votes) => {
  if (parseInt(votes)) {
    return db
      .query(
        `UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 Returning*;`,
        [votes, reviewId]
      )
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({ code: 404, msg: "review not found" });
        }
        return rows[0];
      });
  } else {
    return Promise.reject({ code: 400, msg: "bad request" });
  }
};
