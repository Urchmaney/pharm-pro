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
const firebase = require('./firebase/index');

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

const invoiceControllerGen = require('./controllers/invoiceController');
const invoiceRouterGen = require('./routers/invoiceRouter');

const marketRequestControllerGen = require('./controllers/marketRequestController');
const marketRequestRouterGen = require('./routers/marketRequestRouter');

const listControllerGen = require('./controllers/listController');
const listRouterGen = require('./routers/listRouter');

const reportControllerGen = require('./controllers/reportController');
const reportRouterGen = require('./routers/reportRouter');

const quantityFormControllerGen = require('./controllers/quantityFormController');
const quantityFormRouterGen = require('./routers/quantityFormRouter');

const agentControllerGen = require('./controllers/agent_controller');
const agentRouterGen = require('./routers/agentRouter');

const {
  authWholesalerMiddleware, authRetailerMiddleware, authMiddleware,
} = require('./middlewares/auth_middleware');

const wholesalerAuthMiddleware = authWholesalerMiddleware(authenticator);
const retailerAuthMiddlewere = authRetailerMiddleware(authenticator);
const combineAuthMiddleware = authMiddleware(authenticator);
const fileUploadMiddleware = require('./middlewares/file_upload_middleware');

const startApplication = async () => {
  const app = express();
  const {
    wholesalerService,
    otpService,
    productService,
    wholesalerProductService,
    retailerService,
    invoiceService,
    reportService,
    quantityFormService,
    helpService,
    marketRequestService,
    agentService,
  } = await mongoDB(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pharm-pro');

  const wholesalerController = wholesalerControllerGen(wholesalerService,
    retailerService, otpService, authenticator, notifier, uploader);
  const wholesalerRouter = wholesalerRouterGen(
    wholesalerController, fileUploadMiddleware, wholesalerAuthMiddleware,
  );

  const retailerController = retailerControllerGen(
    retailerService, wholesalerService, otpService, authenticator, notifier, uploader,
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
    wholesalerProductService, productService,
  );
  const wholesalerProductRouter = wholesalerProductRouterGen(
    wholesalerProductController, wholesalerAuthMiddleware,
  );

  const invoiceController = invoiceControllerGen(
    invoiceService, retailerService, productService, notifier, firebase,
  );
  const invoiceRouter = invoiceRouterGen(
    invoiceController, combineAuthMiddleware, retailerAuthMiddlewere, wholesalerAuthMiddleware,
  );

  const marketRequestController = marketRequestControllerGen(
    marketRequestService, firebase,
  );
  const marketRequestRouter = marketRequestRouterGen(
    marketRequestController, retailerAuthMiddlewere,
  );

  const agentController = agentControllerGen(agentService, authenticator);
  const agentRouter = agentRouterGen(agentController);

  const listController = listControllerGen(invoiceService, productService);
  const listRouter = listRouterGen(listController, retailerAuthMiddlewere);

  const reportController = reportControllerGen(reportService);
  const reportRouter = reportRouterGen(reportController, combineAuthMiddleware);

  const quantityFormController = quantityFormControllerGen(quantityFormService);
  const quantityFormRouter = quantityFormRouterGen(quantityFormController);

  app.use(cors());

  app.use(express.json());

  app.use(express.urlencoded({ extended: false }));

  app.get('/otp/:phoneNumber', async (req, res) => {
    const otps = await otpService.getOTPS(req.params.phoneNumber);
    res.status(200).json(otps);
  });

  app.post('/hook', async (req, res) => {
    console.log(`body:  ${req.body}`);
    console.log(req.body);
    console.log(`params: ${req.params}`);
    console.log(req.params);
    console.log(`query: ${req.query}`);
    console.log(req.query);
    res.status(200).json('Hooked');
  });

  app.use('/api/v2/market/requests', marketRequestRouter);

  app.use('/api/v2/market/agents', agentRouter);

  app.use('/api/wholesalers/products', wholesalerProductRouter);

  app.use('/api/wholesalers/retailers', wholesalerRetailerRouter);

  app.use('/api/wholesalers', wholesalerRouter);

  app.use('/api/retailers/wholesalers', retailerWholesalerRouter);

  app.use('/api/retailers', retailerRouter);

  app.use('/api/products', productRouter);

  app.use('/api/invoices', invoiceRouter);

  app.use('/api/lists', listRouter);

  app.use('/api/reports', reportRouter);

  app.use('/api/quantity_forms', quantityFormRouter);

  app.get('/helps', (req, res) => {
    const helps = helpService.getHelpContacts();
    res.status(200).json(helps);
  });

  let error = '';
  app.post('/error', (req, res) => {
    error = req.query.error;
    res.status(200).json(error);
  });

  app.get('/error', (req, res) => {
    res.status(200).json(error);
  });
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
