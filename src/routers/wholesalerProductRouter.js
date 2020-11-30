const express = require('express');

const wholesalerProductRouter = (controller, authMiddlewear) => {
  const router = express.Router();

  /**
  * @swagger
  * /api/wholesalers/products:
  *  post:
  *    description: add wholesaler product.
  *    security:
  *     - bearerAuth: []
  *    tags:
  *     - Wholesaler Products
  *    parameters:
  *     - name: wholesaler products
  *       in: body
  *       required: true
  *       schema:
  *         $ref: '#/definitions/WholesalerProduct'
  *    responses:
  *     '200':
  *      description: successfully created.
  */
  router.post('/', authMiddlewear, async (req, res) => {
    req.body.wholesaler = req.user.id;
    const { statusCode, result } = await controller.create.action(req.body);
    res.status(statusCode).json(result);
  });


  /**
   * @swagger
   * /api/wholesalers/products:
   *  get:
   *    description: Get all wholesaler products
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Wholesaler Products
   *    parameters:
   *      - in: query
   *        name: type
   *    responses:
   *      '200':
   *        description: Successfully fetched.
   */
  router.get('/', authMiddlewear, async (req, res) => {
    const { statusCode, result } = await controller.index.action(req.user.id, req.query.type);
    res.status(statusCode).json(result);
  });

  /**
   * @swagger
   * /api/wholesalers/products/{id}:
   *  put:
   *    description: Update wholesaler product
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Wholesaler Products
   *    parameters:
   *      - in : path
   *        name: id
   *        required: true
   *      - in: body
   *        name: wholesaler Product
   *        required: true
   *        schema:
   *          $ref: '#/definitions/WholesalerProduct'
   *    responses:
   *      '200':
   *        description: successfully updated
   */
  router.put('/:id', authMiddlewear, async (req, res) => {
    const {
      statusCode, result,
    } = await controller.update.action(req.user.id, req.params.id, req.body);
    res.status(statusCode).json(result);
  });
  return router;
};

module.exports = wholesalerProductRouter;
