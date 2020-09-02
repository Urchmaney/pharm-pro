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

  return {
    index,
    show,
    closeList,
  };
};

module.exports = listController;
