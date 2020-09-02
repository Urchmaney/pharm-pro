const express = require('express');

const retailerWholesalerRouter = (controller, authMiddlewear) => {
  const router = express.Router();

  /**
  * @swagger
  * /api/retailers/wholesalers:
  *  post:
  *    description: Create retailer wholesaler.
  *    security:
  *     - bearerAuth: []
  *    tags:
  *     - Retailer Wholesalers
  *    parameters:
  *     - name: retailer wholesaler
  *       in: body
  *       required: true
  *       schema:
  *         $ref: '#/definitions/RetailerWholesaler'
  *    responses:
  *     '200':
  *      description: successfully created.
  */
  router.post('/', authMiddlewear, async (req, res) => {
    req.body = req.body || {};
    req.body.retailerId = req.user.id;
    const { statusCode, result } = await controller.create.action(req.body);
    res.status(statusCode).json(result);
  });

  /**
   * @swagger
   * /api/retailers/wholesalers:
   *  get:
   *    description: Get all retailer wholesalers
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Retailer Wholesalers
   *    responses:
   *      '200':
   *        description: Successfully fetched.
   */
  router.get('/', authMiddlewear, async (req, res) => {
    const { statusCode, result } = await controller.index.action(req.user.id);
    res.status(statusCode).json(result);
  });

  /**
   * @swagger
   * /api/retailers/wholesalers/{id}:
   *  put:
   *    description: Update retailer Wholesaler
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Retailer Wholesalers
   *    parameters:
   *      - in : path
   *        name: id
   *        required: true
   *      - in: body
   *        name: Retailer Wholesaler
   *        required: true
   *        schema:
   *          $ref: '#/definitions/RetailerWholesaler'
   *    responses:
   *      '200':
   *        description: successfully updated
   */
  router.put('/:id', authMiddlewear, async (req, res) => {
    const { statusCode, result } = await controller.update.action(req.params.id, req.body);
    res.status(statusCode).json(result);
  });

  return router;
};

module.exports = retailerWholesalerRouter;
