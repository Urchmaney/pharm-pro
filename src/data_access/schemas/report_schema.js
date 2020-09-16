const { Schema, model, isValidObjectId } = require('mongoose');

/**
 * @swagger
 *  definitions:
 *    Report:
 *      type: object
 *      required:
 *        - reportee
 *        - title
 *      properties:
 *        reportee:
 *          type: string
 *        title:
 *          type: string
 *        body:
 *          type: string
 */
const reportSchema = new Schema({
  reporter: {
    type: String,
    required: true,
    validate: {
      validator: (_id) => isValidObjectId(_id),
      message: 'Invalid reporter Id.',
    },
  },
  reportee: {
    type: String,
    required: true,
    validate: {
      validator: (_id) => isValidObjectId(_id),
      message: 'Invalid reportee Id',
    },
  },
  reporterUserType: {
    type: Number,
    enum: [1, 2],
    required: true,
  },
  title: { type: String, required: true },
  body: { type: String },
});

module.exports = model('reports', reportSchema);
