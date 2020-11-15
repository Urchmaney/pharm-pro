const {
  Schema, model, Types,
} = require('mongoose');

/**
 * @swagger
 *   definitions:
 *    AcceptProduct:
 *      type: object
 *      required:
 *        - productId
 *        - invoiceId
 *      properties:
 *        productId:
 *          type: string
 *        invoiceId:
 *          type: string
 *    InvoiceProduct:
 *      type: object
 *      required:
 *        - product
 *      properties:
 *        quantity:
 *          type: number
 *        quantityForm:
 *          type: String
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
    type: Types.ObjectId,
    required: true,
    ref: 'retailers',
  },
  isActive: { type: Boolean, default: true },
  hasWholesalerAddedPrice: { type: Boolean, default: false },
  listId: { type: String, required: true },
  wholesaler: {
    type: Types.ObjectId,
    required: true,
    ref: 'wholesalers',
  },
  products: [{
    quantity: { type: Number, required: true, min: 0.5 },
    quantityForm: { type: Types.ObjectId, ref: 'quantityForms', required: true },
    product: {
      type: Types.ObjectId,
      required: true,
      ref: 'products',
    },
    costPrice: { type: Number },
    accepted: { type: Boolean, default: false },
  }],
  totalAmount: { type: Number },
}, { timestamps: true });

module.exports = model('invoices', invoiceSchema);
