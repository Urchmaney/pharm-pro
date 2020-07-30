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
 *          type: file
 *
 */
const retailerSchema = new Schema({
  phoneNumber: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  address: String,
  lga: String,
  state: String,
  liceneNumber: String,
  country: String,
  body: String,
  registrationNumber: String,
  profileImage: { data: Buffer, contentType: String },
}, { timestamps: true });

module.exports = model('retailers', retailerSchema);
