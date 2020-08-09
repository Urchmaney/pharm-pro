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
  phoneNumber: { type: String, required: true },
  location: { type: String, default: '' },
}, { timestamps: true });

module.exports = model('wholesalerRetailers', wholesalerRetailerSchema);
