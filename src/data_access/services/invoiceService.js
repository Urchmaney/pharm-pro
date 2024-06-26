/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const InvoiceModel = require('../schemas/invoice_schema');
const {
  getWholesalerProductCostPrice,
  updateWholesalerProductQuantityTypePrice,
} = require('./wholesalerProductService');
const notifier = require('../../notification/notifier');

const getInvoiceById = (_id) => {
  if (!mongoose.isValidObjectId(_id)) return null;
  return InvoiceModel.findOne({ _id }).populate('products.product').populate('products.quantityForm').lean();
};

const getRetailerInvoices = (retailerId, status, priceAdded) => {
  const option = { retailer: retailerId };
  if (status !== undefined) option.isActive = (status.toLowerCase() === 'true');
  if (priceAdded !== undefined) option.hasWholesalerAddedPrice = (priceAdded.toLowerCase() === 'true');
  return InvoiceModel.find(option).populate('wholesaler').populate('products.product').populate('products.quantityForm')
    .sort('-updatedAt');
};

const getWholesalerInvoices = (wholesalerId, status, priceAdded) => {
  const option = { wholesaler: wholesalerId };
  if (status !== undefined) option.isActive = (status.toLowerCase() === 'true');
  if (priceAdded !== undefined) option.hasWholesalerAddedPrice = (priceAdded.toLowerCase() === 'true');
  return InvoiceModel.find(option).populate('retailer').sort('-updatedAt');
};

const addInvoiceProductCostPrice = async (invoiceProduct, wholesaler) => {
  const costPrice = await getWholesalerProductCostPrice(
    wholesaler, invoiceProduct.product, invoiceProduct.quantityForm,
  );
  invoiceProduct.costPrice = costPrice;
};

const objectToSendRetailerNotification = (invoice) => ({
  type: 'invoice',
  listId: invoice.listId,
  invoiceId: invoice._id.toString(),
  wholesalerId: invoice.wholesaler ? invoice.wholesaler._id.toString() : '',
  wholesalerFullName: invoice.wholesaler ? invoice.wholesaler.fullName : '',
  wholesalerProfileImage: invoice.wholesaler ? invoice.wholesaler.profileImage : '',
});

const objectToSendWholesalerNotification = (invoice) => ({
  type: 'invoice',
  listId: invoice.listId,
  invoiceId: invoice._id.toString(),
  retailerId: invoice.retailer ? invoice.retailer._id.toString() : '',
  retailerFullName: invoice.retailer ? invoice.retailer.fullName : '',
  retailerProfileImage: invoice.retailer ? invoice.retailer.profileImage : '',
});

const validateInvoice = (invoice) => {
  if (typeof invoice !== 'object') {
    return {
      status: false,
      result: ['Invalid invoice instance.'],
    };
  }
  invoice = new InvoiceModel(invoice);
  const error = invoice.validateSync();
  if (error) {
    return {
      status: false,
      result: Object.keys(error.errors).map(ele => error.errors[ele].message),
    };
  }
  return { status: true, result: invoice };
};

const createInvoice = async (invoice) => {
  try {
    if (typeof invoice !== 'object') {
      return {
        status: false,
        result: ['Invalid invoice instance.'],
      };
    }
    console.log(invoice);
    invoice = new InvoiceModel(invoice);
    const error = invoice.validateSync();
    if (error) {
      return {
        status: false,
        result: Object.keys(error.errors).map(ele => error.errors[ele].message),
      };
    }
    const costProducts = [];
    invoice.products.forEach(ele => {
      costProducts.push(addInvoiceProductCostPrice(ele, invoice.wholesaler));
    });
    await Promise.all(costProducts);
    await invoice.save();
    await invoice.populate('retailer').populate('wholesaler').populate('products.product').populate('products.quantityForm')
      .execPopulate();
    if (invoice.wholesaler) {
      await notifier.sendPushNotification(
        invoice.wholesaler.tokens,
        objectToSendWholesalerNotification(invoice),
        'Invoice',
        `new invoice from ${invoice.retailer ? invoice.retailer.fullName : ''}.`,
      );
    }
    return { status: true, result: invoice };
  } catch (e) {
    return { status: false, result: [e.message] };
  }
};

const markInvoiceAsHasSentprice = async (
  invoiceId) => InvoiceModel.findOneAndUpdate({ _id: invoiceId }, { hasWholesalerAddedPrice: true }, { new: true }).populate('wholesaler').populate('retailer');

const updateInvoiceProduct = async (invoiceId, updateObj, wholesalerId) => {
  if (!mongoose.isValidObjectId(invoiceId)
  || !mongoose.isValidObjectId(updateObj.product)) return null;

  await updateWholesalerProductQuantityTypePrice(
    wholesalerId, updateObj.product, updateObj.quantityForm, updateObj.costPrice,
  );

  return InvoiceModel.findOneAndUpdate(
    { _id: invoiceId, 'products.product': updateObj.product.toString() },
    {
      $set: {
        'products.$.costPrice': updateObj.costPrice,
      },
    },
    { new: true },
  );
};

