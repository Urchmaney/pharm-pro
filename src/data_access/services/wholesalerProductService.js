const WholesalerProduct = require('../schemas/wholesaler_product_schema');

const createWholesalerProduct = async (wholesalerProduct) => {
  try {
    wholesalerProduct = new WholesalerProduct(wholesalerProduct);
    const error = await wholesalerProduct.validate();
    if (error) return null;
    await wholesalerProduct.save();
    return wholesalerProduct;
  } catch (e) {
    return null;
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

const updateWholesalerProduct = async (
  wholesaler, product, newWholesalerProduct,
) => WholesalerProduct.findOneAndUpdate({
  wholesaler, product,
}, newWholesalerProduct, { new: true });


module.exports = {
  createWholesalerProduct,
  getWholesalerProducts,
  getWholesalerProduct,
  updateWholesalerProduct,
};
