const Products = require('../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const {query} = ctx.query;
  if(!query) return next();
  const products = await Products.find(
    {$text:{$search: query}},
    {score:{ $meta:'textScore'}}
  ).sort({score:{$meta:'textScore'}});
  ctx.body = {products: products.map(product => formatProductResponse(product))};
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
