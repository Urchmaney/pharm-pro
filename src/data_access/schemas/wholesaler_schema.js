const { Schema, model } = require('mongoose');

const wholesalerSchema = new Schema({
  fullName: { type: String, require: true },
  companyName: String,
  licenseNumber: String,
  address: String,
  body: String,
  phoneNumber: { type: String, required: true },
  registrationNumber: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
  deletedAt: Date,
});

const Wholesaler = model('wholesalers', wholesalerSchema);

module.exports = Wholesaler;
