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
    roles: [],
    action: async (id) => {
      const wholesaler = await wholesalerService.getWholesalerById(id);
      if (!wholesaler) return { statusCode: 404, result: 'wholesaler with id does not exist' };
      return { statusCode: 200, result: wholesaler };
    },
  };

  const update = {
    roles: [],
    action: async (id, newWholesaler) => {
      const oldWholesaler = await wholesalerService.getWholesalerById(id);
      if (!oldWholesaler) return { statusCode: 400, result: 'wholesaler with id does not exist' };
      const result = await wholesalerService.updateWholesaler(id, newWholesaler);
      return { statusCode: 200, result };
    },
  };

  const deleteAction = {
    roles: [],
    action: async (id) => {
      const wholesaler = await wholesalerService.getWholesalerById(id);
      if (wholesaler) await wholesalerService.updateWholesaler(id, { isDeleted: true });
      return { statusCode: 200, result: 'successfully deleted wholesaler.' };
    },
  };

  const login = {
    authenticator,
  };

  return {
    login,
    create,
    index,
    show,
    update,
    deleteAction,
  };
};

module.exports = wholesalerController;