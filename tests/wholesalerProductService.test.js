/* eslint-disable no-underscore-dangle */
const mongoConnect = require('../src/data_access/connect');

let service = null;
let testProduct = null;
let testWholesaler = null;
let closeConn = null;

beforeAll(async () => {
  const {
    wholesalerProductSerice,
    productService,
    wholesalerService,
    closeConnect,
  } = await mongoConnect(global.__MONGO_URI__);
  service = wholesalerProductSerice;
  testProduct = await productService.createProduct({ name: 'Amalar' });
  testWholesaler = await wholesalerService.addWholesaler({
    fullName: 'Zemus kate',
    registrationNumber: '26dy3',
    phoneNumber: '081672552',
  });
  closeConn = closeConnect;
});

// describe('create wholesaler product', () => {
//   it('should add product if object is valid', async () => {
//     const 
//   });
// });