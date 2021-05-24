const mongoose = require('mongoose');
const MarketRequestModel = require('../schemas/market_request_schema');

const AddMarketRequest = async (marketRequest) => {
  try {
    marketRequest = new MarketRequestModel(marketRequest);
    const error = marketRequest.validateSync();
    if (error) {
      return {
        status: false,
        result: Object.keys(error.errors).map(ele => error.errors[ele].message),
      };
    }
    await marketRequest.save();
    await marketRequest.populate('retailer').populate('wholesaler').execPopulate();
    return { status: true, result: marketRequest };
  } catch (e) {
    return { status: false, result: [e.message] };
  }
};

const isValidMongooseId = (id) => mongoose.isValidObjectId(id);

const pendingMarketRequestGroupedByWholesalers = async () => MarketRequestModel.aggregate(
  [
    { $match: { status: 'pending' } },
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

module.exports = {
  AddMarketRequest,
  isValidMongooseId,
  pendingMarketRequestGroupedByWholesalers,
};
