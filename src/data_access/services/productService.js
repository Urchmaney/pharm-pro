const mongoose = require('mongoose');
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

const getProducts = async (search) => {
  const option = {};
  if (search) {
    option.$or = [
      {
        name: {
          $regex: search,
          $options: 'i',
        },
      },
      {
        medicalName: {
          $regex: search,
          $options: 'i',
        },
      },
    ];
  }
  return Product.find(option);
};

const getProduct = async (id) => {
  if (!mongoose.isValidObjectId(id)) return null;
  return Product.findById(id);
};

const updateProduct = async (_id, newProduct) => {
  if (!mongoose.isValidObjectId(_id)) return null;
  return Product.findOneAndUpdate({ _id }, newProduct, { new: true });
};

const createManyProducts = async (products) => {
  try {
    const result = await Product.insertMany(products);
    return { status: true, result };
  } catch (e) {
    return { status: false, result: e.message };
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  createManyProducts,
};
