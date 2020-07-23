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
    expect(result._id).toBeDefined();
    expect(result).toBeDefined();
  });
});

describe('All products', () => {
  it('should return all products', async () => {
    const products = await service.getProducts();
    expect(products.length).toBe(1);
  });
});

describe('Product ', () => {
  it('should return product if id exists', async () => {
    const { result } = await service.createProduct({ name: 'lonely' });
    const product = await service.getProduct(result._id);
    expect(product).toBeDefined();
  });
});

afterAll(async done => {
  closeConn();
  done();
});