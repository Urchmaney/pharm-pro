const mongoose = require('mongoose');
const WholesalerProduct = require('../schemas/wholesaler_product_schema');

const createWholesalerProduct = async (wholesalerProduct) => {
  try {
    if (typeof wholesalerProduct !== 'object') {
      return {
        status: false,
        result: ['Invalid payload sent'],
      };
    }

    wholesalerProduct = new WholesalerProduct(wholesalerProduct);
    const error = await wholesalerProduct.validate();
    if (error) {
      return {
        status: false,
        result: Object.keys(error.errors).map(ele => error.errors[ele].message),
      };
    }

    await wholesalerProduct.save();
    await WholesalerProduct.populate(wholesalerProduct, { path: 'product' });

    return { status: true, result: wholesalerProduct };
  } catch (err) {
    return { status: false, result: ['product Id is Invalid.'] };
  }
};

const getWholesalerProducts = async (wholesaler) => WholesalerProduct.find(
  {
    wholesaler,
  },
).populate('product');

const getWholesalerProduct = async (wholesaler, product) => WholesalerProduct.findOne({
  wholesaler,
  product,
}).populate('product');

const updateWholesalerProduct = async (_id, newWholesalerProduct) => {
  if (!mongoose.isValidObjectId(_id)) return null;
  return WholesalerProduct.findOneAndUpdate({
    _id,
  }, newWholesalerProduct, { new: true });
};


module.exports = {
  createWholesalerProduct,
  getWholesalerProducts,
  getWholesalerProduct,
  updateWholesalerProduct,
};
