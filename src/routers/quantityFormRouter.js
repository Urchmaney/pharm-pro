const express = require('express');

const quantityFormRouter = (controller) => {
  const router = express.Router();

  /**
  * @swagger
  * /api/quantity_forms:
  *  post:
  *    description: Create quantity form.
  *    tags:
  *     - Quantity Forms
  *    parameters:
  *     - in: body
  *       name: quantity form
  *       required: true
  *       schema:
  *         $ref: '#/definitions/QuantityForm'
  *    responses:
  *     '200':
  *      description: successfully created.
  */
  router.post('/', async (req, res) => {
    const { statusCode, result } = await controller.create.action(req.body);
    res.status(statusCode).json(result);
  });


  /**
   * @swagger
   * /api/quantity_forms:
   *  get:
   *    description: Get all quantity forms.
   *    tags:
   *      -  Quantity Forms
   *    name: Quantity Forms
   *    produces:
   *      -  application/json
   *    responses:
   *     '200':
   *      description: A list of all retailers
   *      content:
   *        application/json:
   *          schema:
   *            type: array
   *            items: object
   */
  router.get('/', async (req, res) => {
    const { statusCode, result } = await controller.index.action();
    res.status(statusCode).json(result);
  });

  return router;
};

module.exports = quantityFormRouter;
