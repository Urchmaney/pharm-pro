const { Schema, model } = require('mongoose');

const wholesalerSchema = new Schema({
  companyName: String,
  licenseNumber: { type: String, required: true },
  phoneNumber: String,
  isDeleted: Boolean,
  deletedAt: Date,
});

const Wholesaler = model('wholesalers', wholesalerSchema);

module.exports = Wholesaler;
