/* eslint-disable no-underscore-dangle */
const mongoConnect = require('../src/data_access/connect');

let service = null;
let testWholesaler = null;
let closeConn = null;
let pS = null;

beforeAll(async () => {
  const {
    wholesalerProductService,
    productService,
    wholesalerService,
    closeConnect,
  } = await mongoConnect(global.__MONGO_URI__);
  service = wholesalerProductService;

  testWholesaler = (await wholesalerService.createWholesaler({
    fullName: 'Zemus kate',
    registrationNumber: '26dy3',
    phoneNumber: '+2348167255286',
  })).result;
  closeConn = closeConnect;
  pS = productService;
});

describe('create wholesaler product', () => {
  it('should add product if object is valid', async () => {
    const testProduct = (await pS.createProduct({ name: 'Hamale', medicalName: 'Amalare' })).result;
    const wholesalerProduct = {
      wholesaler: testWholesaler._id,
      product: testProduct._id,
      pricePerPacket: 100,
      pricePerBox: 1000,
      pricePerCarton: 10000,
      quantity: 100,
    };
    const { status, result } = await service.createWholesalerProduct(wholesalerProduct);
    expect(status).toBe(true);
    expect(result).toBeDefined();
    expect(result.pricePerCarton).toBe(10000);
  });
  it('should return null if product Id is valid', async () => {
    const wholesalerProduct = {
      wholesaler: testWholesaler._id,
      product: '823823jedee',
    };
    const { result, status } = await service.createWholesalerProduct(wholesalerProduct);
    expect(status).toBe(false);
    expect(Array.isArray(result)).toBe(true);
  });
  it('should return no Id is valid', async () => {
    const wholesalerProduct = {
      wholesaler: '122139230913',
      product: '123ekdkedek',
    };
    const { result, status } = await service.createWholesalerProduct(wholesalerProduct);
    expect(status).toBe(false);
    expect(Array.isArray(result)).toBe(true);
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
    const testProduct = (await pS.createProduct({ name: 'Vargil', medicalName: 'Amalare' })).result;
    const nWholesalerProduct = {
      wholesaler: testWholesaler._id,
      product: testProduct._id.toString(),
      pricePerPacket: 100,
      pricePerBox: 1000,
      pricePerCarton: 10000,
      quantity: 100,
    };
    await service.createWholesalerProduct(nWholesalerProduct);
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
  });
});

describe('update wholesaler product', () => {
  it('should update wholesaler product if wholesaler and product is valid', async () => {
    const testProduct = (await pS.createProduct({ name: 'Calcimax', medicalName: 'Amalare' })).result;
    const nWholesalerProduct = {
      wholesaler: testWholesaler._id,
      product: testProduct._id.toString(),
      pricePerPacket: 100,
      pricePerBox: 1000,
      pricePerCarton: 10000,
      quantity: 100,
    };
    await service.createWholesalerProduct(nWholesalerProduct);
    const wholesalerProduct = {
      wholesaler: testWholesaler._id,
      product: testProduct._id,
      pricePerPacket: 100,
      pricePerBox: 1000,
      pricePerCarton: 10000,
      quantity: 100,
    };
    const product = await service.createWholesalerProduct(wholesalerProduct);
    const newObj = { pricePerBox: 2000 };
    const result = await service.updateWholesalerProduct(
      product.result._id, newObj,
    );
    expect(result).toBeDefined();
    expect(result.pricePerBox).toBe(2000);

    let updatedObj = await service.updateWholesalerProductQuantityTypePrice(
      testWholesaler._id, testProduct._id, 'Box', 5,
    );
    expect(updatedObj.pricePerBox).toBe(5);

    updatedObj = await service.updateWholesalerProductQuantityTypePrice(
      testWholesaler._id, testProduct._id, 'Satchet', 105,
    );
    expect(updatedObj.pricePerBox).toBe(5);
    expect(updatedObj.pricePerSatchet).toBe(105);
  });
  it('should return null if wholesaler and product is invalid', async () => {
    const newObj = { pricePerBox: 2000 };
    let result = await service.updateWholesalerProduct('rek34kjrkr', newObj);
    expect(result).toBeNull();
    result = await service.updateWholesalerProduct(testWholesaler._id, newObj);
    expect(result).toBeNull();
    result = await service.updateWholesalerProduct('deuid3', newObj);
    expect(result).toBeNull();
  });
});

describe('get wholesaler product cost price', () => {
  it('should get price if present', async () => {
    const wholesaler = '9f00d11c43efef01118298f0';
    const product = '5f76d11c34efef00008298f2';
    const wholesalerProduct = {
      wholesaler,
      product,
      pricePerPacket: 100,
      pricePerBox: 1000,
      pricePerSatchet: 50,
      pricePerCarton: 10000,
      quantity: 100,
    };
    await service.createWholesalerProduct(wholesalerProduct);
    expect(await service.getWholesalerProductCostPrice(wholesaler, product, 'Satchet')).toBe(50);
    expect(await service.getWholesalerProductCostPrice(wholesaler, product, 'Packet')).toBe(100);
    expect(await service.getWholesalerProductCostPrice(wholesaler, product, 'Box')).toBe(1000);
    expect(await service.getWholesalerProductCostPrice(wholesaler, product, 'Carton')).toBe(10000);
    expect(await service.getWholesalerProductCostPrice(wholesaler, product, 'unknwn')).toBe(0);
    expect(await service.getWholesalerProductCostPrice('fwfcwefcwd', product, 'Satchet')).toBe(0);
  });
});

test('get wholesalers product by group by medical name', async () => {
  const testProduct = (await pS.createProduct({ name: 'Zinat', medicalName: 'Worm' })).result;
  const wholesalerProduct = {
    wholesaler: testWholesaler._id,
    product: testProduct._id,
    pricePerPacket: 100,
    pricePerBox: 1000,
    pricePerCarton: 10000,
    quantity: 100,
  };
  await service.createWholesalerProduct(wholesalerProduct);
  const groupProducts = await service.getWholesalerProductsByGroups(testWholesaler._id);
  expect(groupProducts.length).toBe(2);
});

afterAll(done => {
  closeConn();
  done();
});