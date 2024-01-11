const CategoryModel = require("../models/category.model");
const slugify = require("slugify");
const shortid = require("shortid");

exports.addCategory = async (req, res) => {
  const newCategoryData = {
    name: req.body.name,
    slug: `${slugify(req.body.name)}-${shortid.generate()}`, // Generate a unique slug
  };

  if (req.file) {
    newCategoryData.imagePath =
      process.env.API + "/public/" + req.file.filename;
  }

  if (req.body.parentId) {
    newCategoryData.parentId = req.body.parentId;
  }

  try {
    const category = new CategoryModel(newCategoryData);
    await category.save();
    return res.status(201).json({ category });
  } catch (error) {
    return res.status(400).json({ error });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find({});
    // console.log(categories);
    const categoryTree = createCategoryTree(categories); // Create the category tree
    res.status(200).json({ categories: categoryTree });
  } catch (error) {
    res.status(400).json({ error });
  }
};

// Function to create a hierarchical tree structure of categories
function createCategoryTree(categories, parentId = null) {
  const categoryList = [];
  let category;
  if (parentId == null) {
    category = categories.filter((cat) => cat.parentId == undefined); // If parentId is not provided, then we are adding a parent category
  } else {
    category = categories.filter((cat) => cat.parentId == parentId); // If parentId is provided, then we are adding a child category
  }

  for (let cate of category) {
    console.log(categories);
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      slug: cate.slug,
      parentId: cate.parentId,
      type: cate.type,
      children: createCategoryTree(categories, cate._id), // Recursively call createCategoryTree() to create a tree structure
    });
  }

  return categoryList;
}
