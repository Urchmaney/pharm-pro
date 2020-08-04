const mongoose = require('mongoose');
const Retailer = require('../schemas/retailer_schema');

const createRetailer = async (retailer) => {
  retailer = new Retailer(retailer);
  const error = retailer.validateSync();
  if (error) {
    return {
      status: false,
      result: Object.keys(error.errors).map(ele => error.errors[ele].message),
    };
  }
  await retailer.save();
  return { status: true, result: retailer };
};

const isRetailerPhoneNumberExist = async (phoneNumber) => Retailer.exists({ phoneNumber });

const getRetailer = async (id) => {
  if (mongoose.isValidObjectId(id)) {
    return Retailer.findById(id);
  }
  return null;
};

const updateRetailer = async (_id, updateObj) => {
  if (mongoose.isValidObjectId(_id)) {
    return Retailer.findOneAndUpdate({ _id }, updateObj, { new: true });
  }
  return null;
};

const getRetailers = async () => Retailer.find({}).lean();

module.exports = {
  createRetailer,
  isRetailerPhoneNumberExist,
  getRetailer,
  updateRetailer,
  getRetailers,
};