const updateManyInvoiceProducts = async (invoiceId, invoiceProducts, wholesalerId) => {
  if (!mongoose.isValidObjectId(invoiceId)) return null;

  const updates = [];
  invoiceProducts.forEach(element => {
    updates.push(updateInvoiceProduct(invoiceId, element, wholesalerId));
  });

  await Promise.all(updates);
  return markInvoiceAsHasSentprice(invoiceId);
};

const acceptInvoiceProduct = async (retailerId, invoiceId, productId) => {
  if (!mongoose.isValidObjectId(retailerId) || !mongoose.isValidObjectId(invoiceId)
  || !mongoose.isValidObjectId(productId)) return null;

  return InvoiceModel.findOneAndUpdate(
    { _id: invoiceId, retailer: retailerId, 'products.product': productId },
    {
      $set: { 'products.$.accepted': true },
    },
    { new: true },
  );
};

const getLists = async (retailerId, status) => {
  const option = { retailer: mongoose.Types.ObjectId(retailerId) };
  if (status !== undefined) option.isActive = (status.toLowerCase() === 'true');

  return InvoiceModel.aggregate([
    { $match: option },
    { $group: { _id: '$listId', products: { $first: '$products' } } },
  ]);
};

const getList = async (retailerId, listId) => {
  try {
    const invoice = await InvoiceModel.findOne(
      { listId, retailer: mongoose.Types.ObjectId(retailerId) },
    ).lean();
    if (!invoice) return null;

    return invoice.products;
  } catch (e) {
    return null;
  }
};

const getListProductPrices = async (listId, productId) => InvoiceModel.aggregate([
  { $match: { listId } },
  { $unwind: '$products' },
  { $match: { 'products.product': mongoose.Types.ObjectId(productId) } },
  {
    $project: {
      wholesaler: '$wholesaler',
      listId: '$listId',
      pId: { $toObjectId: '$products.product' },
      quantityForm: '$products.quantityForm',
      costPrice: '$products.costPrice',
      quantity: '$products.quantity',
    },
  },
  {
    $lookup: {
      from: 'wholesalers',
      localField: 'wholesaler',
      foreignField: '_id',
      as: 'wholesalers',
    },
  },
  {
    $lookup: {
      from: 'products',
      localField: 'pId',
      foreignField: '_id',
      as: 'product',
    },
  },
  {
    $lookup: {
      from: 'quantityforms',
      localField: 'quantityForm',
      foreignField: '_id',
      as: 'quantityForms',
    },
  },
  {
    $project: {
      productId: '$pId',
      wholesaler: { $arrayElemAt: ['$wholesalers.fullName', 0] },
      listId: '$listId',
      quantityForm: { $arrayElemAt: ['$quantityForms', 0] },
      costPrice: '$costPrice',
      quantity: '$quantity',
      productName: { $arrayElemAt: ['$product.name', 0] },
    },
  },
]);

const getListProductsPrices = async (listId) => InvoiceModel.aggregate([
  { $match: { listId } },
  { $unwind: '$products' },
  {
    $project: {
      wholesaler: { $toObjectId: '$wholesaler' },
      listId: '$listId',
      pId: { $toObjectId: '$products.product' },
      quantityForm: '$products.quantityForm',
      costPrice: '$products.costPrice',
      quantity: '$products.quantity',
    },
  },
  {
    $lookup: {
      from: 'wholesalers',
      localField: 'wholesaler',
      foreignField: '_id',
      as: 'wholesalers',
    },
  },
  {
    $lookup: {
      from: 'products',
      localField: 'pId',
      foreignField: '_id',
      as: 'product',
    },
  },
  {
    $project: {
      productId: '$pId',
      wholesaler: { $arrayElemAt: ['$wholesalers.fullName', 0] },
      listId: '$listId',
      quantityForm: '$quantityForm',
      costPrice: '$costPrice',
      quantity: '$quantity',
      productName: { $arrayElemAt: ['$product.name', 0] },
    },
  },
  { $group: { _id: '$productId', products: { $push: '$$ROOT' } } },
]);

const getActiveRequests = () => InvoiceModel.aggregate(
  [
    { $match: { isActive: false, hasWholesalerAddedPrice: false } },
    { $project: { wholesaler: '$wholesaler', products: '$products' } },
    { $group: { _id: '$wholesaler', requests: { $push: '$$ROOT' } } },
    {
      $lookup: {
        from: 'wholesalers',
        localField: '_id',
        foreignField: '_id',
        as: 'wholesalerObj',
      },
    },
    { $unwind: '$wholesalerObj' },
    {
      $project: {
        wholesaler: '$wholesalerObj.fullName',
        _id: '$_id',
        requests: '$requests',
      },
    },
  ],
);
const closeList = async (listId, retailerId) => InvoiceModel.updateMany(
  { listId, retailer: retailerId }, { isActive: false }, { new: true },
);

module.exports = {
  validateInvoice,
  getInvoiceById,
  getRetailerInvoices,
  getWholesalerInvoices,
  createInvoice,
  updateInvoiceProduct,
  updateManyInvoiceProducts,
  acceptInvoiceProduct,
  getLists,
  getList,
  getListProductPrices,
  getListProductsPrices,
  closeList,
  objectToSendRetailerNotification,
  getActiveRequests,
};
