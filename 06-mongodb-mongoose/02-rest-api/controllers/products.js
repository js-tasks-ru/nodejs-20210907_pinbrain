const Products = require('../models/Product');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) return next();

  const products = await Products.find({subcategory: subcategory})
  ctx.body = {products: products.map(product => formatProductResponse(product))};
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Products.find({});
  ctx.body = {products: products.map(product => formatProductResponse(product))};
};

module.exports.productById = async function productById(ctx, next) {
  if(!ObjectId.isValid(ctx.params.id)) {
    ctx.status = 400;
    ctx.body = {error: 'Invalid product Id'};
    return next();
  }
  const product = await Products.findById(ctx.params.id);
  if(!product) {
    ctx.status = 404;
    ctx.body = {error: `There is no product witd Id = ${ctx.params.id}`};
    return next();
  }
  ctx.body = {product: formatProductResponse(product)};
};

function formatProductResponse (product) {
    return {
        id: product._id,
        title: product.title,
        images: product.images,
        category: product.category,
        subcategory: product.subcategory,
        price: product.price,
        description: product.description
    }
}

