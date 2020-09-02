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
).populate('product');

const getWholesalerProductsByGroups = async (wholesaler) => WholesalerProduct.aggregate([
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

const getWholesalerProduct = async (wholesaler, product) => WholesalerProduct.findOne({
  wholesaler,
  product,
}).populate('product');

const getWholesalerProductCostPrice = async (wholesalerId, productId, quantityType) => {
  const wholesalerProduct = await getWholesalerProduct(wholesalerId, productId);
  if (!wholesalerProduct) return 0;

  switch (quantityType) {
    case 'Satchet':
      return wholesalerProduct.pricePerSatchet;
    case 'Carton':
      return wholesalerProduct.pricePerCarton;
    case 'Box':
      return wholesalerProduct.pricePerBox;
    case 'Packet':
      return wholesalerProduct.pricePerPacket;
    default:
      return 0;
  }
};

const updateWholesalerProductQuantityTypePrice = async (
  wholesalerId, productId, quantityType, price,
) => {
  if (!mongoose.isValidObjectId(wholesalerId)
    || !mongoose.isValidObjectId(productId) || typeof price !== 'number') return null;

  const option = {};
  switch (quantityType) {
    case 'Satchet':
      option.pricePerSatchet = price;
      break;
    case 'Carton':
      option.pricePerCarton = price;
      break;
    case 'Box':
      option.pricePerBox = price;
      break;
    case 'Packet':
      option.pricePerPacket = price;
      break;
    default:
      break;
  }
  return WholesalerProduct.findOneAndUpdate({
    wholesaler: wholesalerId, product: productId,
  }, option, { new: true });
};

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
  getWholesalerProductCostPrice,
  updateWholesalerProductQuantityTypePrice,
  getWholesalerProductsByGroups,
};
