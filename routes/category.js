const express = require("express");
const { addCategory, getCategories } = require("../controller/category");
const {
  requireSignin,
  adminMiddleware,
} = require("../common middleware/index");
const {
  validateCategoryRequest,
  isCategoryValid,
} = require("../validatiors/category");
const { uploadMiddleware } = require("../common middleware/uploadMiddleware");

const router = express.Router();

router.post(
  "/category/create",
  requireSignin,
  adminMiddleware,
  uploadMiddleware("categoryImage", "single"),
  validateCategoryRequest,
  isCategoryValid,
  addCategory
);

router.get("/category/getcategory", getCategories);

module.exports = router;
