const db = require("../db/connection");
const fs = require("fs/promises");

exports.selectApi = () => {
  return fs.readFile(`${__dirname}/../endpoints.json`, "utf-8");
};

exports.selectCategories = () => {
  return db.query("SELECT * FROM categories;").then(({ rows }) => rows);
};

exports.selectReviews = (sortBy = "created_at", order = "desc", category) => {
  const allowedSorters = [
    "title",
    "review_id",
    "review_img_url",
    "votes",
    "category",
    "owner",
    "created_at",
    "designer",
    "comment_count",
  ];
  const allowedOrder = ["desc", "asc"];

  if (category) {
    return db
      .query(
        `SELECT title, reviews.review_id, review_img_url, reviews.votes, category, reviews.owner, reviews.created_at, designer,
      COUNT(comment_id) AS comment_count FROM reviews 
      LEFT JOIN comments ON comments.review_id = reviews.review_id
      GROUP BY reviews.review_id HAVING category = $1
      ORDER BY ${sortBy} ${order};`,
        [category]
      )
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({ code: 404, msg: "reviews not found" });
        }
        return rows;
      });
  } else {
    if (allowedSorters.includes(sortBy) && allowedOrder.includes(order)) {
      return db
        .query(
          `SELECT title, reviews.review_id, review_img_url, reviews.votes, category, reviews.owner, reviews.created_at, designer,
      COUNT(comment_id) AS comment_count FROM reviews 
      LEFT JOIN comments ON comments.review_id = reviews.review_id
      GROUP BY reviews.review_id ORDER BY ${sortBy} ${order};`
        )
        .then(({ rows }) => rows);
    } else {
      return Promise.reject({ code: 400, msg: "bad request" });
    }
  }
};

exports.addReview = (review) => {
  return db
    .query(
      `INSERT INTO reviews (owner, title, review_body, designer, category) 
    VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        review.owner,
        review.title,
        review.review_body,
        review.designer,
        review.category,
      ]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ code: 400, msg: "bad request" });
      }
      const { review_id, votes, created_at } = rows[0];
      return { review_id, votes, created_at, comment_count: 0 };
    });
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

exports.selectCommentsByReviewId = (reviewId) => {
  return db
    .query(`SELECT * FROM comments WHERE review_id = $1`, [reviewId])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ code: 404, msg: "review not found" });
      }
      return rows;
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

exports.addReviewCommentById = (review_id, comment) => {
  return db
    .query("SELECT * FROM reviews WHERE review_id = $1", [review_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ code: 404, msg: "review not found" });
      } else if (comment.body === "") {
        return Promise.reject({ code: 400, msg: "body can not be empty" });
      } else {
        return db
          .query(
            `INSERT INTO comments (body, author, review_id) VALUES ($1, $2, $3) RETURNING*`,
            [comment.body, comment.username, review_id]
          )
          .then(({ rows }) => {
            return rows[0];
          });
      }
    });
};

exports.removeCommentById = (commentId) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING*`, [commentId])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ code: 404, msg: "comment not found" });
      }
    });
};

exports.changeCommentById = (commentId, votes) => {
  if (votes) {
    return db
      .query(
        `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING*`,
        [votes, commentId]
      )
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({ code: 404, msg: "comment not found" });
        }
        return rows[0];
      });
  } else {
    return db
      .query(`SELECT * FROM comments WHERE comment_id = $1`, [commentId])
      .then(({ rows }) => rows[0]);
  }
};
