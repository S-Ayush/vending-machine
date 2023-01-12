const express = require("express");
const { userLogin } = require("../controllers/userController");
const actionRoutes = require("./actionRoutes");
const productRoutes = require("./productRoutes");

const userRoutes = require("./userRoutes");
const router = express.Router();

router.post("/api/login", userLogin);
router.use("/api/user", userRoutes);
router.use("/api/product", productRoutes);
router.use("/api/action", actionRoutes);

module.exports = router;
