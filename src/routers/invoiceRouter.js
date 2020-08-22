const express = require('express');

const invoiceRouter = (
  controller, authMiddleware, retailerAuthMiddleware, wholesaerAuthMiddleware,
) => {
  const router = express.Router();

  /**
  * @swagger
  * /api/invoices:
  *  post:
  *    description: Create invoice.
  *    tags:
  *     - Invoices
  *    security:
  *     - bearerAuth: []
  *    parameters:
  *     - name: invoice
  *       in: body
  *       required: true
  *       schema:
  *         $ref: '#/definitions/Invoice'
  *    responses:
  *     '200':
  *      description: successfully created.
  */
  router.post('/', retailerAuthMiddleware, async (req, res) => {
    const { statusCode, result } = await controller.create.action(req.body);
    res.status(statusCode).json(result);
  });

  /**
   * @swagger
   * /api/invoices:
   *  get:
   *    description: Get all user invoices
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Invoices
   *    responses:
   *      '200':
   *        description: Successfully fetched.
   */
  router.get('/', authMiddleware, async (req, res) => {
    const { statusCode, result } = await controller.index.action(req.user.id, req.user.type);
    res.status(statusCode).json(result);
  });

  /**
   * @swagger
   * /api/invoices/{id}:
   *  get:
   *    description: Get a single invoice
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Invoices
   *    parameters:
   *      - in : path
   *        name: id
   *        required: true
   *    responses:
   *      '200':
   *        description: Successfully fetched.
   */
  router.get('/:id', authMiddleware, async (req, res) => {
    const { statusCode, result } = await controller.show.action(req.params.id);
    res.status(statusCode).json(result);
  });

  /**
   * @swagger
   * /api/invoices/{id}:
   *  put:
   *    description: Update invoice product
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Invoices
   *    parameters:
   *      - in : path
   *        name: id
   *        required: true
   *      - in: body
   *        name: Invoice Product
   *        required: true
   *        schema:
   *          $ref: '#/definitions/InvoiceProduct'
   *    responses:
   *      '200':
   *        description: successfully updated
   */
  router.put('/:id', wholesaerAuthMiddleware, async (req, res) => {
    const { statusCode, result } = await controller.update.action(req.params.id, req.body);
    res.status(statusCode).json(result);
  });

  /**
   * @swagger
   * /api/invoices/{id}/many:
   *  put:
   *    description: Update many invoice product
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Invoices
   *    parameters:
   *      - in : path
   *        name: id
   *        required: true
   *      - in: body
   *        name: Invoice Product
   *        required: true
   *        schema:
   *          type: array
   *          items:
   *            $ref: '#/definitions/InvoiceProduct'
   *    responses:
   *      '200':
   *        description: successfully updated
   */
  router.put('/:id/many', wholesaerAuthMiddleware, async (req, res) => {
    const { statusCode, result } = await controller.updateMany.action(req.params.id, req.body);
    res.status(statusCode).json(result);
  });

  return router;
};

module.exports = invoiceRouter;
