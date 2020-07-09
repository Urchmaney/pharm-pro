const startApp = require('../src/app');

startApp()
  .then(app => app.listen(3000, () => { console.log('Application started at port 3000'); }))
  .catch(err => { console.log('error starting the application', err); });