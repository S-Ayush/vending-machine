const express = require("express");
const {
  getUsers,
  registerUser,
  updateUser,
  deleteUser
} = require("../controllers/userController");

const authenticate = require("../middlewares/authentication");
const userRoutes = express();

userRoutes.get("/", authenticate, getUsers);
userRoutes.post("/", registerUser);
userRoutes.put("/", authenticate, updateUser);
userRoutes.delete("/", authenticate, deleteUser);

module.exports = userRoutes;
