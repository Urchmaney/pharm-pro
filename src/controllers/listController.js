const listController = (invoiceService, productService) => {
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

  const relatedProducts = {
    roles: [],
    action: async (retailerId, listId) => {
      const listProducts = (await invoiceService.getList(retailerId, listId));
      if (!listProducts) return { statusCode: 400, result: ['Invalid list Id.'] };

      const listProductsIds = listProducts.map(e => e.product);
      const relatedProducts = await productService.getRelatedProducts(listProductsIds);
      return { statusCode: 200, result: relatedProducts };
    },
  };

  return {
    index,
    show,
    closeList,
    productPrices,
    relatedProducts,
  };
};

module.exports = listController;
