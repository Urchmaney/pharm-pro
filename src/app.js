const express = require('express');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('./swagger/swaggerOption');
require('dotenv').config();

const mongoDB = require('./data_access/connect');
const authenticator = require('./authenticator/auth');
const notifier = require('./notification/notifier');
const wholesalerControllerGen = require('./controllers/wholesalerController');
const wholesalerRouterGen = require('./routers/wholesalerRouter');

const startApplication = async () => {
  const app = express();
  const {
    wholesalerService,
  } = await mongoDB(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pharm-pro');

  const wholesalerController = wholesalerControllerGen(wholesalerService, authenticator, notifier);
  const wholesalerRouter = wholesalerRouterGen(wholesalerController);

  app.use(cors());

  app.use(express.json());

  app.use(express.urlencoded({ extended: false }));

  app.use('/api/wholesalers', wholesalerRouter);

  app.use('/', swaggerUI.serve, swaggerUI.setup(swaggerJsDoc));

  return app;
};

module.exports = startApplication;
