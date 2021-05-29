const {
  Schema, model,
} = require('mongoose');

/**
 * @swagger
 *   definitions:
 *    Agent:
 *      type: object
 *      required:
 *        - fullName
 *        - phoneNumber
 *        - password
 *      properties:
 *        fullName:
 *          type: string
 *        password:
 *          type: string
 *        address:
 *          type: string
 *        phoneNumber:
 *          type: string
 *
 */
const AgentSchema = new Schema({
  fullName: { type: String, required: true },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (num) => /^\+234[0-9]{10}$/.test(num),
      message: num => `"${num.value}"  is not a valid phone number. +2348010000000 is an example.`,
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: (pwd) => pwd.length >= 6,
      message: () => 'Passwod is too short. Minimum of 6 characters.',
    },
  },
  address: { type: String },
});

module.exports = model('agents', AgentSchema);
