const { connect, connection } = require('mongoose');
const wholesalerService = require('./services/wholesalerService');
const otpService = require('./services/otpService');
const productService = require('./services/productService');
const wholesalerProductService = require('./services/wholesalerProductService');
const retailerService = require('./services/retailerService');
const invoiceService = require('./services/invoiceService');
const reportService = require('./services/reportService');
const quantityFormService = require('./services/quantityFormService');

const mongoConnect = async (URI) => {
  await connect(URI,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    },
    err => {
      if (err) {
        process.exit(1);
      }
    });
  return {
    wholesalerService,
    otpService,
    productService,
    wholesalerProductService,
    retailerService,
    invoiceService,
    quantityFormService,
    reportService,
    closeConnect: () => connection.close(),
    db: connection.db,
  };
};

module.exports = mongoConnect;
