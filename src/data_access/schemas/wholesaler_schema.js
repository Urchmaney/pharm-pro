const { Schema, model } = require('mongoose');

const wholesalerSchema = new Schema({
  companyName: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  phoneNumber: String,
  isDeleted: { type: Boolean, default: false },
  deletedAt: Date,
});

const Wholesaler = model('wholesalers', wholesalerSchema);

module.exports = Wholesaler;
