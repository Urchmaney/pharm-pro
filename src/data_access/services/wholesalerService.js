const mongoose = require('mongoose');
const Wholesaler = require('../schemas/wholesaler_schema');
const WholesalerRetailer = require('../schemas/wholesaler_retailer_schema');

const createWholesaler = async (wholesalerObj) => {
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
    contentType: image.mimetype,
    data: image.buffer,
  };
  return updateWholesaler(id, { profileImage });
};

const createWholesalerRetailer = async (wholesalerRetailer) => {
  if (typeof wholesalerRetailer !== 'object') {
    return {
      status: false,
      result: ['Invalid payload sent'],
    };
  }
  wholesalerRetailer = new WholesalerRetailer(wholesalerRetailer);
  const error = wholesalerRetailer.validateSync();
  if (error) {
    return {
      status: false,
      result: Object.keys(error.errors).map(ele => error.errors[ele].message),
    };
  }
  await wholesalerRetailer.save();
  return { status: true, result: wholesalerRetailer };
};

const getWholesalerRetailers = async (wholesalerId) => WholesalerRetailer.aggregate([
  { $match: { wholesalerId: wholesalerId.toString() } },
  {
    $lookup: {
      from: 'retailers',
      localField: 'phoneNumber',
      foreignField: 'phoneNumber',
      as: 'retailer',
    },
  },
  {
    $project: {
      wholesalerId: '$wholesalerId',
      active: '$active',
      fullName: '$fullName',
      phoneNumber: '$phoneNumber',
      profileImage: { $arrayElemAt: ['$countryInfo', 0] },
    },
  },
]);

const getWholesalerRetailer = async (
  wholesalerId, phoneNumber,
) => WholesalerRetailer.findOne({ wholesalerId: wholesalerId.toString(), phoneNumber });

const updateWholesalerRetailer = async (_id, newWholesalerRetailer) => {
  if (!mongoose.isValidObjectId(_id)) return null;
  return WholesalerRetailer.findOneAndUpdate(
    { _id }, newWholesalerRetailer, { new: true },
  );
};


module.exports = {
  createWholesaler,
  getWholesalerById,
  getWholesalerByPhoneNumber,
  updateWholesaler,
  deleteWholesaler,
  getWholesalers,
  uploadWholesalerProfile,
  createWholesalerRetailer,
  getWholesalerRetailers,
  getWholesalerRetailer,
  updateWholesalerRetailer,
};
