/* eslint-disable no-underscore-dangle */
const { v4 } = require('uuid');

const marketRequestController = (marketRequestService, firebaseService) => {
  const create = {
    roles: [],
    action: async (marketRequest, retailerId) => {
      if (!Array.isArray(marketRequest.wholesalers)) {
        return { statusCode: 400, result: 'Invalid request body. wholesalers must be arrays.' };
      }
      const listId = v4();
      const addMarketRequest = async (mReq) => {
        const r = await marketRequestService.AddMarketRequest(mReq);
        if (!r.status) return null;

        firebaseService.createMarketRequest(r.result).then(result => {
          r.result.firebaseId = result.id;
          r.result.save();
        });
        return r.result;
      };
      const mRequests = [];
      for (let i = 0; i < marketRequest.wholesalers.length; i += 1) {
        if (!marketRequestService.isValidMongooseId(marketRequest.wholesalers[i])) {
          return { statusCode: 400, result: 'Invalid wholesaler present.' };
        }
        const mRequest = {
          wholesaler: marketRequest.wholesalers[i],
          retailer: retailerId,
          listId,
          products: marketRequest.products,
        };
        mRequests.push(addMarketRequest(mRequest));
      }
      const result = await Promise.all(mRequests);
      return { statusCode: 201, result };
    },
  };

  const index = {
    roles: [],
    action: async () => {
      const result = await marketRequestService.pendingMarketRequestGroupedByWholesalers();
      return { statusCode: 200, result };
    },
  };

  return {
    create,
    index,
  };
};

module.exports = marketRequestController;
