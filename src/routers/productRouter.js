const express = require('express');

const productRouter = (controller) => {
  const router = express.Router();

  /**
   * @swagger
   * /api/products:
   *  get:
   *    description: Get  all product
   *    tags:
   *      - Products
   *    name: Products
   *    produces:
   *      - application/json
   *    parameters:
   *      - in: query
   *        name: search
   *    responses:
   *      '200':
   *       description: Products List
   *      content:
   *        application/json:
   *          schema:
   *            type: array
   *            items: object
   */
  router.get('/', async (req, res) => {
    const { statusCode, result } = await controller.index.action(req.query.search);
    res.status(statusCode).json(result);
  });

  /**
  * @swagger
  * /api/products/{id}:
  *  get:
  *    description: Get product by id.
  *    tags:
  *      -  Products
  *    name: Products
  *    produces:
  *      -  application/json
  *    parameters:
  *      - in: path
  *        name: id
  *    responses:
  *     '200':
  *      description: Product
  *
  */
  router.get('/:id', async (req, res) => {
    const { statusCode, result } = await controller.show.action(req.params.id);
    res.status(statusCode).json(result);
  });

  /**
  * @swagger
  * /api/products:
  *  post:
  *    description: Create product.
  *    tags:
  *     - Products
  *    parameters:
  *     - in: body
  *       name: product
  *       required: true
  *       schema:
  *         $ref: '#/definitions/Product'
  *    responses:
  *     '200':
  *      description: successfully updated.
  */
  router.post('/', async (req, res) => {
    const { statusCode, result } = await controller.create.action(req.body);
    res.status(statusCode).json(result);
  });

  /**
  * @swagger
  * /api/products/{id}:
  *  put:
  *    description: update product.
  *    tags:
  *     - Products
  *    parameters:
  *     - in : path
  *       name: id
  *     - in: body
  *       name: product
  *       required: true
  *       schema:
  *         $ref: '#/definitions/Product'
  *    responses:
  *     '200':
  *      description: successfully updated.
  */
  router.put('/:id', async (req, res) => {
    const { statusCode, result } = await controller.update.action(req.params.id, req.body);
    res.status(statusCode).json(result);
  });

  /**
  * @swagger
  * /api/products/many:
  *  post:
  *    description: Create many products.
  *    tags:
  *     - Products
  *    parameters:
  *     - in: body
  *       name: product
  *       required: true
  *       schema:
  *         type: array
  *         items:
  *           $ref: '#/definitions/Product'
  *    responses:
  *     '200':
  *      description: successfully updated.
  */
  router.post('/many', async (req, res) => {
    const { statusCode, result } = await controller.createMany.action(req.body);
    res.status(statusCode).json(result);
  });

  /**
  * @swagger
  * /api/products/{id}:
  *  delete:
  *    description: Delete Product by id.
  *    tags:
  *      -  Products
  *    name: Products
  *    produces:
  *      -  application/json
  *    parameters:
  *      - in: path
  *        name: id
  *    responses:
  *     '200':
  *      description: Delete product with id
  *
  */
  router.delete('/:id', async (req, res) => {
    const { statusCode, result } = await controller.deleteObj.action(req.params.id);
    res.status(statusCode).json(result);
  });

  return router;
};

module.exports = productRouter;
