const { check, validationResult } = require("express-validator");
const categoryModel = require("../models/category.model");

exports.validateCategoryRequest = [
  check("name")
    .notEmpty()
    .withMessage("name is required")
    .custom(async (value) => {
      const existingCategory = await categoryModel.findOne({ name: value });
      if (existingCategory) {
        throw new Error("Category already exists");
      }
      return true;
    }),
];

exports.isCategoryValid = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.array().length > 0) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
};
