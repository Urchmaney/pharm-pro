const express = require('express');

const wholesalerRouter = (controller) => {
  const router = express.Router();
  router.get('/', async (req, res) => {
    const { statusCode, result } = await controller.index.action();
    res.status(statusCode).json(result);
  });

  router.get('/:id', async (req, res) => {
    const { statusCode, result } = await controller.show.action(req.params.id);
    res.status(statusCode).json(result);
  });

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
