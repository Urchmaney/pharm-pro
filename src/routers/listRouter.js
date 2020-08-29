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

  return router;
};

module.exports = listRouter;
