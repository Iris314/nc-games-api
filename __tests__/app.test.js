const request = require("supertest");
const app = require("../app");
const seedDB = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");

beforeEach(() => {
  return seedDB(data);
});

afterAll(() => {
  return db.end();
});

describe("/api/non-existing-route", () => {
  test("non-existing route gives status 404, has message: 'not found", () => {
    return request(app)
      .get("/api/non-existing-route")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("URL path not found");
      });
  });
});

describe("/api", () => {
  test("/api responds with status 200 with a json object of endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints["GET /api"].description).toBe(
          "serves up a json representation of all the available endpoints of the api"
        );
      });
  });
});

describe("/api/categories", () => {
  describe("GET", () => {
    test("status 200 - responds with an array of category objects", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body }) => {
          expect(Object.keys(body)).toEqual(["categories"]);
          expect(body.categories.length).toBe(4);
        });
    });
    test("status 200 - categories have a 'slug' and 'description' property", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body: { categories } }) => {
          categories.forEach((category) => {
            expect(category).toHaveProperty(("slug", "description"));
          });
        });
    });
  });
});

describe("/api/reviews", () => {
  test("GET /api/reviews results in status 200 with array of review objects", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews.length).toBe(13);
        reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              owner: expect.any(String),
              title: expect.any(String),
              review_id: expect.any(Number),
              category: expect.any(String),
              review_img_url: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              designer: expect.any(String),
              comment_count: expect.any(String),
            })
          );
        });
      });
  });
  test("reviews are by defauilt sorted in descending order", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeSorted({ descending: true });
      });
  });
  describe("queries", () => {
    test("reviews are by sorted in ascending order when queried", () => {
      return request(app)
        .get("/api/reviews?order=asc")
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toBeSorted({ descending: false });
        });
    });
    test("reviews are by ordered by date by default", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toBeSorted({ descending: true, key: "created_at" });
        });
    });
    test("reviews are ordered by title when queried", () => {
      return request(app)
        .get("/api/reviews?sort_by=title")
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toBeSorted({ descending: true, key: "title" });
        });
    });
    test("reviews are ordered by title ascendingly when queried", () => {
      return request(app)
        .get("/api/reviews?sort_by=title&order=asc")
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toBeSorted({ descending: false, key: "title" });
        });
    });
    test("reviews are filterd by category dexterity when queried", () => {
      const expected = {
        title: "Jenga",
        designer: "Leslie Scott",
        owner: "philippaclaire9",
        review_id: 2,
        review_img_url:
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        category: "dexterity",
        votes: 5,
        comment_count: "3",
        created_at: "2021-01-18T10:01:41.251Z",
      };
      return request(app)
        .get("/api/reviews?category=dexterity")
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews.length).toBe(1);
          expect(reviews[0]).toEqual(expected);
        });
    });
  });
  describe("errors", () => {
    test("invalid order results in code 400 - msg: bad request", () => {
      return request(app)
        .get("/api/reviews?order=invalid")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
    test("invalid sorter results in code 400 - msg: bad request", () => {
      return request(app)
        .get("/api/reviews?sort_by=invalid")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("bad request");
        });
    });
    test("invalid category results in code 404 - msg: reviews not found", () => {
      return request(app)
        .get("/api/reviews?category=invalid")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("reviews not found");
        });
    });
    test("a valid category with no associated reviews results in 404- msg: reviews not found ", () => {
      return request(app)
        .get("/api/reviews?category=children%27s%20games")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("reviews not found");
        });
    });
  });
});

describe("/api/reviews/:review_id", () => {
  describe("GET", () => {
    test("existing review id results in status 200 - responds with the correct review object", () => {
      const expected = {
        title: "Jenga",
        designer: "Leslie Scott",
        owner: "philippaclaire9",
        review_img_url:
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        review_body: "Fiddly fun for all the family",
        category: "dexterity",
        created_at: "2021-01-18T10:01:41.251Z",
        votes: 5,
        comment_count: "3",
        review_id: 2,
      };
      return request(app)
        .get("/api/reviews/2")
        .expect(200)
        .then(({ body: { review } }) => {
          expect(review).toEqual(expected);
        });
    });
    test("non-existing review id results in status 404 - msg 'review not found", () => {
      return request(app)
        .get("/api/reviews/1000")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toEqual("review not found");
        });
    });
    test("non-numeric review id results in status 400 - msg 'bad request", () => {
      return request(app)
        .get("/api/reviews/review1")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toEqual("bad request");
        });
    });
  });
  describe("PATCH", () => {
    const update = {
      inc_votes: 4,
    };
    test("existing review id results in status 200 - responds with the updated correct review object", () => {
      const expected = {
        title: "Agricola",
        designer: "Uwe Rosenberg",
        owner: "mallionaire",
        review_img_url:
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        review_body: "Farmyard fun!",
        review_id: 1,
        category: "euro game",
        created_at: "2021-01-18T10:00:20.514Z",
        votes: 5,
      };
      return request(app)
        .patch("/api/reviews/1")
        .send(update)
        .expect(200)
        .then(({ body: { review } }) => {
          expect(review).toEqual(expected);
        });
    });
    test("non-existing review id results in status 404 - msg 'review not found", () => {
      return request(app)
        .patch("/api/reviews/1000")
        .send(update)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toEqual("review not found");
        });
    });
    test("non-numeric review id results in status 400 - msg 'bad request", () => {
      return request(app)
        .patch("/api/reviews/review1")
        .send(update)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toEqual("bad request");
        });
    });
    test("non-numeric vote results in status 400 - msg 'bad request", () => {
      const wrongUpdate1 = {
        inc_votes: "invalid",
      };
      return request(app)
        .patch("/api/reviews/1")
        .send(wrongUpdate1)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toEqual("bad request");
        });
    });
    test("invalid request key results in status 200 - unchanged object", () => {
      const wrongUpdate2 = {
        invalid: 4,
      };
      return request(app)
        .patch("/api/reviews/1")
        .send(wrongUpdate2)
        .expect(200)
        .then(({ body: { review } }) => {
          expect(review).toHaveProperty(
            ("title",
            "designer",
            "owner",
            "review_img_url",
            "review_body",
            "review_id",
            "category",
            "created_at",
            "votes")
          );
          expect(review.votes).toEqual(1);
        });
    });
  });
});

