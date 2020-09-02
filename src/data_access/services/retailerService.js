const mongoose = require('mongoose');
const Retailer = require('../schemas/retailer_schema');
const RetailerWholesaler = require('../schemas/retailer_wholesaler_schema');

const createRetailer = async (retailer) => {
  try {
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
  } catch (e) {
    return { status: false, result: [e.message] };
  }
};

const isRetailerPhoneNumberExist = async (phoneNumber) => Retailer.exists({ phoneNumber });

const getRetailer = async (id) => {
  if (mongoose.isValidObjectId(id)) {
    return Retailer.findById(id);
  }
  return null;
};

const getRetailerByPhoneNumber = async (phoneNumber) => Retailer.findOne({ phoneNumber });

const updateRetailer = async (_id, updateObj) => {
  if (mongoose.isValidObjectId(_id)) {
    return Retailer.findOneAndUpdate({ _id }, updateObj, { new: true });
  }
  return null;
};

const updateRetailerProfileImage = async (
  id, fileUrl) => updateRetailer(id, { profileImage: fileUrl });

const getRetailers = async () => Retailer.find({}).lean();

const addRetailerWholesaler = async (retailerWholesaler) => {
  if (typeof retailerWholesaler !== 'object') {
    return {
      status: false,
      result: ['Invalid payload sent'],
    };
  }
  retailerWholesaler = new RetailerWholesaler(retailerWholesaler);
  const error = retailerWholesaler.validateSync();
  if (error) {
    return {
      status: false,
      result: Object.keys(error.errors).map(ele => error.errors[ele].message),
    };
  }
  await retailerWholesaler.save();
  return { status: true, result: retailerWholesaler };
};

const getRetailerWholesalers = async (retailerId) => RetailerWholesaler.aggregate([
  { $match: { retailerId: retailerId.toString() } },
  {
    $lookup: {
      from: 'wholesalers',
      localField: 'phoneNumber',
      foreignField: 'phoneNumber',
      as: 'wholesalers',
    },
  },
  {
    $project: {
      retailerId: '$retailerId',
      active: '$active',
      fullName: '$fullName',
      phoneNumber: '$phoneNumber',
      location: '$location',
      wholesaler: { $arrayElemAt: ['$wholesalers', 0] },
    },
  },
  {
    $project: {
      retailerId: '$retailerId',
      active: '$active',
      fullName: '$fullName',
      phoneNumber: '$phoneNumber',
      location: '$location',
      image: '$wholesaler.profileImage',
    },
  },
]);

const getRetailerWholesalerByPhoneNumber = async (
  retailerId, phoneNumber,
) => RetailerWholesaler.findOne({ retailerId, phoneNumber }).lean();

const getRetailerWholesaler = async (_id) => RetailerWholesaler.findOne({ _id }).lean();

const updateRetailerWholesaler = async (_id, { fullName, phoneNumber, location }) => {
  if (!mongoose.isValidObjectId(_id)) return null;
  const updateObj = {};
  if (fullName) updateObj.fullName = fullName;
  if (phoneNumber) updateObj.phoneNumber = phoneNumber;
  if (location) updateObj.location = location;
  return RetailerWholesaler.findOneAndUpdate({ _id }, updateObj, { new: true });
};

module.exports = {
  createRetailer,
  isRetailerPhoneNumberExist,
  getRetailer,
  getRetailerByPhoneNumber,
  updateRetailer,
  updateRetailerProfileImage,
  getRetailers,
  addRetailerWholesaler,
  getRetailerWholesalers,
  getRetailerWholesalerByPhoneNumber,
  updateRetailerWholesaler,
  getRetailerWholesaler,
};
