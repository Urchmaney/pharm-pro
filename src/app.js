const express = require('express');
const multer = require('multer');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('./swagger/swaggerOption');
require('dotenv').config();

const mongoDB = require('./data_access/connect');
const authenticator = require('./authenticator/auth');
const notifier = require('./notification/notifier');
const uploader = require('./file_uploader/cloudinary_file_uploader');

const wholesalerControllerGen = require('./controllers/wholesalerController');
const wholesalerRouterGen = require('./routers/wholesalerRouter');

const retailerControllerGen = require('./controllers/retailerController');
const retailerRouterGen = require('./routers/retailerRouter');

const retailerWholesalerControllerGen = require('./controllers/retailerWholesalerController');
const retailerWholesalerRouterGen = require('./routers/retailerWholesalerRouter');

const productControllerGen = require('./controllers/productController');
const productRouterGen = require('./routers/productRouter');

const wholesalerRetailerControllerGen = require('./controllers/wholesalerRetailerController');
const wholesalerRetailerRouterGen = require('./routers/wholesalerRetailerRouter');

const wholesalerProductControllerGen = require('./controllers/wholesalerProductController');
const wholesalerProductRouterGen = require('./routers/wholesalerProductRouter');

const {
  authWholesalerMiddleware, authRetailerMiddleware,
} = require('./middlewares/auth_middleware');

const wholesalerAuthMiddleware = authWholesalerMiddleware(authenticator);
const retailerAuthMiddlewere = authRetailerMiddleware(authenticator);
const fileUploadMiddleware = require('./middlewares/file_upload_middleware');

const startApplication = async () => {
  const app = express();
  const {
    wholesalerService,
    otpService,
    productService,
    wholesalerProductService,
    retailerService,
  } = await mongoDB(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pharm-pro');

  const wholesalerController = wholesalerControllerGen(wholesalerService,
    otpService, authenticator, notifier, uploader);
  const wholesalerRouter = wholesalerRouterGen(
    wholesalerController, fileUploadMiddleware, wholesalerAuthMiddleware,
  );

  const retailerController = retailerControllerGen(
    retailerService, otpService, authenticator, notifier,
  );
  const retailerRouter = retailerRouterGen(
    retailerController, fileUploadMiddleware, retailerAuthMiddlewere,
  );

  const retailerWholesalerController = retailerWholesalerControllerGen(
    retailerService, wholesalerService,
  );
  const retailerWholesalerRouter = retailerWholesalerRouterGen(
    retailerWholesalerController, retailerAuthMiddlewere,
  );

  const productController = productControllerGen(productService);
  const productRouter = productRouterGen(productController);

  const wholesalerRetailerController = wholesalerRetailerControllerGen(
    wholesalerService, retailerService,
  );
  const wholesalerRetailerRouter = wholesalerRetailerRouterGen(
    wholesalerRetailerController, wholesalerAuthMiddleware,
  );

  const wholesalerProductController = wholesalerProductControllerGen(
    wholesalerProductService,
  );
  const wholesalerProductRouter = wholesalerProductRouterGen(
    wholesalerProductController, wholesalerAuthMiddleware,
  );

  app.use(cors());

  app.use(express.json());

  app.use(express.urlencoded({ extended: false }));

  app.use('/api/wholesalers/products', wholesalerProductRouter);

  app.use('/api/wholesalers/retailers', wholesalerRetailerRouter);

  app.use('/api/wholesalers', wholesalerRouter);

  app.use('/api/retailers/wholesalers', retailerWholesalerRouter);

  app.use('/api/retailers', retailerRouter);

  app.use('/api/products', productRouter);

  app.use('/', swaggerUI.serve, swaggerUI.setup(swaggerJsDoc));

  app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      res.status(400).json(err.message);
    }
    next();
  });

  return app;
};

module.exports = startApplication;
