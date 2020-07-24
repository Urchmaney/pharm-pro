const { Schema, model } = require('mongoose');

/**
 * @swagger
 *  definitions:
 *    wholesalerProduct:
 *      type: object
 *      required:
 *        - productName
 *      properties:
 *        productName:
 *          type: string
 *        productType:
 *          type: string
 *        pricePerPacket:
 *          type: number
 *        pricePerBox:
 *          type: number
 *        pricePerCarton:
 *          type: number
 *        quantity:
 *          type: number
 */
const wholesalerProductSchema = new Schema({
  wholesalerId: { type: String, required: true },
  productId: { type: String, required: true },
  prodcutName: { type: String, required: true },
  productType: { type: String },
  pricePerPacket: { type: Number },
  pricePerBox: { type: Number },
  pricePerCarton: { type: Number },
  quantity: { type: Number },
});

const wholesalerProduct = model('wholesaleProducts', wholesalerProductSchema);

module.exports = wholesalerProduct;
