const router = require("express").Router();
const user = require("./user");
const category = require("./category");
const product = require("./product");
const sale = require("./sale");
const returns = require("./return");

router.use("/user", user);
router.use("/category", category);
router.use("/product", product);
router.use("/sale", sale);
router.use("/returns", returns);

module.exports = { router };
