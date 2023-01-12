const Product = require("../models/productModel");
const User = require("../models/userModel");
const {
  customError,
  sendError,
  verifyBuyer
} = require("../utils/helpers.utils");

const deposit = async (req, res) => {
  try {
    verifyBuyer(req.isSeller);

    const userId = req.rootUser._id;
    const { two, five, ten, twenty, fifty, hundred } = req.body;
    let despositAmount = 0;

    Object.keys(req.body).forEach((coins) => {
      if (
        !["two", "five", "ten", "twenty", "fifty", "hundred"].includes(coins)
      ) {
        customError(
          400,
          `coins of ${coins} are not allowed. You can only deposit coins of  two,five,ten,twenty,fifty or hundred`
        );
      }
    });

    if (!two && !five && !ten && !twenty && !fifty && !hundred) {
      customError(
        400,
        "Deposit atleast one coin of two,five,ten,twenty,fifty or hundred"
      );
    }

    Object.entries({
      2: two,
      5: five,
      10: ten,
      20: twenty,
      50: fifty,
      100: hundred
    }).forEach((entry) => {
      if (entry[1] && entry[1] != 0) {
        if (isNaN(entry[1]) || !Number.isInteger(entry[1]) || entry[1] < 0) {
          customError(
            400,
            "You have entered invalid no of Coin. Please Enter Valid Count of each coin."
          );
        }
        despositAmount = entry[0] * entry[1] + despositAmount;
      }
    });
    const user = await User.findByIdAndUpdate(userId, {
      $inc: { deposit: despositAmount }
    });
    if (user) {
      res.status(200).json({
        depositAmount: despositAmount,
        totalAvailableDeposit: user.deposit + despositAmount
      });
    } else {
      customError(402, "user Doesn't Exist");
    }
  } catch (err) {
    sendError(err, res);
  }
};

const buyProduct = async (req, res) => {
  try {
    verifyBuyer(req.isSeller);
    const { productId, quantity } = req.body;
    const userId = req.rootUser._id;
    if (!productId) {
      customError(400, "productId is required!");
    }
    if (!quantity && quantity != 0) {
      customError(400, "quantity is required!");
    }
    if (
      !quantity ||
      isNaN(quantity) ||
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      customError(400, "Invalid quantity!");
    }
    let product = await Product.findById(productId);
    let user = await User.findById(userId);
    if (!product) {
      customError(400, "Invalid productId!");
    }
    if (product.amountAvailable < quantity) {
      customError(
        400,
        `Available quantity of this product is ${product.amountAvailable}.`
      );
    }
    if (user.deposit < product.cost * quantity) {
      customError(
        400,
        "You don't have sufficient deposit to buy this product!"
      );
    }
    const reduceProductAvailableAmount = await Product.findByIdAndUpdate(
      productId,
      { $inc: { amountAvailable: -quantity } }
    );
    const reduceUserDeposit = await User.findByIdAndUpdate(userId, {
      $inc: { deposit: -(product.cost * quantity) }
    });
    let change = { five: 0, ten: 0, twenty: 0, fifty: 0, hundred: 0 };
    let remainingDeposit = user.deposit - product.cost * quantity;
    while (remainingDeposit >= 5) {
      if (remainingDeposit >= 100) {
        change.hundred = parseInt(remainingDeposit / 100);
        remainingDeposit = remainingDeposit % 100;
      } else if (remainingDeposit >= 50) {
        change.fifty = parseInt(remainingDeposit / 50);
        remainingDeposit = remainingDeposit % 50;
      } else if (remainingDeposit >= 20) {
        change.twenty = parseInt(remainingDeposit / 20);
        remainingDeposit = remainingDeposit % 20;
      } else if (remainingDeposit >= 10) {
        change.ten = parseInt(remainingDeposit / 10);
        remainingDeposit = remainingDeposit % 10;
      } else if (remainingDeposit >= 5) {
        change.five = parseInt(remainingDeposit / 5);
        remainingDeposit = remainingDeposit % 5;
      } else {
        remainingDeposit = 0;
      }
    }
    res.status(200).json({
      totalSpent: product.cost * quantity,
      product: product.productName,
      remainingDeposit: user.deposit - product.cost * quantity,
      change
    });
  } catch (err) {
    sendError(err, res);
  }
};

const resetDeposit = async (req, res) => {
  try {
    verifyBuyer(req.isSeller);
    const userId = req.rootUser._id;
    const user = await User.findByIdAndUpdate(userId, {
      deposit: 0
    });
    if (user) {
      res.status(200).send("Your deposit is Reset.");
    } else {
      customError(402, "user Doesn't Exist");
    }
  } catch (err) {
    sendError(err, res);
  }
};

module.exports = { deposit, resetDeposit, buyProduct };
