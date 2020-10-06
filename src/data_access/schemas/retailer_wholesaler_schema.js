const { Schema, model, Types } = require('mongoose');

/**
 * @swagger
 *  definitions:
 *    RetailerWholesaler:
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
const retailerWholesalerSchema = new Schema({
  retailerId: { type: String, required: true },
  wholesalerId: { type: Types.ObjectId, ref: 'wholesalers' },
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

retailerWholesalerSchema.index({ retailerId: 1, phoneNumber: 1 }, { unique: true });

module.exports = model('retailerWholesalers', retailerWholesalerSchema);