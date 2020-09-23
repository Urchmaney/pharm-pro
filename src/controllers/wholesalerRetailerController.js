/* eslint-disable no-underscore-dangle */
const wholesalerRetailerController = (wholesalerService, retailerService) => {
  const create = {
    roles: [],
    action: async (wholesalerRetailer) => {
      wholesalerRetailer = wholesalerRetailer || {};
      let retailer = await retailerService.getRetailerByPhoneNumber(
        wholesalerRetailer.phoneNumber,
      );
      wholesalerRetailer.active = retailer !== null;
      const { status, result } = await wholesalerService.createWholesalerRetailer(
        wholesalerRetailer,
      );
      if (status) {
        retailer = retailer || {};
        const image = retailer.profileImage || '';
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
    action: async (wholesalerId) => {
      const wholesalerRetailers = await wholesalerService.getWholesalerRetailers(wholesalerId);
      return { statusCode: 200, result: wholesalerRetailers };
    },
  };

  const update = {
    roles: [],
    action: async (id, newObj) => {
      const updatedWholesalerRetailer = await wholesalerService.updateWholesalerRetailer(
        id, newObj,
      );
      if (updatedWholesalerRetailer) return { statusCode: 200, result: updatedWholesalerRetailer };
      return { statusCode: 400, result: 'Invalid id provided.' };
    },
  };

  return {
    create,
    show,
    index,
    update,
  };
};

module.exports = wholesalerRetailerController;
