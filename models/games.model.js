const db = require("../db/connection");

exports.selectCategories = () => {
  return db.query("SELECT * FROM categories;").then(({ rows }) => rows);
};

exports.selectReviews = () => {
  return db
    .query(
      `SELECT title, reviews.review_id, review_img_url, reviews.votes, category, reviews.owner, reviews.created_at, designer,
      COUNT(comment_id) AS comment_count FROM reviews 
      LEFT JOIN comments ON comments.review_id = reviews.review_id
      GROUP BY reviews.review_id`
    )
    .then(({ rows }) => rows);
};

exports.selectReviewById = (reviewId) => {
  return db
    .query(
      `SELECT reviews.review_id, title, review_body, designer, review_img_url, reviews.votes, category, owner, reviews.created_at, 
      COUNT(comment_id) AS comment_count FROM reviews 
      LEFT JOIN comments ON comments.review_id = reviews.review_id
      GROUP BY reviews.review_id
      HAVING reviews.review_id = $1`,
      [reviewId]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ code: 404, msg: "review not found" });
      }
      return rows[0];
    });
};

exports.changeReviewById = (reviewId, votes) => {
  if (votes) {
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
    return db
      .query(`SELECT * FROM reviews WHERE review_id = $1;`, [reviewId])
      .then(({ rows }) => rows[0]);
  }
};
