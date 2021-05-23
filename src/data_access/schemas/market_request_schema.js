const {
  Schema, model, Types,
} = require('mongoose');

/**
 * @swagger
 *   definitions:
 *    MarketRequestProduct:
 *      type: object
 *      required:
 *        - product
 *        - quantity
 *        - quantityForm
 *      properties:
 *        quantity:
 *          type: number
 *        quantityForm:
 *          type: string
 *        product:
 *          type: string
 *    MarketRequest:
 *      type: object
 *      required:
 *        - wholesaler
 *        - products
 *      properties:
 *        wholesalers:
 *          type: array
 *          items:
 *            type: string
 *        products:
 *          type: array
 *          items:
 *            $ref: '#/definitions/MarketRequestProduct'
 *
 */
const marketRequestSchema = new Schema({
  retailer: {
    type: Types.ObjectId,
    required: true,
    ref: 'retailers',
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed'],
    default: 'pending',
  },
  listId: { type: String, required: true },
  firebaseId: { type: String },
  wholesaler: {
    type: Types.ObjectId,
    required: true,
    ref: 'wholesalers',
  },
  products: [{
    quantity: { type: Number, required: true, min: 0.5 },
    quantityForm: { type: String, required: true },
    product: {
      type: String,
      required: true,
    },
  }],
}, { timestamps: true });

module.exports = model('market-requests', marketRequestSchema);