const {
  Schema,
  model,
  isValidObjectId,
} = require('mongoose');

/**
 * @swagger
 *  definitions:
 *    WholesalerProduct:
 *      type: object
 *      required:
 *        - productName
 *      properties:
 *        product:
 *          type: string
 *        pricePerPacket:
 *          type: number
 *        pricePerBox:
 *          type: number
 *        pricePerCarton:
 *          type: number
 *        pricePerSatchet:
 *          type: number
 *        quantity:
 *          type: number
 */
const wholesalerProductSchema = new Schema({
  wholesaler: { type: String, required: true, ref: 'wholesalers' },
  product: {
    type: String,
    required: true,
    ref: 'products',
    validate: {
      validator: (_id) => isValidObjectId(_id),
      message: 'Invalid product Id.',
    },
  },
  pricePerPacket: { type: Number, default: 0, min: 0 },
  pricePerBox: { type: Number, default: 0, min: 0 },
  pricePerCarton: { type: Number, default: 0, min: 0 },
  pricePerSatchet: { type: Number, default: 0, min: 0 },
  quantity: { type: Number, default: 0, min: 0 },
});

const wholesalerProduct = model('wholesaleProducts', wholesalerProductSchema);

module.exports = wholesalerProduct;
