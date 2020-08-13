const mongoose = require('mongoose');
const InvoiceModel = require('../schemas/invoice_schema');

const getRetailerInvoiceById = (_id) => {
  if (!mongoose.isValidObjectId(_id)) return null;
  return InvoiceModel.findOne({ _id }).populate('wholesaler');
};

const getRetailerInvoices = (retailerId) => InvoiceModel.find({ retailer: retailerId }).populate('wholesaler');

module.exports = {
  getRetailerInvoiceById,
  getRetailerInvoices,
};
