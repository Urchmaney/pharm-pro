/* eslint-disable no-underscore-dangle */
const { v4 } = require('uuid');

const invoiceController = (invoiceService, retailerService, productService, notifier) => {
  const create = {
    roles: [],
    action: async (invoice, retailerId) => {
      if (!Array.isArray(invoice.products) || !Array.isArray(invoice.wholesalers)) {
        return { statusCode: 400, result: 'Invalid parameter. products and wholesaler must be arrays' };
      }
      const aux = async (prod) => {
        const { result } = await productService.createProduct(prod.product);
        prod.product = result._id;
        return prod;
      };

      const iProducts = [];
      invoice.products.forEach(ele => {
        if (typeof ele.product === 'string') iProducts.push(ele);
        else if (typeof ele.product === 'object') {
          ele.product.isVerified = false;
          iProducts.push(aux(ele));
        }
      });

      invoice.products = await Promise.all(iProducts);
      const listId = v4();
      const invoices = [];
      invoice.wholesalers.forEach(ele => {
        const cInvoice = {
          wholesaler: ele,
          retailer: retailerId,
          listId,
          products: invoice.products,
        };
        invoices.push(invoiceService.createInvoice(cInvoice));
      });
      return { statusCode: 201, result: await Promise.all(invoices) };
    },
  };

  const index = {
    roles: [],
    action: async (userId, userType, status) => {
      let invoices = [];
      if (userType === 1) invoices = await invoiceService.getWholesalerInvoices(userId, status);
      if (userType === 2) invoices = await invoiceService.getRetailerInvoices(userId, status);

      return { statusCode: 200, result: invoices };
    },
  };

  const update = {
    roles: [],
    action: async (invoiceId, invoiceProduct, wholesalerId) => {
      const upateInvoice = await invoiceService.updateInvoiceProduct(
        invoiceId, invoiceProduct, wholesalerId,
      );
      if (upateInvoice) return { statusCode: 200, result: upateInvoice };

      return { statusCode: 400, result: 'Either invoice Id or product is invalid' };
    },
  };

  const updateMany = {
    roles: [],
    action: async (invoiceId, invoiceProducts, wholesalerId) => {
      const upateInvoice = await invoiceService.updateManyInvoiceProducts(
        invoiceId, invoiceProducts, wholesalerId,
      );
      if (upateInvoice) {
        const retailerTokens = (await retailerService.getRetailer(upateInvoice.retailer)).tokens;
        await notifier.sendPushNotification(retailerTokens, upateInvoice);
        return { statusCode: 200, result: upateInvoice };
      }

      return { statusCode: 400, result: 'Incorrect invoice Id.' };
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
