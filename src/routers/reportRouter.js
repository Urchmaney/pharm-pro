const express = require('express');

const reportRouter = (controller, authMiddlewear) => {
  const router = express.Router();

  /**
  * @swagger
  * /api/reports:
  *  post:
  *    description: Create report.
  *    tags:
  *     - Reports
  *    security:
  *     - bearerAuth: []
  *    parameters:
  *     - in: body
  *       name: report
  *       required: true
  *       schema:
  *         $ref: '#/definitions/Report'
  *    responses:
  *     '200':
  *      description: successfully created.
  */
  router.post('/', authMiddlewear, async (req, res) => {
    req.body.reporter = req.user.id;
    req.body.reporterUserType = req.user.type;
    const { statusCode, result } = await controller.create.action(req.body);
    res.status(statusCode).json(result);
  });

  return router;
};

module.exports = reportRouter;
