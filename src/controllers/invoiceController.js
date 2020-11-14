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
      for (let i = 0; i < invoice.wholesalers.length; i += 1) {
        const cInvoice = {
          wholesaler: invoice.wholesalers[i],
          retailer: retailerId,
          listId,
          products: invoice.products,
        };
        const { status, result } = invoiceService.validateInvoice(cInvoice);
        if (!status) return { statusCode: 400, result };

        invoices.push(invoiceService.createInvoice(cInvoice));
      }
      return { statusCode: 201, result: await Promise.all(invoices) };
    },
  };

  const index = {
    roles: [],
    action: async (userId, userType, status, priceAdded) => {
      let invoices = [];
      if (userType === 1) {
        invoices = await invoiceService.getWholesalerInvoices(userId, status, priceAdded);
      }
      if (userType === 2) {
        invoices = await invoiceService.getRetailerInvoices(userId, status, priceAdded);
      }
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
        await notifier.sendPushNotification(
          retailerTokens,
          invoiceService.objectToSendRetailerNotification(upateInvoice),
          'Invoice',
          `update from ${upateInvoice.wholesaler.fullName}.`,
        );
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

  const acceptProducts = {
    roles: [],
    action: async (retailerId, invoiceProducts) => {
      if (!Array.isArray(invoiceProducts)) return { statusCode: 400, result: 'Body should be an array.' };

      const arr = [];
      invoiceProducts.forEach(invoiceProduct => {
        arr.push(invoiceService.acceptInvoiceProduct(
          retailerId, invoiceProduct.invoiceId, invoiceProduct.productId,
        ));
      });
      await Promise.all(arr);
      return { statusCode: 200, result: 'invoice products has been accepted' };
    },
  };

  return {
    create,
    index,
    update,
    updateMany,
    show,
    acceptProducts,
  };
};

module.exports = invoiceController;
