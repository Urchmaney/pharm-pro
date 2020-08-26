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
 *        wholesaler:
 *          type: string
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
    quantityType: { type: String, required: true, enum: ['Satchet', 'Packet', 'Box', 'Cartoon'] },
    product: { type: String, required: true, ref: 'products' },
    costPrice: { type: Number },
    accepted: { type: Boolean },
  }],
  totalAmount: { type: Number },
}, { timestamps: true });

module.exports = model('invoices', invoiceSchema);
