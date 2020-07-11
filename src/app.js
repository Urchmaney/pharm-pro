const express = require('express');
const cors = require('cors');

const mongoDB = require('./data_access/connect');
const authenticator = require('./authenticator/auth');
const wholesalerControllerGen = require('./controllers/wholesalerController');
const wholesalerRouterGen = require('./routers/wholesalerRouter');

const startApplication = async () => {
  const app = express();
  const {
    wholesalerService,
  } = await mongoDB('mongodb://127.0.0.1:27017/pharm-pro');

  const wholesalerController = wholesalerControllerGen(wholesalerService, authenticator);
  const wholesalerRouter = wholesalerRouterGen(wholesalerController);

  app.use(cors());

  app.use(express.json());

  app.use(express.urlencoded({ extended: false }));

  app.use('/api/wholesalers', wholesalerRouter);

  return app;
};

module.exports = startApplication;
