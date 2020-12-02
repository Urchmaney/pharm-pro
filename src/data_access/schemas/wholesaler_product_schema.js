const {
  Schema,
  model,
  Types,
} = require('mongoose');

/**
 * @swagger
 *  definitions:
 *    UnregisteWholesalerProduct:
 *      type: object
 *      require:
 *        - product
 *      properties:
 *        product:
 *          $ref: '#/definitions/UnregisterProduct'
 *        formPrices:
 *          type: array
 *          items:
 *            $ref: '#/definitions/FormPrice'
 *    UnregisterProduct:
 *      type: object
 *      require:
 *        - name
 *        - medicalName
 *      properties:
 *        name:
 *          type: string
 *        medicalName:
 *          type: string
 *    FormPrice:
 *       type: object
 *       required:
 *         - form
 *         - price
 *       properties:
 *         form:
 *           type: string
 *         price:
 *           type: number
 *         quantity:
 *           type: number
 *    Batch:
 *      type: object
 *      required:
 *        - batchNo
 *        - expiryDate
 *      properties:
 *        batchNo:
 *          type: string
 *        expiryDate:
 *          type: string
 *        quantity:
 *          type: number
 *    WholesalerProduct:
 *      type: object
 *      required:
 *        - productName
 *      properties:
 *        product:
 *          type: string
 *        formPrices:
 *          type: array
 *          items:
 *            $ref: '#/definitions/FormPrice'
 *        batches:
 *          type: array
 *          items:
 *            $ref: '#/definitions/Batch'
 */
const wholesalerProductSchema = new Schema({
  wholesaler: { type: Types.ObjectId, required: true, ref: 'wholesalers' },
  product: {
    type: Types.ObjectId,
    required: true,
    ref: 'products',
  },
  formPrices: [{
    form: { type: Types.ObjectId, ref: 'quantityForms', required: true },
    price: {
      type: Number, default: 0, min: 0, required: true,
    },
    quantity: { type: Number, default: 0, min: 0 },
  }],
  batches: [{
    batchNo: { type: String, required: true },
    expiryDate: { type: Date, required: true },
    quantity: { type: Number },
  }],
});

const wholesalerProduct = model('wholesalerProducts', wholesalerProductSchema);

module.exports = wholesalerProduct;
