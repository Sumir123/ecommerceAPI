const express = require("express");
const { addCategory, getCategories } = require("../controller/category");
const {
  requireSignin,
  adminMiddleware,
} = require("../common middleware/index");
const shortid = require("shortid");
const path = require("path");
const multer = require("multer");
const {
  validateCategoryRequest,
  isCategoryValid,
} = require("../validatiors/category");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});

const upload = multer({ storage });
const router = express.Router();

router.post(
  "/category/create",
  requireSignin,
  adminMiddleware,
  upload.single("categoryImage"),
  validateCategoryRequest,
  isCategoryValid,
  addCategory
);

router.get("/category/getcategory", getCategories);

module.exports = router;
