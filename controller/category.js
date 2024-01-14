const CategoryModel = require("../models/category.model");
const slugify = require("slugify");
const shortid = require("shortid");

exports.addCategory = async (req, res) => {
  try {
    const { name, parentId } = req.body;

    const newCategoryData = {
      name,
      slug: `${slugify(name)}-${shortid.generate()}`,
      categoryImage: req.file ? req.file.filename : undefined,
      parentId,
    };

    const category = new CategoryModel(newCategoryData);
    await category.save();

    return res.status(201).json({ category });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find({});
    const categoryTree = createCategoryTree(categories);
    res.status(200).json({ categories: categoryTree });
  } catch (error) {
    res.status(400).json({ error });
  }
};

function createCategoryTree(categories, parentId = null) {
  const categoryList = categories
    .filter((cat) =>
      // check if parentId is null then its parent category else its child category
      parentId === null ? cat.parentId == undefined : cat.parentId == parentId
    )
    .map((cate) => ({
      _id: cate._id,
      name: cate.name,
      slug: cate.slug,
      parentId: cate.parentId,
      type: cate.type,
      children: createCategoryTree(categories, cate._id), // recursion to get child category
    }));

  return categoryList;
}
