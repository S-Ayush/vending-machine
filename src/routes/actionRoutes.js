const express = require("express");
const {
  deposit,
  resetDeposit,
  buyProduct
} = require("../controllers/actionControllers");

const authenticate = require("../middlewares/authentication");

const actionRoutes = express.Router();
actionRoutes.use(authenticate);

actionRoutes.post("/deposit", deposit);
actionRoutes.post("/reset", resetDeposit);
actionRoutes.post("/buy", buyProduct);

module.exports = actionRoutes;
