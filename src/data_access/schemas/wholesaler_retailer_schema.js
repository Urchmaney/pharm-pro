const { Schema, model } = require('mongoose');

/**
 * @swagger
 *  definitions:
 *    WholesalerRetailer:
 *      type: object
 *      required:
 *        - fullName
 *        - phoneNumber
 *      properties:
 *        fullName:
 *          type: string
 *        phoneNumber:
 *          type: string
 *        location:
 *          type: string
 */
const wholesalerRetailerSchema = new Schema({
  wholesalerId: { type: String, required: true },
  fullName: { type: String, required: true },
  active: { type: Boolean, required: true },
  phoneNumber: {
    type: String,
    required: true,
    validate: {
      validator: (num) => /^\+234[0-9]{10}$/.test(num),
      message: num => `"${num.value}"  is not a valid phone number. +2348010000000 is an example.`,
    },
  },
  location: { type: String, default: '' },
}, { timestamps: true });

module.exports = model('wholesalerRetailers', wholesalerRetailerSchema);
