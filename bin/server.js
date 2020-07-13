require('dotenv').config();
const startApp = require('../src/app');

const port = process.env.PORT || 3000;

startApp()
  .then(app => app.listen(port, () => { console.log(`Application started at port ${port}`); }))
  .catch(err => { console.log('error starting the application', err); });