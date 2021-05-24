const express = require('express');
const serializer = require('../serializers/marketRequestSerializer');

const marketRequestRouter = (
  controller, retailerAuthMiddleware,
) => {
  const router = express.Router();

  /**
  * @swagger
  * /api/v2/market/requests:
  *  post:
  *    description: Create market request.
  *    tags:
  *     - Market Request
  *    security:
  *     - bearerAuth: []
  *    parameters:
  *     - name: market request
  *       in: body
  *       required: true
  *       schema:
  *         $ref: '#/definitions/MarketRequest'
  *    responses:
  *     '200':
  *      description: successfully created.
  */
  router.post('/', retailerAuthMiddleware, async (req, res) => {
    const { statusCode, result } = await controller.create.action(req.body, req.user.id);
    res.status(statusCode).json(result.map(x => serializer(x)));
  });

  /**
   * @swagger
   * /api/v2/market/requests:
   *  get:
   *    description: Get all pending market requests
   *    tags:
   *      - Market Request
   *    responses:
   *      '200':
   *        description: Successfully fetched.
   */
  router.get('/', async (req, res) => {
    const { statusCode, result } = await controller.index.action();
    res.status(statusCode).json(result);
  });

  return router;
};

module.exports = marketRequestRouter;
