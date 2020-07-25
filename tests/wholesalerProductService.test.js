/* eslint-disable no-underscore-dangle */
const mongoConnect = require('../src/data_access/connect');

let service = null;
let testProduct = null;
let testWholesaler = null;
let closeConn = null;

beforeAll(async () => {
  const {
    wholesalerProductService,
    productService,
    wholesalerService,
    closeConnect,
    db,
  } = await mongoConnect(global.__MONGO_URI__);
  service = wholesalerProductService;
  db.collection('products').deleteMany({});
  testProduct = (await productService.createProduct({ name: 'Amalar' })).result;
  testWholesaler = (await wholesalerService.createWholesaler({
    fullName: 'Zemus kate',
    registrationNumber: '26dy3',
    phoneNumber: '081672552',
  })).result;
  closeConn = closeConnect;
});

describe('create wholesaler product', () => {
  it('should add product if object is valid', async () => {
    const wholesalerProduct = {
      wholesaler: testWholesaler._id,
      product: testProduct._id,
      pricePerPacket: 100,
      pricePerBox: 1000,
      pricePerCarton: 10000,
      quantity: 100,
    };
    const result = await service.createWholesalerProduct(wholesalerProduct);
    expect(result).toBeDefined();
    expect(result.pricePerCarton).toBe(10000);
  });
  it('should return null if product Id is valid', async () => {
    const wholesalerProduct = {
      wholesaler: testWholesaler._id,
      product: '823823jedee',
    };
    const result = await service.createWholesalerProduct(wholesalerProduct);
    expect(result).toBeNull();
  });
  it('should return null if wholesaler Id is valid', async () => {
    const wholesalerProduct = {
      wholesaler: '122139230913',
      product: testProduct._id,
    };
    const result = await service.createWholesalerProduct(wholesalerProduct);
    expect(result).toBeNull();
  });
  it('should return no Id is valid', async () => {
    const wholesalerProduct = {
      wholesaler: '122139230913',
      product: '123ekdkedek',
    };
    const result = await service.createWholesalerProduct(wholesalerProduct);
    expect(result).toBeNull();
  });
});

describe('wholesaler products', () => {
  it('should return wholesalers product', async () => {
    const wholesalerProducts = await service.getWholesalerProducts(testWholesaler._id);
    expect(wholesalerProducts.length).toBe(1);
    expect(wholesalerProducts[0].product.name).toBeDefined();
  });
});

describe('wholesaler product', () => {
  it('should return product if it exists', async () => {
    const product = await service.getWholesalerProduct(testWholesaler._id, testProduct._id);
    expect(product).toBeDefined();
    expect(product.product.name).toBeDefined();
    expect(product.pricePerBox).toBe(1000);
    expect(product.pricePerCarton).toBe(10000);
  });
  it('should return null if it does not exist', async () => {
    let product = await service.getWholesalerProduct('ue7edew', 'wiuyqw');
    expect(product).toBeNull();
    product = await service.getWholesalerProduct(testWholesaler._id, 'wiuyqw');
    expect(product).toBeNull();
    product = await service.getWholesalerProduct('wiuyqw', testProduct._id);
    expect(product).toBeNull();
  });
});

describe('update wholesaler product', () => {
  it('should update wholesaler product if wholesaler and product is valid', async () => {
    const newObj = { pricePerBox: 2000 };
    const result = await service.updateWholesalerProduct(
      testWholesaler._id, testProduct._id, newObj,
    );
    expect(result).toBeDefined();
    expect(result.pricePerBox).toBe(2000);
  });
  it('should return null if wholesaler and product is invalid', async () => {
    const newObj = { pricePerBox: 2000 };
    let result = await service.updateWholesalerProduct('rek34kjrkr', 'e43e3', newObj);
    expect(result).toBeNull();
    result = await service.updateWholesalerProduct(testWholesaler._id, 'deuid3', newObj);
    expect(result).toBeNull();
    result = await service.updateWholesalerProduct('deuid3', testProduct._id, newObj);
    expect(result).toBeNull();
  });
});

afterAll(done => {
  closeConn();
  done();
});