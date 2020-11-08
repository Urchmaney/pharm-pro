const QunatityFormController = (quantityFormService) => {
  const create = {
    roles: [],
    action: async (quantityForm) => {
      const result = await quantityFormService.createQuantityForm(quantityForm);
      return { statusCode: 201, result };
    },
  };

  const index = {
    roles: [],
    action: async () => {
      const products = await quantityFormService.getAllQuantityForm();
      return { statusCode: 200, result: products };
    },
  };

  return {
    create,
    index,
  };
};

module.exports = QunatityFormController;
