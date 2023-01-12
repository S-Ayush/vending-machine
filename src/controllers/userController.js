const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  customError,
  sendError,
  verifySeller
} = require("../utils/helpers.utils");

const userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username) {
      customError(400, "username is required !");
    }
    if (!password) {
      customError(400, "password is required !");
    }
    const userExist = await User.findOne({ username });
    if (userExist) {
      const isMatch = await bcrypt.compare(password, userExist.password);
      if (!isMatch) {
        res.status(422).json({ err: "invalid credentials" });
      } else {
        const jwtToken = jwt.sign({ username }, process.env.SECRET_JWT_KEY);
        res.status(200).json({ Message: "successfull", jwtToken });
      }
    } else {
      res.status(422).json({ err: "invalid credentials" });
    }
  } catch (err) {
    sendError(err, res);
  }
};

const getUsers = async (req, res) => {
  try {
    verifySeller(req.isSeller);
    const id = req.query.id;
    if (id) {
      const user = await User.findById(id);
      res.status(200).json(user);
    } else {
      const user = await User.find();
      res.status(200).json(user);
    }
  } catch (err) {
    sendError(err, res);
  }
};

const registerUser = async (req, res) => {
  try {
    let { username, password, deposit, role } = req.body;
    if (username) {
      const user = await User.find({ username });
      if (user.length) {
        customError(400, "User already exist !");
      }
    } else {
      customError(400, "username is required !");
    }
    if (!password) {
      customError(400, "password is required !");
    }
    if (deposit === undefined || isNaN(deposit) || parseInt(deposit) < 0) {
      customError(400, "Invalid deposit amount!");
    }
    if (!role) {
      customError(400, "role is required !");
    }
    if (role.toLowerCase() !== "buyer" && role.toLowerCase() !== "seller") {
      customError(400, "role should be buyer or seller !");
    }
    password = await bcrypt.hash(password, 12);
    const user = User({
      username,
      password,
      deposit: parseInt(deposit),
      role: role.toLowerCase()
    });
    let resp = await user.save();
    res.status(200).json(resp);
  } catch (err) {
    sendError(err, res);
  }
};

const updateUser = async (req, res) => {
  try {
    verifySeller(req.isSeller);
    let { username, password, deposit, role } = req.body;
    const updateId = req.query.id;
    if (!updateId) {
      customError(400, "id is required !");
    }
    if (!username && !password && !deposit && deposit != 0 && !role) {
      customError(400, "update atleast one field !");
    }
    if (deposit && deposit != 0 && (isNaN(deposit) || parseInt(deposit) < 0)) {
      customError(400, "Invalid deposit amount!");
    }
    if (
      role &&
      role.toLowerCase() !== "buyer" &&
      role.toLowerCase() !== "seller"
    ) {
      customError(400, "role should be buyer or seller !");
    }
    if (password) {
      password = await bcrypt.hash(password, 12);
    }
    const user = await User.findByIdAndUpdate(updateId, {
      username,
      password,
      deposit: deposit ? parseInt(deposit) : undefined,
      role: role ? role.toLowerCase() : undefined
    });
    if (user) {
      res.status(200).send("User updated successfully !");
    } else {
      res.status(200).send("User doesn't exist !");
    }
  } catch (err) {
    sendError(err, res);
  }
};

const deleteUser = async (req, res) => {
  try {
    verifySeller(req.isSeller);
    const deleteId = req.query.id;
    if (!deleteId) {
      customError(400, "id is required !");
    }
    const user = await User.findByIdAndDelete(deleteId);
    if (user) {
      res.status(200).send("User deleted successfully !");
    } else {
      res.status(200).send("User doesn't exist !");
    }
  } catch (err) {
    sendError(err, res);
  }
};

module.exports = {
  userLogin,
  registerUser,
  updateUser,
  getUsers,
  deleteUser
};
