const { Schema, model } = require('mongoose');


/**
 * @swagger
 *   definitions:
 *    Wholesaler:
 *      type: object
 *      required:
 *        - fullName
 *        - phoneNumber
 *      properties:
 *        fullName:
 *          type: string
 *        companyName:
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
const wholesalerSchema = new Schema({
  fullName: { type: String, required: true },
  companyName: String,
  licenseNumber: String,
  address: String,
  lga: String,
  state: String,
  country: String,
  body: String,
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (num) => /^\+234[0-9]{10}$/.test(num),
      message: num => `"${num.value}"  is not a valid phone number. +2348010000000 is an example.`,
    },
  },
  registrationNumber: { type: String },
  isDeleted: { type: Boolean, default: false },
  profileImage: { type: String },
  deletedAt: Date,
  tokens: [{
    type: String, required: true,
  }],
}, { timestamps: true });

const Wholesaler = model('wholesalers', wholesalerSchema);

module.exports = Wholesaler;
