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
      .then(({ body }) => {
        expect(body.msg).toBe("URL path not found");
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
        .then(({ body }) => {
          body.categories.forEach((category) => {
            expect(category).toHaveProperty(("slug", "description"));
          });
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
        .then(({ body }) => {
          expect(body.review).toEqual(expected);
        });
    });
    test("non-existing review id results in status 404 - msg 'review not found", () => {
      return request(app)
        .get("/api/reviews/1000")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toEqual("review not found");
        });
    });
    test("non-numeric review id results in status 400 - msg 'bad request", () => {
      return request(app)
        .get("/api/reviews/review1")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual("bad request");
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
        .then(({ body }) => {
          expect(body.review).toEqual(expected);
        });
    });
    test("non-existing review id results in status 404 - msg 'review not found", () => {
      return request(app)
        .patch("/api/reviews/1000")
        .send(update)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toEqual("review not found");
        });
    });
    test("non-numeric review id results in status 400 - msg 'bad request", () => {
      return request(app)
        .patch("/api/reviews/review1")
        .send(update)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual("bad request");
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
        .then(({ body }) => {
          expect(body.msg).toEqual("bad request");
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

describe("/api/users", () => {
  test("GET /api/users", () => {
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

describe("/api/users", () => {
  test("GET /api/users", () => {
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
