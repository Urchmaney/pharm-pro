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
    const error = wholesalerProduct.validateSync();
    if (error) {
      return {
        status: false,
        result: Object.keys(error.errors).map(ele => error.errors[ele].message),
      };
    }

    await wholesalerProduct.save();
    await wholesalerProduct.populate('product').populate('formPrices.form').execPopulate();
    return { status: true, result: wholesalerProduct };
  } catch (err) {
    return { status: false, result: [err.message] };
  }
};

const getWholesalerProducts = async (wholesaler) => WholesalerProduct.find(
  {
    wholesaler,
  },
).populate('product').populate('formPrices.form');

const getWholesalerProductsByGroups = async (wholesaler) => {
  const wProducts = await getWholesalerProducts(wholesaler);
  const groupedProducts = {};
  wProducts.forEach(wProduct => {
    const { medicalName } = wProduct.product;
    if (!groupedProducts[medicalName]) groupedProducts[medicalName] = [];
    groupedProducts[medicalName].push(wProduct);
  });
  return Object.keys(groupedProducts).map(e => ({ medicalName: e, products: groupedProducts[e] }));
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

const getWholesalerProductExpiryBatch = async (wholesaler, date) => WholesalerProduct.aggregate([
  {
    $match: { wholesaler, 'batches.expiryDate': { $lte: date } },
  },
  {
    $lookup: {
      from: 'products',
      localField: 'product',
      foreignField: '_id',
      as: 'product',
    },
  },
  {
    $project: {
      wholesaler: '$wholesaler',
      product: { $arrayElemAt: ['$product', 0] },
      formPrices: '$formPrices',
      batches: {
        $filter: {
          input: '$batches',
          as: 'batch',
          cond: { $lte: ['$$batch.expiryDate', date] },
        },
      },
    },
  },
]);

const updateWholesalerProduct = async (wholesaler, id, updateObj) => {
  const data = {};
  if (updateObj.batches && Array.isArray(updateObj.batches)) data.batches = updateObj.batches;
  if (updateObj.formPrices && Array.isArray(updateObj.formPrices)) {
    data.formPrices = updateObj.formPrices;
  }

  try {
    const updated = await WholesalerProduct.findOneAndUpdate(
      { wholesaler, _id: id }, data, { new: true },
    );
    return updated;
  } catch (e) {
    return null;
  }
};

const updateWholesalerProductForm = async (wholesaler, product, updateObj) => {
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
) => updateWholesalerProductForm(wholesalerId, productId, { form: formId, price });

module.exports = {
  createWholesalerProduct,
  getWholesalerProducts,
  getWholesalerProduct,
  getWholesalerProductExpiryBatch,
  updateWholesalerProduct,
  updateWholesalerProductForm,
  getWholesalerProductCostPrice,
  updateWholesalerProductQuantityTypePrice,
  getWholesalerProductsByGroups,
};
