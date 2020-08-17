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
    action: async (search) => {
      const products = await productService.getProducts(search);
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

  const createMany = {
    roles: [],
    action: async (products) => {
      const { status, result } = await productService.createManyProducts(products);
      if (status) return { statusCode: 201, result };
      return { statusCode: 400, result };
    },
  };

  return {
    index,
    create,
    show,
    update,
    createMany,
  };
};

module.exports = productController;
