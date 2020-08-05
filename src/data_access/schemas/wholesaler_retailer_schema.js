const { Schema, model } = require('mongoose');

/**
 * @swagger
 *  definitions:
 *    WholesalerRetailer:
 *      type: object
 *      required:
 *        - firstName
 *        - phoneNumber
 *      properties:
 *        fullName:
 *          type: string
 *        phoneNumber:
 *          type: string
 */
const wholesalerRetailerSchema = new Schema({
  wholesalerId: { type: String, required: true },
  fullName: { type: String, required: true },
  active: { type: Boolean, required: true },
  phoneNumber: { type: String, required: true },
}, { timestamps: true });

module.exports = model('wholesalerRetailers', wholesalerRetailerSchema);
