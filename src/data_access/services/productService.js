/* eslint-disable no-underscore-dangle */
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

const getProducts = async (search = '', page = 1) => {
  const limit = 20;
  const skip = (page - 1) * limit;
  const option = {};
  if (search) {
    option.$or = [
      {
        name: {
          $regex: search,
          $options: 'i',
        },
      },
      // {
      //   medicalName: {
      //     $regex: search,
      //     $options: 'i',
      //   },
      // },
    ];
  }
  return Product.aggregate([
    { $match: option },
    {
      $addFields: {
        displayName: {
          $concat: ['$name', ' ', ' ', { $ifNull: ['$form', ''] }, ' - ', { $ifNull: ['$companyName', ''] }],
        },
        sIndex: {
          $indexOfBytes: [
            { $toLower: { $concat: ['$name', ' ', { $ifNull: ['$medicalName', ''] }] } },
            search.toLocaleLowerCase(),
          ],
        },
      },
    },
    {
      $sort: { sIndex: 1 },
    },
    { $skip: skip },
    { $limit: limit },
  ]);
};

const getProduct = async (id) => {
  if (!mongoose.isValidObjectId(id)) return null;
  return Product.findById(id);
};


const getRelatedProducts = async (products) => {
  try {
    const objectIdProducts = products.map(e => mongoose.Types.ObjectId(e));
    let medicalNames = await Product.aggregate([
      { $match: { _id: { $in: objectIdProducts } } },
      { $group: { _id: '$medicalName' } },
    ]);
    medicalNames = medicalNames.map(e => e._id);
    const result = await Product.aggregate([
      { $match: { _id: { $nin: objectIdProducts } } },
      { $match: { medicalName: { $in: medicalNames } } },
    ]);
    return result;
  } catch (e) {
    return [];
  }
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

const deleteProduct = async (_id) => {
  try {
    await Product.deleteOne({ _id });
  } catch (e) { console.log(e.message); }
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  createManyProducts,
  deleteProduct,
  getRelatedProducts,
};
