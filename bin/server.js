const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.json({ status: 'ok' }).status(200);
});

app.listen(3000, () => {
  console.log('Application started at port 3000');
});
