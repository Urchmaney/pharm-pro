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
 *
 */
const wholesalerSchema = new Schema({
  fullName: { type: String, required: true },
  companyName: String,
  licenseNumber: String,
  address: String,
  lga: String,
  state: String,
  body: String,
  phoneNumber: { type: String, required: true },
  registrationNumber: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
  profileImage: { data: Buffer, contentType: String },
  deletedAt: Date,
});

const Wholesaler = model('wholesalers', wholesalerSchema);

module.exports = Wholesaler;
