const express = require('express');

const wholesalerRouter = (controller) => {
  const router = express.Router();

  /**
   * @swagger
   * /api/wholesalers:
   *  get:
   *    description: Get all wholesalers.
   *    tags:
   *      -  Wholesalers
   *    name: Wholesalers
   *    produces:
   *      -  application/json
   *    responses:
   *     '200':
   *      description: A list of all wholesalers
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

  /**
  * @swagger
  * /api/wholesalers/{id}:
  *  get:
  *    description: Get wholesalers by id.
  *    tags:
  *      -  Wholesalers
  *    name: Wholesalers
  *    produces:
  *      -  application/json
  *    parameters:
  *      - in: path
  *    responses:
  *     '200':
  *      description: wholesaler with id
  *
  */
  router.get('/:id', async (req, res) => {
    const { statusCode, result } = await controller.show.action(req.params.id);
    res.status(statusCode).json(result);
  });

  /**
  * @swagger
  * /api/wholesalers:
  *  post:
  *    description: Create wholesaler.
  *    tags:
  *     - Wholesalers
  *    parameters:
  *     - name: wholesaler
  *       in: body
  *       required: true
  *       schema:
  *         $ref: '#/definitions/Wholesaler'
  *    responses:
  *     '200':
  *      description: A successful fetch
  */
  router.post('/', async (req, res) => {
    const { statusCode, result } = await controller.create.action(req.body);
    res.status(statusCode).json(result);
  });

  router.put('/:id', async (req, res) => {
    const { statusCode, result } = await controller.update.action(req.params.id, req.body);
    res.status(statusCode).json(result);
  });

  router.delete('/:id', async (req, res) => {
    const { statusCode, result } = await controller.deleteAction.action(req.params.id);
    res.status(statusCode).json(result);
  });

  router.post('/login', async (req, res) => {
    const { statusCode, result } = await controller.login(req.body);
    res.status(statusCode).json(result);
  });
  return router;
};

module.exports = wholesalerRouter;
