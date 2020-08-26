const mongoose = require('mongoose');
const InvoiceModel = require('../schemas/invoice_schema');

const getInvoiceById = (_id) => {
  if (!mongoose.isValidObjectId(_id)) return null;
  return InvoiceModel.findOne({ _id }).populate('wholesaler');
};

const getRetailerInvoices = (retailerId) => InvoiceModel.find({ retailer: retailerId }).populate('wholesaler');

const getWholesalerInvoices = (wholesalerId) => InvoiceModel.find({ wholesaler: wholesalerId }).populate('retailer');

const createInvoice = async (invoice) => {
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
  await invoice.save();
  return { status: true, result: invoice };
};

const updateInvoiceProduct = async (invoiceId, updateObj) => {
  if (!mongoose.isValidObjectId(invoiceId)) return null;

  return InvoiceModel.findOneAndUpdate(
    { _id: invoiceId, 'products.product': updateObj.product },
    {
      $set: {
        'products.$.costPrice': updateObj.costPrice,
      },
    },
    { new: true },
  );
};

const updateManyInvoiceProducts = async (invoiceId, invoiceProducts) => {
  if (!mongoose.isValidObjectId(invoiceId)) return null;

  const updates = [];
  invoiceProducts.forEach(element => {
    updates.push(updateInvoiceProduct(invoiceId, element));
  });

  return (await Promise.all(updates)).filter(ele => ele !== null).pop() || null;
};

module.exports = {
  getInvoiceById,
  getRetailerInvoices,
  getWholesalerInvoices,
  createInvoice,
  updateInvoiceProduct,
  updateManyInvoiceProducts,
};
