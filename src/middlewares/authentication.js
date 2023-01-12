const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { sendError, customError } = require("../utils/helpers.utils");

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      customError(400, "authorization headers is required!");
    }
    const verifyToken = jwt.verify(token, process.env.SECRET_JWT_KEY);

    const rootUser = await User.findOne({ username: verifyToken.username });
    // console.log("rootUser", rootUser);
    if (!rootUser) {
      customError(401, "Authentication failed!");
    } else {
      req.rootUser = rootUser;
      req.isSeller = rootUser.role === "seller";
      next();
    }
  } catch (err) {
    sendError(err, res);
  }
};

module.exports = authenticate;
