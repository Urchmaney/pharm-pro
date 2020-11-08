const QunatityForm = require('../schemas/quantity_form_schema');

const createQuantityForm = async (quantityForm) => {
  quantityForm = new QunatityForm(quantityForm);
  const error = quantityForm.validateSync();
  if (error) {
    return {
      status: false,
      result: Object.keys(error.errors).map(ele => error.errors[ele].message),
    };
  }
  await quantityForm.save();
  return { status: true, result: quantityForm };
};

const getAllQuantityForm = async () => QunatityForm.find({});

module.exports = {
  createQuantityForm,
  getAllQuantityForm,
};
