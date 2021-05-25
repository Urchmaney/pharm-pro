const express = require('express');

const agentRouter = (controller) => {
  const router = express.Router();

  /**
  * @swagger
  * /api/v2/market/agents:
  *  post:
  *    description: Create a market agent.
  *    tags:
  *     - Agent
  *    parameters:
  *     - name: agent
  *       in: body
  *       required: true
  *       schema:
  *         $ref: '#/definitions/Agent'
  *    responses:
  *     '200':
  *      description: successfully created.
  */
  router.post('/', async (req, res) => {
    const { statusCode, result } = await controller.create.action(req.body);
    res.status(statusCode).json(result);
  });

  return router;
};

module.exports = agentRouter;
