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

const productControllerGen = require('./controllers/productController');
const productRouterGen = require('./routers/productRouter');

// const authMiddleware = require('./middlewares/auth_middleware');
const fileUploadMiddleware = require('./middlewares/file_upload_middleware');

const startApplication = async () => {
  const app = express();
  const {
    wholesalerService,
    otpService,
    productService,
  } = await mongoDB(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pharm-pro');

  const wholesalerController = wholesalerControllerGen(wholesalerService,
    otpService, authenticator, notifier);
  const wholesalerRouter = wholesalerRouterGen(wholesalerController, fileUploadMiddleware);

  const productController = productControllerGen(productService);
  const productRouter = productRouterGen(productController);

  app.use(cors());

  app.use(express.json());

  app.use(express.urlencoded({ extended: false }));

  app.use('/api/wholesalers', wholesalerRouter);

  app.use('/api/products', productRouter);

  app.use('/', swaggerUI.serve, swaggerUI.setup(swaggerJsDoc));

  return app;
};

module.exports = startApplication;
