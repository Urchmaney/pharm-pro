const { Schema, model } = require('mongoose');

/**
 * @swagger
 *  definitions:
 *    QuantityForm:
 *      type: object
 *      required:
 *        - name
 *        - shortForm
 *      properties:
 *        name:
 *          type: string
 *        shortForm:
 *          type: string
 */
const QuantityFormSchema = new Schema({
  name: { type: String, required: true },
  shortForm: { type: String, required: true },
});

module.exports = model('quantityForms', QuantityFormSchema);
