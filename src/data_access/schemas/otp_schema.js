const { Schema, model } = require('mongoose');

const otpSchema = new Schema({
  otp: { type: String, required: true },
  expiration: { type: Date, required: true },
  userType: { type: Number, required: true },
  phoneNumber: { type: String, required: true },
});

const otps = model('otps', otpSchema);

module.exports = otps;
