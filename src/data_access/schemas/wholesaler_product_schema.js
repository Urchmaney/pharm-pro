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
 *    FormPrice:
 *        type: object
 *        required:
 *          - form
 *          - price
 *        properties:
 *          form:
 *            type: string
 *          price:
 *            type: number
 *          quantity:
 *            type: number
 */
const wholesalerProductSchema = new Schema({
  wholesaler: { type: String, required: true, ref: 'wholesalers' },
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
});

const wholesalerProduct = model('wholesalerProducts', wholesalerProductSchema);

module.exports = wholesalerProduct;
