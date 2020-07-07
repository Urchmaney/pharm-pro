const wholesalerController = (wholesalerService, authenticator) => {
  const create = {
    roles: [],
    action: async (wholesaler) => {
      const { status, result } = await wholesalerService.addWholesaler(wholesaler);
      if (!status) return { statusCode: 400, result };
      return { statusCode: 200, result: 'Successfully created wholesaler' };
    },
  };

  const index = {
    roles: [],
    action: async () => ({ statusCode: 200, result: await wholesalerService.getWholesalers() }),
  };

  const show = {

  };

  const update = {

  };

  const deleteAction = {

  };

  return {
    create,
    index,
    show,
    update,
    deleteAction,
  };
};

module.exports = wholesalerController;