const retailerWholesalerController = (retailerService, wholesalerService) => {
  const create = {
    roles: [],
    action: async (retailerWholesaler) => {
      retailerWholesaler = retailerWholesaler || {};
      retailerWholesaler.active = await wholesalerService.isWholesalerPhoneNumberExist(
        retailerWholesaler.phoneNumber,
      );
      const { status, result } = await retailerService.addRetailerWholesaler(retailerWholesaler);
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
