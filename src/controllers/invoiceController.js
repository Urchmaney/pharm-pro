const invoiceController = (invoiceService) => {
  const create = {
    roles: [],
    action: async (invoice) => {
      const { status, result } = await invoiceService.createInvoice(invoice);
      if (!status) return { statusCode: 400, result };

      return { statusCode: 201, result };
    },
  };

  const index = {
    roles: [],
    action: async (userId, userType) => {
      let invoices = [];
      if (userType === 1) invoices = await invoiceService.getWholesalerInvoices(userId);
      if (userType === 2) invoices = await invoiceService.getRetailerInvoices(userId);

      return { statusCode: 200, result: invoices };
    },
  };

  const update = {
    roles: [],
    action: async (invoiceId, invoiceProduct) => {
      const upateInvoice = await invoiceService.updateInvoiceProduct(invoiceId, invoiceProduct);
      if (upateInvoice) return { statusCode: 200, result: upateInvoice };

      return { statusCode: 400, result: 'Either invoice Id or product is invalid' };
    },
  };

  const updateMany = {
    roles: [],
    action: async (invoiceId, invoiceProducts) => {
      const upateInvoice = await invoiceService.updateManyInvoiceProducts(
        invoiceId, invoiceProducts,
      );
      if (upateInvoice) return { statusCode: 200, result: upateInvoice };

      return { statusCode: 400, result: 'Either invoice Id or products is invalid' };
    },
  };

  const show = {
    roles: [],
    action: async (invoiceId) => {
      const invoice = await invoiceService.getInvoiceById(invoiceId);
      if (invoice) return { statusCode: 200, result: invoice };

      return { statusCode: 400, result: 'Invalid Invoice Id.' };
    },
  };

  return {
    create,
    index,
    update,
    updateMany,
    show,
  };
};

module.exports = invoiceController;
