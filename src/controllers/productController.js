const productController = (productService) => {
  const create = {
    roles: [],
    action: async (product) => {
      const { status, result } = await productService.createProduct(product);
      if (status) return { statusCode: 201, result };
      return { statusCode: 400, result };
    },
  };

  const index = {
    roles: [],
    action: async () => {
      const products = await productService.getProducts();
      return { statusCode: 200, result: products };
    },
  };

  const show = {
    roles: [],
    action: async (id) => {
      const product = await productService.getProduct(id);
      if (product) return { statusCode: 200, result: product };
      return { statusCode: 400, result: 'invalid id.' };
    },
  };

  const update = {
    roles: [],
    action: async (id, newProduct) => {
      const updatedProduct = await productService.updateProduct(id, newProduct);
      if (updatedProduct) return { statusCode: 200, result: updatedProduct };
      return { statusCode: 400, result: 'invalid id.' };
    },
  };

  return {
    index,
    create,
    show,
    update,
  };
};

module.exports = productController;
