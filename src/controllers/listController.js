const listController = (invoiceService) => {
  const index = {
    roles: [],
    action: async (retailerId, active) => {
      const list = await invoiceService.getList(retailerId, active);
      return { statusCode: 200, result: list };
    },
  };

  return {
    index,
  };
};

module.exports = listController;
