const request = require("supertest");
const app = require("../app");
const seedDB = require("../db/seeds/run-seed");

beforeEach(() => {
  return seedDB;
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
          expect(body.categories.length).toBe(7);
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
