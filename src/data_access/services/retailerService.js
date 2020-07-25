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

module.exports = {
  createRetailer,
  isRetailerPhoneNumberExist,
};
