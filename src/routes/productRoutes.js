const express = require("express");
const {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/productControllers");

const authenticate = require("../middlewares/authentication");

const productRoutes = express.Router();
productRoutes.use(authenticate);

productRoutes.get("/", getProducts);
productRoutes.post("/", addProduct);
productRoutes.put("/", updateProduct);
productRoutes.delete("/", deleteProduct);

module.exports = productRoutes;
