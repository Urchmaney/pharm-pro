/* eslint-disable no-underscore-dangle */
const marketRequestSerializer = (marketRequest) => {
  if (!marketRequest) return marketRequest;

  return ({
    wholesaler: marketRequest.wholesaler.fullName,
    wholesalerId: marketRequest.wholesaler._id,
    retailerId: marketRequest.retailer._id,
    retailer: marketRequest.retailer.fullName,
    products: marketRequest.products,
    listId: marketRequest.listId,
    status: marketRequest.status,
  });
};

module.exports = marketRequestSerializer;
