const mongoose = require('mongoose');
const InvoiceModel = require('../schemas/invoice_schema');
const {
  getWholesalerProductCostPrice,
  updateWholesalerProductQuantityTypePrice,
} = require('./wholesalerProductService');
const notifier = require('../../notification/notifier');

const getInvoiceById = (_id) => {
  if (!mongoose.isValidObjectId(_id)) return null;
  return InvoiceModel.findOne({ _id }).lean();
};

const getRetailerInvoices = (retailerId, status) => {
  const option = { retailer: retailerId };
  if (status !== undefined) option.isActive = (status.toLowerCase() === 'true');
  return InvoiceModel.find(option).populate('wholesaler');
};

const getWholesalerInvoices = (wholesalerId, status) => {
  const option = { wholesaler: wholesalerId };
  if (status !== undefined) option.isActive = (status.toLowerCase() === 'true');
  return InvoiceModel.find(option).populate('retailer');
};

const addInvoiceProductCostPrice = async (invoiceProduct, wholesaler) => {
  const costPrice = await getWholesalerProductCostPrice(
    wholesaler, invoiceProduct.product, invoiceProduct.quantityType,
  );
  invoiceProduct.costPrice = costPrice;
};

const createInvoice = async (invoice) => {
  try {
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
    const costProducts = [];
    invoice.products.forEach(ele => {
      costProducts.push(addInvoiceProductCostPrice(ele, invoice.wholesaler));
    });
    await Promise.all(costProducts);
    await invoice.save();
    await invoice.populate('products.product').populate('retailer').populate('wholesaler').execPopulate();
    if (invoice.wholesaler) await notifier.sendPushNotification(invoice.wholesaler.tokens, invoice);
    return { status: true, result: invoice };
  } catch (e) {
    return { status: false, result: e.message };
  }
};

const markInvoiceAsHasSentprice = async (
  invoiceId) => InvoiceModel.findOneAndUpdate({ _id: invoiceId }, { hasWholesalerAddedPrice: true }, { new: true }).populate('products.product');

const updateInvoiceProduct = async (invoiceId, updateObj, wholesalerId) => {
  if (!mongoose.isValidObjectId(invoiceId)) return null;

  await updateWholesalerProductQuantityTypePrice(
    wholesalerId, updateObj.product, updateObj.quantityType, updateObj.costPrice,
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

const getLists = async (retailerId, status) => {
  const option = { retailer: retailerId };
  if (status !== undefined) option.isActive = (status.toLowerCase() === 'true');

  return InvoiceModel.aggregate([
    { $match: option },
    { $group: { _id: '$listId', products: { $first: '$products' } } },
  ]);
};

const getList = async (retailerId, listId) => {
  const invoice = await InvoiceModel.findOne({ listId, retailer: retailerId }).lean();
  if (!invoice) return null;

  return invoice.products;
};

const getListProductPrices = async (listId, productId) => {
  const products = await InvoiceModel.aggregate([
    { $match: { listId } },
    { $unwind: '$products' },
    { $match: { 'products.product': productId.toString() } },
    {
      $project: {
        wholesaler: '$wholesaler',
        listId: '$listId',
        product: '$products',
      },
    },
  ]);
  return InvoiceModel.populate(products, {
    path: 'wholesaler',
    select: { fullName: 1 },
  });
};

const closeList = async (listId, retailerId) => InvoiceModel.updateMany(
  { listId, retailer: retailerId }, { isActive: false }, { new: true },
);

module.exports = {
  getInvoiceById,
  getRetailerInvoices,
  getWholesalerInvoices,
  createInvoice,
  updateInvoiceProduct,
  updateManyInvoiceProducts,
  getLists,
  getList,
  getListProductPrices,
  closeList,
};
