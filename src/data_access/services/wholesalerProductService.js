const mongoose = require('mongoose');
const WholesalerProduct = require('../schemas/wholesaler_product_schema');

const createWholesalerProduct = async (wholesalerProduct) => {
  try {
    if (typeof wholesalerProduct !== 'object') {
      return {
        status: false,
        result: ['Invalid payload sent.'],
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
).populate('product').populate('formPrices.form');

const getWholesalerProductsByGroups = async (wholesaler) => {
  WholesalerProduct.aggregate([
    { $match: { wholesaler: wholesaler.toString() } },
    { $addFields: { product_id: { $toObjectId: '$product' } } },
    {
      $lookup: {
        from: 'products',
        localField: 'product_id',
        foreignField: '_id',
        as: 'whproduct',
      },
    },
    { $unwind: '$whproduct' },
    {
      $group: {
        _id: '$whproduct.medicalName',
        products: {
          $push: '$$ROOT',
        },
      },
    },
  ]);
};

const getWholesalerProduct = async (wholesaler, product) => {
  try {
    const wP = await WholesalerProduct.findOne({ wholesaler, product }).populate('product');
    return wP;
  } catch (e) {
    return null;
  }
};

const getWholesalerProductWithProductObj = async (
  wholesaler, product) => {
  try {
    const wP = await WholesalerProduct.findOne({ wholesaler, product });
    return wP;
  } catch (e) {
    return null;
  }
};

const getWholesalerProductCostPrice = async (wholesalerId, productId, formId) => {
  const wholesalerProduct = await getWholesalerProduct(wholesalerId, productId);
  if (!wholesalerProduct) return 0;

  const form = wholesalerProduct.formPrices.find(e => e.form.toString() === formId.toString());
  return form ? form.price : 0;
};

const updateWholesalerProduct = async (wholesaler, product, updateObj) => {
  if (!mongoose.isValidObjectId(wholesaler)
    || !mongoose.isValidObjectId(product)
    || !mongoose.isValidObjectId(updateObj.form)
    || typeof updateObj.price !== 'number') return null;

  const wP = await getWholesalerProductWithProductObj(wholesaler, product);
  if (!wP) return null;
  const p = wP.formPrices.find(e => e.form.toString() === updateObj.form.toString());
  if (p) p.price = updateObj.price;
  else { wP.formPrices.push({ form: updateObj.form, price: updateObj.price }); }

  await wP.save();
  return wP;
};

const updateWholesalerProductQuantityTypePrice = async (
  wholesalerId, productId, formId, price,
) => updateWholesalerProduct(wholesalerId, productId, { form: formId, price });

module.exports = {
  createWholesalerProduct,
  getWholesalerProducts,
  getWholesalerProduct,
  updateWholesalerProduct,
  getWholesalerProductCostPrice,
  updateWholesalerProductQuantityTypePrice,
  getWholesalerProductsByGroups,
};
