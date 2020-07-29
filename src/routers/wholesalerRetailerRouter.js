const express = require('express');

const wholesalerRetailerRouter = (controller, authMiddlewear) => {
  const router = express.Router();

  /**
  * @swagger
  * /api/wholesalers/retailers:
  *  post:
  *    description: Create wholesaler retailer.
  *    security:
  *     - bearerAuth: []
  *    tags:
  *     - Wholesaler Retailers
  *    parameters:
  *     - name: wholesaler retailer
  *       in: body
  *       required: true
  *       schema:
  *         $ref: '#/definitions/WholesalerRetailer'
  *    responses:
  *     '200':
  *      description: successfully created.
  */
  router.post('/', authMiddlewear, async (req, res) => {
    req.body.wholesalerId = req.user.id;
    const { statusCode, result } = await controller.create.action(req.body);
    res.status(statusCode).json(result);
  });


  /**
   * @swagger
   * /api/wholesalers/retailers:
   *  get:
   *    description: Get all wholesaler retailers
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Wholesaler Retailers
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
   * /api/wholesalers/retailers/{id}:
   *  put:
   *    description: Update wholesaler Retailer
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Wholesaler Retailers
   *    parameters:
   *      - in : path
   *        name: id
   *        required: true
   *      - in: body
   *        name: wholesaler Retailer
   *        required: true
   *        schema:
   *          $ref: '#/definitions/WholesalerRetailer'
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

module.exports = wholesalerRetailerRouter;
