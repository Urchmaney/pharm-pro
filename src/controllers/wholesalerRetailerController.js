const wholesalerRetailerController = (wholesalerService, retailerService) => {
  const create = {
    roles: [],
    action: async (wholesalerRetailer) => {
      wholesalerRetailer = wholesalerRetailer || {};
      wholesalerRetailer.active = await retailerService.isRetailerPhoneNumberExist(
        wholesalerRetailer.phoneNumber,
      );
      const { status, result } = await wholesalerService.createWholesalerRetailer(
        wholesalerRetailer,
      );
      if (status) return { statusCode: 201, result };

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