describe("/api/reviews/:review_id/comments", () => {
  describe("GET", () => {
    test("GET /api/reviews/:review_id/comments results in status 200 with array of comment objects", () => {
      return request(app)
        .get("/api/reviews/2/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).toBe(3);
          comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                review_id: expect.any(Number),
              })
            );
          });
        });
    });
    test("non-existing review id results in status 404 - msg 'review not found", () => {
      return request(app)
        .get("/api/reviews/1000/comments")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toEqual("review not found");
        });
    });
    test("non-numeric review id results in status 400 - msg 'bad request", () => {
      return request(app)
        .get("/api/reviews/review1/comments")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toEqual("bad request");
        });
    });
  });
  describe("POST", () => {
    const comment = {
      username: "dav3rid",
      body: "This is a test comment.",
    };
    const returnedComment = {
      author: "dav3rid",
      body: "This is a test comment.",
      comment_id: 7,
      created_at: expect.any(String),
      review_id: 2,
      votes: 0,
    };
    test("POST /api/reviews/:review_id/comments results in status 200 with the comment object", () => {
      return request(app)
        .post("/api/reviews/2/comments")
        .send(comment)
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment).toEqual(returnedComment);
        });
    });
    test("POST /api/reviews/:review_id/comments stores the new comment", () => {
      return request(app)
        .post("/api/reviews/2/comments")
        .send(comment)
        .expect(200)
        .then(() => {
          return request(app)
            .get("/api/reviews/2/comments")
            .expect(200)
            .then(({ body: { comments } }) => expect(comments.length).toBe(4));
        });
    });
    describe("errors", () => {
      test("non-existing review id results in status 404 - msg 'review not found", () => {
        return request(app)
          .post("/api/reviews/1000/comments")
          .send(comment)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toEqual("review not found");
          });
      });
      test("non-numeric review id results in status 400 - msg 'bad request", () => {
        return request(app)
          .post("/api/reviews/review1/comments")
          .send(comment)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toEqual("bad request");
          });
      });
      test('invalid post username results in status 400 - msg "invalid username"', () => {
        const invalidComment = {
          username: "invalidUsername",
          body: "This is a test comment.",
        };
        return request(app)
          .post("/api/reviews/2/comments")
          .send(invalidComment)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toEqual("invalid username");
          });
      });
      test('invalid post body results in status 400 - msg "bad request"', () => {
        const invalidComment = {
          username: "dav3rid",
          body: null,
        };
        return request(app)
          .post("/api/reviews/2/comments")
          .send(invalidComment)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toEqual("bad request");
          });
      });
      test('empty post object results in status 400 - msg "bad request"', () => {
        const invalidComment = {};
        return request(app)
          .post("/api/reviews/2/comments")
          .send(invalidComment)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toEqual("bad request");
          });
      });
    });
  });
});

describe("/api/comments/:comment_id", () => {
  describe("DELETE ", () => {
    test("returns status 204 with empty response body", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(({ body }) => expect(body).toEqual({}));
    });
    test("deletes the comment from the review", () => {
      return request(app)
        .delete("/api/comments/1")
        .then(() => {
          return request(app)
            .get("/api/reviews/2")
            .expect(200)
            .then(({ body: { review } }) =>
              expect(review.comment_count).toBe("2")
            );
        });
    });
    test("returns status 404 with msg comment not found for non existing comment", () => {
      return request(app)
        .delete("/api/comments/1000")
        .expect(404)
        .then(({ body }) => expect(body.msg).toBe("comment not found"));
    });
    test("returns status 400 with msg bad request for invalid comment id", () => {
      return request(app)
        .delete("/api/comments/invalid")
        .expect(400)
        .then(({ body }) => expect(body.msg).toBe("bad request"));
    });
  });
});

describe("/api/users", () => {
  test("GET /api/users responds with an array of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});
