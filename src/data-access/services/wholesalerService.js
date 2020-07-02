const Wholesaler = require('../schemas/wholesaler_schema');

const addWholesaler = async (wholesalerObj) => {
  const wholesaler = new Wholesaler(wholesalerObj);
  const error = wholesaler.validateSync();
  if (error) return { status: false, error };
  await wholesaler.save();
  return { status: true, wholesaler };
};

module.exports = {
  addWholesaler,
};
