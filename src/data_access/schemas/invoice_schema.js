const { Schema, model } = require('mongoose');

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
 *        product:
 *          type: string
 *        costPrice:
 *          type: number
 *        price:
 *          type: number
 *    Invoice:
 *      type: object
 *      required:
 *        - retailer
 *        - wholesaler
 *      properties:
 *        retailer:
 *          type: string
 *        wholesaler:
 *          type: string
 *        totalNumber:
 *          type: number
 *        products:
 *          type: array
 *          items:
 *            $ref: '#/definitions/InvoiceProduct'
 *
 */
const invoiceSchema = new Schema({
  retailer: { type: String, required: true, ref: 'retailers' },
  wholesaler: { type: String, required: true, ref: 'wholesalers' },
  products: [{
    quantity: { type: Number, required: true },
    product: { type: String, required: true, ref: 'products' },
    costPrice: { type: Number },
    price: { type: Number },
    accepted: { type: Boolean },
  }],
  totalAmount: { type: Number },
});

module.exports = model('invoices', invoiceSchema);
