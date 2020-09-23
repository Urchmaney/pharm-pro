/* eslint-disable no-underscore-dangle */
const retailerWholesalerController = (retailerService, wholesalerService) => {
  const create = {
    roles: [],
    action: async (retailerWholesaler) => {
      retailerWholesaler = retailerWholesaler || {};
      let wholesaler = await wholesalerService.getWholesalerByPhoneNumber(
        retailerWholesaler.phoneNumber,
      );
      retailerWholesaler.active = wholesaler !== null;
      const { status, result } = await retailerService.addRetailerWholesaler(retailerWholesaler);
      if (status) {
        wholesaler = wholesaler || {};
        const image = wholesaler.profileImage || '';
        return { statusCode: 201, result: { ...result._doc, image } };
      }

      return { statusCode: 400, result };
    },
  };

  const show = {
    roles: [],
    action: async () => {

    },
  };

  const index = {
    roles: [],
    action: async (retailerId) => {
      const retailerWholesalers = await retailerService.getRetailerWholesalers(retailerId);
      return { statusCode: 200, result: retailerWholesalers };
    },
  };

  const update = {
    roles: [],
    action: async (id, newObj) => {
      const updatedObj = await retailerService.updateRetailerWholesaler(id, newObj);
      if (updatedObj) {
        return { statusCode: 200, result: updatedObj };
      }
      return { statusCode: 400, result: 'Invalid id.' };
    },
  };

  return {
    create,
    show,
    index,
    update,
  };
};

module.exports = retailerWholesalerController;
