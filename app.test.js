const request = require("supertest");
const { describe, expect, test } = require("@jest/globals");
const app = require("./app");
const User = require("./src/models/userModel");


const sellerToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRlbW9TZWxsZXJVc2VyIiwiaWF0IjoxNjcwNDEzNTYwfQ.nxYzLivTr1WtfSdjoyv50j3buht0LTP5KnSC3C-xxyw";
const buyerToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRlbW9CdXllclVzZXIiLCJpYXQiOjE2NzA0MTU5MjZ9.Ak_y9Wravn7Z877ILg-Nru7JSEBreXe8Lq0hCtKbx5c";
let userId = "";
let productId = "";
afterAll(async () => {
  await User.findOneAndDelete({ username: "demoBuyerUser" });
});

// beforeEach(async () => {
//   let user = await User.findOne({ username: "demoSellerUser" });
//   userId = user._id;
// });

describe("post /user", () => {
  describe("add Seller", () => {
    test("Should respond with 200 status code", async () => {
      let res = await request(app).post("/api/user").send({
        username: "demoSellerUser",
        password: "demoUser",
        deposit: 0,
        role: "Seller"
      });
      expect(res.statusCode).toBe(200);
      userId = res._body._id;
    });
  });
  describe("add buyer", () => {
    test("Should respond with 200 status code", async () => {
      let res = await request(app).post("/api/user").send({
        username: "demoBuyerUser",
        password: "demoUser",
        deposit: 0,
        role: "Buyer"
      });
      expect(res.statusCode).toBe(200);
    });
  });
});
describe("get /user", () => {
  test("Should respond with 200 status code", async () => {
    const res = await request(app)
      .get("/api/user")
      .send()
      .set("Authorization", sellerToken);
    expect(res.statusCode).toBe(200);
  });
});

describe("update /user", () => {
  test("Should respond with 200 status code", async () => {
    const res = await request(app)
      .put(`/api/user?id=${userId}`)
      .send({ deposit: 100 })
      .set("Authorization", sellerToken);
    expect(res.statusCode).toBe(200);
  });
});

describe("post /product", () => {
  test("Should respond with 200 status code", async () => {
    let res = await request(app)
      .post("/api/product")
      .send({
        amountAvailable: 2,
        cost: 748.95,
        productName: "demo Product"
      })
      .set("Authorization", sellerToken);
    expect(res.statusCode).toBe(200);
    productId = res._body._id;
  });
});
describe("get /product", () => {
  test("Should respond with 200 status code", async () => {
    const res = await request(app)
      .get("/api/product")
      .send()
      .set("Authorization", sellerToken);
    expect(res.statusCode).toBe(200);
  });
});

describe("update /product", () => {
  test("Should respond with 200 status code", async () => {
    const res = await request(app)
      .put(`/api/product?id=${productId}`)
      .send({ amountAvailable: 2, cost: 142.95, productName: "demo Product" })
      .set("Authorization", sellerToken);
    expect(res.statusCode).toBe(200);
  });
});

describe("post /deposit", () => {
  test("Should respond with 200 status code", async () => {
    const res = await request(app)
      .post("/api/action/deposit")
      .send({
        two: 5,
        five: 2,
        ten: 3,
        twenty: 4,
        fifty: 6,
        hundred: 8
      })
      .set("Authorization", buyerToken);
    expect(res.statusCode).toBe(200);
  });
});

describe("post /buy", () => {
  test("Should respond with 200 status code", async () => {
    const res = await request(app)
      .post("/api/action/buy")
      .send({ productId: productId, quantity: 2 })
      .set("Authorization", buyerToken);
    expect(res.statusCode).toBe(200);
  });
});

describe("post /reset", () => {
  test("Should respond with 200 status code", async () => {
    const res = await request(app)
      .post("/api/action/reset")
      .send()
      .set("Authorization", buyerToken);
    expect(res.statusCode).toBe(200);
  });
});

describe("delete /product", () => {
  test("Should respond with 200 status code", async () => {
    const res = await request(app)
      .delete(`/api/product?id=${productId}`)
      .send()
      .set("Authorization", sellerToken);
    expect(res.statusCode).toBe(200);
  });
});

describe("delete /user", () => {
  test("Should respond with 200 status code", async () => {
    const res = await request(app)
      .delete(`/api/user?id=${userId}`)
      .send()
      .set("Authorization", sellerToken);
    expect(res.statusCode).toBe(200);
  });
});
