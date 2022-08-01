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
          const mappedCategories = [];
          body.categories.map((category) => {
            mappedCategories.push({
              slug: category.slug,
              description: category.description,
            });
          });
          expect(body.categories).toEqual(mappedCategories);
        });
    });
  });
});

describe("/api/reviews/:review_id", () => {
  test("existing review id results in status 200 - responds with the correct review object", () => {
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
      votes: 1,
    };
    return request(app)
      .get("/api/reviews/1")
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
  test("non-numeric review id results in status 400 - msg 'invalid request", () => {
    return request(app)
      .get("/api/reviews/review1")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("bad request");
      });
  });
});
