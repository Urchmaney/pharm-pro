const listController = (invoiceService) => {
  const index = {
    roles: [],
    action: async (retailerId, active) => {
      const lists = await invoiceService.getLists(retailerId, active);
      return { statusCode: 200, result: lists };
    },
  };

  const show = {
    roles: [],
    action: async (retailerId, listId) => {
      const list = await invoiceService.getList(retailerId, listId);
      if (list) return { statusCode: 200, result: list };

      return { statusCode: 400, result: 'Invalid list Id.' };
    },
  };

  const closeList = {
    roles: [],
    action: async (retailerId, listId) => {
      const list = await invoiceService.getList(retailerId, listId);
      if (!list) return { statusCode: 400, result: 'Invalid list Id.' };

      await invoiceService.closeList(listId, retailerId);
      return { statusCode: 200, result: 'succefully closed list.' };
    },
  };

  const productPrices = {
    roles: [],
    action: async (listId, productId) => {
      const productPrices = await invoiceService.getListProductPrices(listId, productId);
      return { statusCode: 200, result: productPrices };
    },
  };

  return {
    index,
    show,
    closeList,
    productPrices,
  };
};

module.exports = listController;
