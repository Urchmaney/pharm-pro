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
  await product.save();
  return { status: true, result: product };
};

const getProducts = async () => Product.find({});

const getProduct = async (id) => Product.findById(id);

module.exports = {
  createProduct,
  getProducts,
  getProduct,
};
