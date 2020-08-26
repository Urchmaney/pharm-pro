const { Schema, model, isValidObjectId } = require('mongoose');

/**
 * @swagger
 *   definitions:
 *    InvoiceProduct:
 *      type: object
 *      required:
 *        - product
 *      properties:
 *        quantity:
 *          type: number
 *        quantityType:
 *          type: enum
 *          enum: [Carton, Satchet, Packet, Box]
 *        product:
 *          type: string
 *        costPrice:
 *          type: number
 *    Invoice:
 *      type: object
 *      required:
 *        - retailer
 *        - wholesaler
 *      properties:
 *        wholesalers:
 *          type: array
 *          items:
 *            type: string
 *        products:
 *          type: array
 *          items:
 *            $ref: '#/definitions/InvoiceProduct'
 *
 */
const invoiceSchema = new Schema({
  retailer: {
    type: String,
    required: true,
    ref: 'retailers',
    validate: {
      validator: (_id) => isValidObjectId(_id),
      message: 'Invalid retailer Id.',
    },
  },
  isClosed: { type: Boolean, default: false },
  groupId: { type: String, required: true },
  wholesaler: {
    type: String,
    required: true,
    ref: 'wholesalers',
    validate: {
      validator: (_id) => isValidObjectId(_id),
      message: 'Invalid wholesaler Id.',
    },
  },
  products: [{
    quantity: { type: Number, required: true, min: 0.5 },
    quantityType: { type: String, required: true, enum: ['Satchet', 'Packet', 'Box', 'Carton'] },
    product: {
      type: String,
      required: true,
      ref: 'products',
      validate: {
        validator: (_id) => isValidObjectId(_id),
        message: 'Invalid product Id.',
      },
    },
    costPrice: { type: Number },
    accepted: { type: Boolean },
  }],
  totalAmount: { type: Number },
}, { timestamps: true });

module.exports = model('invoices', invoiceSchema);
