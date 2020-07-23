/* eslint-disable no-underscore-dangle */
const mongoConnect = require('../src/data_access/connect');

let service = null;
let closeConn = null;

beforeAll(async () => {
  const { productService, closeConnect } = await mongoConnect(global.__MONGO_URI__);
  service = productService;
  closeConn = closeConnect;
});

describe('Add create product', () => {
  it('should not create if name is missing', async () => {
    const product = {};
    const { status, result } = await service.createProduct(product);
    expect(status).toBe(false);
    expect(result.length).toBe(1);
  });
  it('should create product if name is present', async () => {
    const product = { name: 'Phenobab' };
    const { status, result } = await service.createProduct(product);
    expect(status).toBe(true);
    expect(result).toBeDefined();
  });
});

afterAll(async done => {
  closeConn();
  done();
});