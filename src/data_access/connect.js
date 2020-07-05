const { connect, connection } = require('mongoose');
const wholesalerService = require('./services/wholesalerService');

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
    closeConnect: () => connection.close(),
  };
};

module.exports = mongoConnect;
