const Categories = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Categories.find({});
  ctx.body = {categories: categories.map(category => ({
    id: category._id,
    title: category.title,
    subcategories: category.subcategories.map(subcategory => ({
      id: subcategory._id,
      title: subcategory.title
    }))
  }))};
};
