const {
  Schema,
  model,
  isValidObjectId,
  Types,
} = require('mongoose');
const Product = require('./product_schema');
const Wholesaler = require('./wholesaler_schema');

/**
 * @swagger
 *  definitions:
 *    wholesalerProduct:
 *      type: object
 *      required:
 *        - productName
 *      properties:
 *        productId:
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
  wholesaler: {
    type: String,
    required: true,
    ref: 'wholesalers',
    validate: {
      validator: (_id) => {
        if (!isValidObjectId(_id)) return false;
        return Wholesaler.exists({ _id: Types.ObjectId(_id) });
      },
      message: 'Invalid wholesalerId',
    },
  },
  product: {
    type: String,
    required: true,
    ref: 'products',
    validate: {
      validator: (_id) => {
        if (!isValidObjectId(_id)) return false;
        return Product.exists({ _id: Types.ObjectId(_id) });
      },
      message: 'Invalid product Id.',
    },
  },
  pricePerPacket: { type: Number, default: 0, min: 0 },
  pricePerBox: { type: Number, default: 0, min: 0 },
  pricePerCarton: { type: Number, default: 0, min: 0 },
  quantity: { type: Number, default: 0, min: 0 },
});

const wholesalerProduct = model('wholesaleProducts', wholesalerProductSchema);

module.exports = wholesalerProduct;
