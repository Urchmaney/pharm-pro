const { Schema, model } = require('mongoose');

/**
 * @swagger
 *   definitions:
 *    Retailer:
 *      type: object
 *      required:
 *        - fullName
 *        - phoneNumber
 *      properties:
 *        fullName:
 *          type: string
 *        licenseNumber:
 *          type: string
 *        address:
 *          type: string
 *        lga:
 *          type: string
 *        state:
 *          type: string
 *        body:
 *          type: string
 *        phoneNumber:
 *          type: string
 *        registrationNumber:
 *          type: string
 *        profileImage:
 *          type: string
 *
 */
const retailerSchema = new Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (num) => /^\+234[0-9]{10}$/.test(num),
      message: num => `"${num.value}"  is not a valid phone number. +2348010000000 is an example.`,
    },
  },
  fullName: { type: String, required: true },
  address: String,
  lga: String,
  state: String,
  liceneNumber: String,
  country: String,
  body: String,
  registrationNumber: String,
  profileImage: { type: String },
  tokens: [{
    type: String, required: true,
  }],
}, { timestamps: true });

module.exports = model('retailers', retailerSchema);
