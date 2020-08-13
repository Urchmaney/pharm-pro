const { Schema, model } = require('mongoose');

/**
 * @swagger
 *  definitions:
 *    Product:
 *      type: object
 *      required:
 *        - name
 *      properties:
 *        name:
 *          type: string
 *        medicalName:
 *          type: string
 *        companyName:
 *          type: string
 *        form:
 *          type: string
 *        image:
 *          type: buffer
 */
const productShema = new Schema({
  name: { type: String, required: true },
  medicalName: { type: String },
  companyName: { type: String },
  form: { type: String },
  image: { data: Buffer, contentType: String },
});

const product = model('products', productShema);

module.exports = product;
