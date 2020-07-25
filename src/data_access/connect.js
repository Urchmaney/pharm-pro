const { connect, connection } = require('mongoose');
const wholesalerService = require('./services/wholesalerService');
const otpService = require('./services/otpService');
const productService = require('./services/productService');
const wholesalerProductService = require('./services/wholesalerProductService');
const retailerService = require('./services/retailerService');

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
        console.log('Error connecting to Mongo DB', err);
        process.exit(1);
      }
    });
  return {
    wholesalerService,
    otpService,
    productService,
    wholesalerProductService,
    retailerService,
    closeConnect: () => connection.close(),
    db: connection.db,
  };
};

module.exports = mongoConnect;
