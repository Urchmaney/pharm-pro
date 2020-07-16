const mongoose = require('mongoose');
const fs = require('fs');
const Wholesaler = require('../schemas/wholesaler_schema');

const addWholesaler = async (wholesalerObj) => {
  const wholesaler = new Wholesaler(wholesalerObj);
  const error = wholesaler.validateSync();
  if (error) {
    return {
      status: false,
      result: Object.keys(error.errors).map(ele => error.errors[ele].message),
    };
  }
  await wholesaler.save();
  return { status: true, result: wholesaler };
};

const getWholesalerById = async (id) => {
  if (!mongoose.isValidObjectId(id)) return null;
  return Wholesaler.findOne({ _id: id, isDeleted: false });
};

const getWholesalerByPhoneNumber = async (phoneNumber) => Wholesaler.findOne({ phoneNumber });

const updateWholesaler = (id, newWholesaler) => Wholesaler
  .findByIdAndUpdate(id, newWholesaler, { upsert: true, new: true });

const deleteWholesaler = async (id) => {
  await updateWholesaler(id, { isDeleted: true });
};

const getWholesalers = async () => Wholesaler.find({ isDeleted: false });

const uploadWholesalerProfile = async (id, image) => {
  const profileImage = {
    contentType: image.contentType,
    data: fs.readFileSync(image.path),
  };
  return updateWholesaler(id, { profileImage });
};

module.exports = {
  addWholesaler,
  getWholesalerById,
  getWholesalerByPhoneNumber,
  updateWholesaler,
  deleteWholesaler,
  getWholesalers,
  uploadWholesalerProfile,
};
