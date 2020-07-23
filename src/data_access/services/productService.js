const Product = require('../schemas/product_schema');

const createProduct = async (product) => {
  product = new Product(product);
  const error = product.validateSync();
  if (error) {
    return {
      status: false,
      result: Object.keys(error.errors).map(ele => error.errors[ele].message),
    };
  }
  return { status: true, result: product };
};

module.exports = { createProduct };
