const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  amountAvailable: {
    type: Number,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  sellerld: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

const Product = mongoose.model("PRODUCT", productSchema);

module.exports = Product;
