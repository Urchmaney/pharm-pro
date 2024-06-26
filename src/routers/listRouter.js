const express = require('express');

const listRouter = (
  controller, retailerAuthMiddleware,
) => {
  const router = express.Router();

  /**
   * @swagger
   * /api/lists:
   *  get:
   *    description: Get all retailer Lists
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Lists
   *    parameters:
   *      - in : query
   *        name: active
   *        type: booleans
   *    responses:
   *      '200':
   *        description: Successfully fetched.
   */
  router.get('/', retailerAuthMiddleware, async (req, res) => {
    const { statusCode, result } = await controller.index.action(
      req.user.id, req.query.active,
    );
    res.status(statusCode).json(result);
  });

  /**
   * @swagger
   * /api/lists/close:
   *  put:
   *    description: Close retailer list
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Lists
   *    parameters:
   *      - in : body
   *        name: listId
   *        type: object
   *        properties:
   *          listId:
   *            type: string
   *    responses:
   *      '200':
   *        description: Successfully updated.
   */
  router.put('/close', retailerAuthMiddleware, async (req, res) => {
    const { statusCode, result } = await controller.closeList.action(
      req.user.id, req.body.listId,
    );
    res.status(statusCode).json(result);
  });

  /**
   * @swagger
   * /api/lists/product-prices:
   *  get:
   *    description: Get list product prices
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Lists
   *    parameters:
   *      - in : query
   *        name: listId
   *        type: string
   *      - in : query
   *        name: productId
   *        type: string
   *    responses:
   *      '200':
   *        description: Successfully fetched.
   */
  router.get('/product-prices', retailerAuthMiddleware, async (req, res) => {
    const { statusCode, result } = await controller.productPrices.action(
      req.query.listId, req.query.productId,
    );
    res.status(statusCode).json(result);
  });

  /**
   * @swagger
   * /api/lists/{id}:
   *  get:
   *    description: Get a single list
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Lists
   *    parameters:
   *      - in : path
   *        name: id
   *        required: true
   *    responses:
   *      '200':
   *        description: Successfully fetched.
   */
  router.get('/:id', retailerAuthMiddleware, async (req, res) => {
    const { statusCode, result } = await controller.show.action(req.params.id);
    res.status(statusCode).json(result);
  });

  /**
   * @swagger
   * /api/lists/{id}/related-products:
   *  get:
   *    description: Get a list related products
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Lists
   *    parameters:
   *      - in : path
   *        name: id
   *        required: true
   *    responses:
   *      '200':
   *        description: Successfully fetched.
   */
  router.get('/:id/related-products', retailerAuthMiddleware, async (req, res) => {
    const {
      statusCode, result,
    } = await controller.relatedProducts.action(req.user.id, req.params.id);
    res.status(statusCode).json(result);
  });

  return router;
};

module.exports = listRouter;
