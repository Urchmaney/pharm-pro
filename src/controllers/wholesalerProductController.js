/* eslint-disable no-underscore-dangle */
const wholesalerProductController = (wholesalerProductService, productService) => {
  const create = {
    roles: [],
    action: async (wholesalerProduct) => {
      wholesalerProduct = wholesalerProduct || {};
      if (typeof wholesalerProduct.product === 'object') {
        wholesalerProduct.product.isVerified = false;
        const product = await productService.createProduct(wholesalerProduct.product);
        if (!product.status) return { statusCode: 400, result: product.result };

        wholesalerProduct.product = product.result._id;
      }

      const {
        status, result,
      } = await wholesalerProductService.createWholesalerProduct(wholesalerProduct);
      if (status) return { statusCode: 201, result };
      return { statusCode: 400, result };
    },
  };

  const index = {
    roles: [],
    action: async (wholesalerId, type, month = 3) => {
      let products = [];
      if (type && type.toLowerCase() === 'group') {
        products = await wholesalerProductService.getWholesalerProductsByGroups(wholesalerId);
      } else if (type && type.toLowerCase() === 'expiry') {
        products = await wholesalerProductService.getWholesalerProductExpiryBatch(
          wholesalerId, (new Date((new Date()).setMonth((new Date()).getMonth() + month))),
        );
      } else {
        products = await wholesalerProductService.getWholesalerProducts(wholesalerId);
      }
      return { statusCode: 200, result: products };
    },
  };

  const update = {
    roles: [],
    action: async (wholesaler, id, newObj) => {
      const updatedProduct = await wholesalerProductService.updateWholesalerProduct(
        wholesaler, id, newObj,
      );
      if (updatedProduct) return { statusCode: 200, result: updatedProduct };

      return { statusCode: 400, result: ['Invalid Id or bad payload.'] };
    },
  };

  return {
    create,
    index,
    update,
  };
};

module.exports = wholesalerProductController;
