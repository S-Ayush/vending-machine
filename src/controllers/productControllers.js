const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  customError,
  sendError,
  verifySeller
} = require("../utils/helpers.utils");
const Product = require("../models/productModel");

const getProducts = async (req, res) => {
  try {
    const id = req.query.id;
    const page = req.query.page ? req.query.page : 1;
    const limit = req.query.limit ? req.query.limit : 10;
    if (id) {
      const product = await Product.findById(id);
      res.status(200).json(product);
    } else {
      const productCount = await Product.count();
      const product = await Product.find()
        .skip((page - 1) * limit)
        .limit(limit);
      res.status(200).json({
        totalPage: Math.ceil(productCount / limit),
        products: product
      });
    }
  } catch (err) {
    sendError(err, res);
  }
};

const addProduct = async (req, res) => {
  try {
    verifySeller(req.isSeller);
    const sellerld = req.rootUser._id;
    let { amountAvailable, cost, productName } = req.body;
    if (!amountAvailable && amountAvailable != 0) {
      customError(400, "amountAvailable is Required!");
    }
    if (
      !amountAvailable ||
      isNaN(amountAvailable) ||
      !Number.isInteger(amountAvailable) ||
      amountAvailable <= 0
    ) {
      customError(400, "Invalid amountAvailable!");
    }
    if (cost === undefined || isNaN(cost) || parseInt(cost) < 0) {
      customError(400, "Invalid cost !");
    }
    if (!productName) {
      customError(400, "productName is required !");
    }

    const product = Product({
      sellerld,
      amountAvailable: parseFloat(amountAvailable),
      cost: parseFloat(cost),
      productName
    });
    const resp = await product.save();
    res.status(200).json(resp);
  } catch (err) {
    sendError(err, res);
  }
};

const updateProduct = async (req, res) => {
  try {
    verifySeller(req.isSeller);
    const updateId = req.query.id;
    let { amountAvailable, cost, productName } = req.body;
    if (
      !amountAvailable &&
      amountAvailable != 0 &&
      !cost &&
      cost != 0 &&
      !productName
    ) {
      customError(400, "update atleast one field !");
    }
    if (!updateId) {
      customError(400, "id is required !");
    }
    if (
      amountAvailable &&
      amountAvailable !== 0 &&
      (isNaN(amountAvailable) ||
        !Number.isInteger(amountAvailable) ||
        amountAvailable < 0)
    ) {
      customError(400, "Invalid amountAvailable !");
    }
    if (cost && cost !== 0 && (isNaN(cost) || parseInt(cost) < 0)) {
      customError(400, "Invalid cost !");
    }
    const product = await Product.findByIdAndUpdate(updateId, {
      amountAvailable: amountAvailable ? parseInt(amountAvailable) : undefined,
      cost: cost ? parseFloat(cost) : undefined,
      productName
    });
    if (product) {
      res.status(200).send("Product updated successfully !");
    } else {
      res.status(200).send("Product doesn't exist !");
    }
  } catch (err) {
    sendError(err, res);
  }
};

const deleteProduct = async (req, res) => {
  try {
    verifySeller(req.isSeller);
    const deleteId = req.query.id;
    if (!deleteId) {
      customError(400, "id is required !");
    }
    const product = await Product.findByIdAndDelete(deleteId);
    if (product) {
      res.status(200).send("product deleted successfully !");
    } else {
      res.status(200).send("product doesn't exist !");
    }
  } catch (err) {
    sendError(err, res);
  }
};

module.exports = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct
};
